import * as vscode from "vscode";
import { VibhramaService } from "./vibhramaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new VibhramaService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("vibhrama.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vibhrama.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vibhrama.analyze", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Vibhrama is disabled. Enable in settings.");
        return;
      }
      const mode = vscode.workspace.getConfiguration("vibhrama").get<string>("mode") ?? "actual";
      vscode.window.showInformationMessage(
        `Vibhrama: ${mode === "actual" ? "Actual execution analysis" : "Visual simulation"}`
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vibhrama.toggleSimulation", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Vibhrama is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Vibhrama: Simulation toggle");
    })
  );

  return service;
}

export function deactivate() {}