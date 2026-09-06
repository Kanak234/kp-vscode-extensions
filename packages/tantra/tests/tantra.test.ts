import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Tantra — Code Generation Engine', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('tantra');
    expect(cfg).toBeDefined();
  });
});
