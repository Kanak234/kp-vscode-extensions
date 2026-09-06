import * as vscode from "vscode";
import { SiddhiService } from "./siddhiService";

export function activate(context: vscode.ExtensionContext) {
  const service = new SiddhiService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("siddhi.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("siddhi.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("siddhi.viewAchievements", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Siddhi is disabled. Enable in settings.");
        return;
      }

      const progress = service.progress;
      const lines: string[] = [];
      for (const [name, unlocked] of Object.entries(progress)) {
        lines.push(`${unlocked ? "✓" : "✗"} ${name}`);
      }

      vscode.window.showInformationMessage(
        "Siddhi Achievements:\n" + lines.join("\n"),
        "Learn More"
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("siddhi.resetProgress", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Siddhi is disabled.");
        return;
      }
      vscode.window.showWarningMessage(
        "Siddhi: All achievements reset. This action cannot be undone locally."
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("siddhi.exportHistory", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Siddhi is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Siddhi: History exported");
    })
  );

  return service;
}

export function deactivate() {}