import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Svasthya — System Health Monitor', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('svasthya');
    expect(cfg).toBeDefined();
  });
});
