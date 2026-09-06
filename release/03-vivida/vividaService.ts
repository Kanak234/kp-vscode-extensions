import * as vscode from "vscode";

export class VividaService {
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
}