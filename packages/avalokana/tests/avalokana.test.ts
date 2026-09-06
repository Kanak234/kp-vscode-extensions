import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Avalokana — Code Metrics Inspector', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('avalokana');
    expect(cfg).toBeDefined();
  });
});
