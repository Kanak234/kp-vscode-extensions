import * as vscode from "vscode";

export class SiddhiService {
  // progress is accessible from extension.ts directly
  readonly progress: Record<string, boolean> = {
    "First Build": false,
    "First Test": false,
    "First Debug Session": false,
    "First Successful Project": false,
    "100 Successful Runs": false,
    "First Git Commit": false,
    "First Refactor": false,
    "First Passing Test Suite": false
  };

  constructor(_context: vscode.ExtensionContext) {
    // no disposables needed for basic configuration
  }

  get enabled(): boolean {
    return true;
  }

  set enabled(_value: boolean) {
    // no-op
  }

  getEnabled(): boolean {
    return true;
  }

  activate(): void {
    // commands registered in extension.ts
  }

  recordAchievement(name: string): void {
    if (this.progress[name] !== undefined) {
      this.progress[name] = true;
    }
  }
}