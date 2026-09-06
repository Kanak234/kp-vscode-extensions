/**
 * Testing Utilities
 * 
 * Provides common test utilities:
 * - Test fixtures and helpers
 * - Golden file testing
 * - Mock factories
 * - Assertion helpers
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { ProcessResult, CompileResult, ToolchainInfo, UserFacingError } from '../types';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);

export interface TestFixture {
  name: string;
  path: string;
  content: string;
}

export interface GoldenTestOptions {
  updateGolden?: boolean;
  goldenDir?: string;
  normalize?: (content: string) => string;
}

/**
 * Create a temporary test directory
 */
export async function createTestDir(prefix = 'test-'): Promise<string> {
  const tempDir = path.join(process.cwd(), '.test-tmp', `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Clean up test directory
 */
export async function cleanupTestDir(dir: string): Promise<void> {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Create test files in a directory
 */
export async function createTestFiles(dir: string, files: TestFixture[]): Promise<void> {
  for (const file of files) {
    const filePath = path.join(dir, file.path);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, file.content);
  }
}

/**
 * Golden file testing - compare actual output with expected golden file
 */
export async function assertGoldenFile(
  actual: string,
  testName: string,
  options: GoldenTestOptions = {}
): Promise<void> {
  const goldenDir = options.goldenDir ?? path.join(process.cwd(), 'tests', 'golden');
  const goldenPath = path.join(goldenDir, `${testName}.golden`);

  const normalize = options.normalize ?? ((s) => s.replace(/\r\n/g, '\n').trimEnd());
  const normalizedActual = normalize(actual);

  if (options.updateGolden || process.env['UPDATE_GOLDEN'] === 'true') {
    await mkdir(goldenDir, { recursive: true });
    await writeFile(goldenPath, normalizedActual);
    return;
  }

  let expected: string;
  try {
    expected = await readFile(goldenPath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Golden file not found: ${goldenPath}. Run with UPDATE_GOLDEN=true to create.`);
    }
    throw error;
  }

  const normalizedExpected = normalize(expected);

  if (normalizedActual !== normalizedExpected) {
    const diff = generateDiff(normalizedExpected, normalizedActual);
    throw new Error(`Golden test failed for ${testName}:\n${diff}`);
  }
}

/**
 * Generate a simple diff between two strings
 */
function generateDiff(expected: string, actual: string): string {
  const expectedLines = expected.split('\n');
  const actualLines = actual.split('\n');
  const maxLines = Math.max(expectedLines.length, actualLines.length);

  let diff = '';
  for (let i = 0; i < maxLines; i++) {
    const exp = expectedLines[i];
    const act = actualLines[i];

    if (exp === act) {
      diff += `  ${exp}\n`;
    } else {
      if (exp !== undefined) diff += `- ${exp}\n`;
      if (act !== undefined) diff += `+ ${act}\n`;
    }
  }
  return diff;
}

/**
 * Create a mock process result
 */
export function createMockProcessResult(overrides: Partial<ProcessResult> = {}): ProcessResult {
  return {
    exitCode: 0,
    stdout: '',
    stderr: '',
    timedOut: false,
    killed: false,
    duration: 100,
    ...overrides,
  };
}

/**
 * Create a mock compile result
 */
export function createMockCompileResult(overrides: Partial<CompileResult> = {}): CompileResult {
  return {
    success: true,
    outputPath: '/tmp/test.out',
    stdout: '',
    stderr: '',
    exitCode: 0,
    diagnostics: [],
    ...overrides,
  };
}

/**
 * Create mock toolchain info
 */
export function createMockToolchainInfo(overrides: Partial<ToolchainInfo> = {}): ToolchainInfo {
  return {
    name: 'gcc',
    displayName: 'GCC',
    version: '12.2.0',
    path: '/usr/bin/gcc',
    status: 'working',
    details: 'GCC 12.2.0 found at /usr/bin/gcc',
    ...overrides,
  };
}

/**
 * Assert that an error is a user-facing error with expected properties
 */
export function assertUserFacingError(error: unknown, expectedCode?: string): UserFacingError {
  if (!error || typeof error !== 'object' || !('userFacing' in error)) {
    throw new Error('Expected error with userFacing property');
  }

  const extError = error as { userFacing: UserFacingError; code?: string };
  const userFacing = extError.userFacing;

  if (expectedCode && extError.code !== expectedCode) {
    throw new Error(`Expected error code ${expectedCode}, got ${extError.code}`);
  }

  if (!userFacing.whatHappened) throw new Error('Missing whatHappened');
  if (!userFacing.why) throw new Error('Missing why');
  if (!userFacing.whatUserCanDo || userFacing.whatUserCanDo.length === 0) {
    throw new Error('Missing whatUserCanDo');
  }
  if (!userFacing.errorCode) throw new Error('Missing errorCode');

  return userFacing;
}

/**
 * Wait for a condition with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Run a test with timeout
 */
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage = 'Operation timed out'): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

/**
 * Test that a function throws with specific error
 */
export async function expectThrow(fn: () => Promise<unknown> | unknown, expectedCode?: string): Promise<UserFacingError> {
  try {
    await fn();
    throw new Error('Expected function to throw');
  } catch (error) {
    return assertUserFacingError(error, expectedCode);
  }
}

/**
 * Create a test suite runner with setup/teardown
 */
export function createTestSuite(name: string) {
  const tests: Array<{ name: string; fn: () => Promise<void> }> = [];
  let beforeEachFn: (() => Promise<void>) | null = null;
  let afterEachFn: (() => Promise<void>) | null = null;
  let beforeAllFn: (() => Promise<void>) | null = null;
  let afterAllFn: (() => Promise<void>) | null = null;

  return {
    beforeAll(fn: () => Promise<void>) {
      beforeAllFn = fn;
      return this;
    },
    afterAll(fn: () => Promise<void>) {
      afterAllFn = fn;
      return this;
    },
    beforeEach(fn: () => Promise<void>) {
      beforeEachFn = fn;
      return this;
    },
    afterEach(fn: () => Promise<void>) {
      afterEachFn = fn;
      return this;
    },
    test(name: string, fn: () => Promise<void>) {
      tests.push({ name, fn });
      return this;
    },
    async run() {
      console.log(`\n📦 Running test suite: ${name}`);
      let passed = 0;
      let failed = 0;

      if (beforeAllFn) await beforeAllFn();

      for (const test of tests) {
        try {
          if (beforeEachFn) await beforeEachFn();
          await test.fn();
          if (afterEachFn) await afterEachFn();
          console.log(`  ✓ ${test.name}`);
          passed++;
        } catch (error) {
          if (afterEachFn) {
            try {
              await afterEachFn();
            } catch {
              // Ignore teardown errors
            }
          }
          console.log(`  ✗ ${test.name}: ${error instanceof Error ? error.message : String(error)}`);
          failed++;
        }
      }

      if (afterAllFn) await afterAllFn();

      console.log(`\n📊 ${name}: ${passed} passed, ${failed} failed`);
      if (failed > 0) {
        throw new Error(`${failed} test(s) failed`);
      }
    },
  };
}

/**
 * Benchmark a function
 */
export async function benchmark(name: string, fn: () => Promise<void> | void, iterations = 100): Promise<number> {
  // Warmup
  for (let i = 0; i < 10; i++) {
    await fn();
  }

  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  const end = process.hrtime.bigint();

  const totalNs = Number(end - start);
  const avgNs = totalNs / iterations;
  const avgMs = avgNs / 1_000_000;

  console.log(`⏱️  ${name}: ${avgMs.toFixed(3)}ms avg over ${iterations} iterations`);
  return avgMs;
}