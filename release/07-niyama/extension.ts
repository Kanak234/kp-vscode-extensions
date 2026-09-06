import * as vscode from "vscode";
import { NiyamaService } from "./niyamaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new NiyamaService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.openControlCenter", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Niyama is disabled. Enable in settings.");
        return;
      }
      vscode.window.showInformationMessage("Niyama: Control center active");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.searchCommands", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Niyama is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Niyama: Search commands");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.favoriteToggle", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Niyama is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Niyama: Favorite toggled");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("niyama.recentClear", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Niyama is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Niyama: Recent items cleared");
    })
  );

  return service;
}

export function deactivate() {}