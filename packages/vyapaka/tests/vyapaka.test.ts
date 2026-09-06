import { describe, it, expect } from 'vitest';
import { ToolchainDetector } from '../src/diagnostics/toolchain-detector';

describe('Vyapaka - Environment Doctor', () => {
  it('should instantiate ToolchainDetector', () => {
    const detector = new ToolchainDetector();
    expect(detector).toBeDefined();
  });

  it('should retrieve platform information', () => {
    const detector = new ToolchainDetector();
    const platform = detector.getPlatformInfo();
    expect(platform.os).toBe(process.platform);
    expect(platform.arch).toBe(process.arch);
  });
});
