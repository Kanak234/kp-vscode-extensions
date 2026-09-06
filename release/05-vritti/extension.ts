import * as vscode from "vscode";
import { VrittiService } from "./vrittiService";

export function activate(context: vscode.ExtensionContext) {
  const service = new VrittiService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("vritti.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vritti.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vritti.showDashboard", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Vritti is disabled. Enable in settings.");
        return;
      }

      const activeEditor = vscode.window.activeTextEditor;
      const editorInfo = activeEditor ? `${activeEditor.document.fileName} (${activeEditor.document.lineCount} lines)` : "UNAVAILABLE";

      const tasksInfo = "UNAVAILABLE";
      const extensionsInfo = `${vscode.extensions.all.length} extensions`;
      const buildInfo = "UNAVAILABLE";
      const testInfo = "UNAVAILABLE";
      const debugState = vscode.debug.activeDebugSession ? "Debugging" : "Idle";
      const debugInfo = debugState;

      const panels: string[] = [
        `Active Editor: ${editorInfo}`,
        `Running Tasks: ${tasksInfo}`,
        `Extension Activity: ${extensionsInfo}`,
        `Build Status: ${buildInfo}`,
        `Test Status: ${testInfo}`,
        `Debug State: ${debugInfo}`
      ];

      vscode.window.showInformationMessage(
        "Vritti Dashboard:\n" + panels.join("\n"),
        "Copy to Clipboard"
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vritti.refreshMetrics", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Vritti is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Vritti: Metrics refreshed");
    })
  );

  return service;
}

export function deactivate() {}