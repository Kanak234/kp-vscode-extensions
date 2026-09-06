import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Anumana — AI Code Inference', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('anumana');
    expect(cfg).toBeDefined();
  });
});
