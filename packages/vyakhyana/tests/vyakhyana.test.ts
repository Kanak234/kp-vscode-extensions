import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Vyakhyana — Code Explanation Engine', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('vyakhyana');
    expect(cfg).toBeDefined();
  });
});
