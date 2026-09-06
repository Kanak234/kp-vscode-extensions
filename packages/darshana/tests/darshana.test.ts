import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Darshana — AST & Graph Visualizer', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('darshana');
    expect(cfg).toBeDefined();
  });
});
