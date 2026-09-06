import { describe, it, expect, vi } from 'vitest';
import { CodeExecutor } from '../src/execution/executor';
import { Logger } from '@kanak-prabhakar/shared/types';

describe('Kriyasala - Code Execution Lab', () => {
  const mockLogger: Logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };

  it('should instantiate CodeExecutor', () => {
    const executor = new CodeExecutor([process.cwd()], mockLogger);
    expect(executor).toBeDefined();
  });
});
