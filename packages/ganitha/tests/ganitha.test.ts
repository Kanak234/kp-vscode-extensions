import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Ganitha — Math & Algorithm Solver', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('ganitha');
    expect(cfg).toBeDefined();
  });
});
