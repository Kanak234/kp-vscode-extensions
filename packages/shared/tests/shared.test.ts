import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeShellArg, redactSecrets } from '../src/security';
import { createLogger } from '../src/logging';

describe('Shared Package - Security & Logging', () => {
  it('should sanitize HTML input', () => {
    const sanitized = sanitizeInput('<div>Hello</div>');
    expect(sanitized).not.toContain('<div>');
    expect(sanitized).toContain('&lt;div&gt;');
  });

  it('should detect shell injection metacharacters', () => {
    expect(() => sanitizeShellArg('hello; rm -rf /')).toThrow();
    expect(sanitizeShellArg('hello-world')).toBe('hello-world');
  });

  it('should redact sensitive secrets in output', () => {
    const redacted = redactSecrets('api_key = "12345678901234567890"');
    expect(redacted).toContain('[REDACTED]');
  });

  it('should create a structured logger instance', () => {
    const logger = createLogger('test');
    expect(logger).toBeDefined();
  });
});

import { ProcessExecutor } from '../src/process';
import * as path from 'path';

describe('ProcessManager Security', () => {
  it('should block path prefix collisions logically', async () => {
    const manager = new ProcessExecutor();
    const maliciousCmd = path.resolve('/workspace/application/test.sh');
    const safeCwd = path.resolve('/workspace/app');
    
    await expect(
      manager.execute({ command: maliciousCmd, args: [], cwd: safeCwd })
    ).rejects.toThrow('Executable path is outside the allowed working directory');
  });
});
