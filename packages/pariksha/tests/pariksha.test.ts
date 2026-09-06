import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Pariksha — Test Automation Suite', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('pariksha');
    expect(cfg).toBeDefined();
  });
});
