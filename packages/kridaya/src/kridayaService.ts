import * as vscode from "vscode";

export class KridayaService {
  private readonly _statusBar: vscode.StatusBarItem;
  private _enabled: boolean = false;
  private readonly _onConfigurationChanged: (e: vscode.ConfigurationChangeEvent) => void;
  private readonly _disposable: vscode.Disposable;

  constructor(_context: vscode.ExtensionContext) {
    this._statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this._statusBar.tooltip = "Kridaya: Toggle Playground";
    this._statusBar.text = "$(play) Kridaya";
    this._statusBar.command = "kridaya.startPlayground";
    this._statusBar.show();

    this._onConfigurationChanged = (_e: vscode.ConfigurationChangeEvent) => {
      this.updateStatusBar();
    };
    this._disposable = vscode.Disposable.from(
      vscode.workspace.onDidChangeConfiguration(this._onConfigurationChanged)
    );
  }

  dispose(): void {
    this._disposable.dispose();
    this._statusBar.dispose();
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  getEnabled(): boolean {
    return this._enabled;
  }

  updateStatusBar(): void {
    const enabled = this._enabled;
    this._statusBar.text = enabled ? "$(play) Kridaya" : "$(play) Kridaya";
    this._statusBar.tooltip = enabled
      ? "Kridaya: Click to disable"
      : "Kridaya: Click to enable";
  }

  activate(): void {
    // no-op; commands are registered in extension.ts
  }
}