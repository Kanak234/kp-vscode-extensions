import { describe, it, expect } from 'vitest';
import * as vscode from 'vscode';

describe('Sambandha — Peer Collaboration Engine', () => {
  it('should have configuration settings defined', () => {
    const cfg = vscode.workspace.getConfiguration('sambandha');
    expect(cfg).toBeDefined();
  });
});
