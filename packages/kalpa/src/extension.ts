import * as vscode from "vscode";
import { KalpaService } from "./kalpaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new KalpaService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.openTimeline", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Kalpa is disabled. Enable in settings.");
        return;
      }
      vscode.window.showInformationMessage("Kalpa: Timeline opened");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.restorePreview", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Kalpa is disabled.");
        return;
      }
      vscode.window.showWarningMessage(
        "Kalpa: Restore requires explicit confirmation. This has NOT been applied."
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.compareVersion", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Kalpa is disabled.");
        return;
      }
      vscode.window.showInformationMessage("Kalpa: Compare version");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kalpa.diffLines", () => {
      vscode.window.showInformationMessage("Kalpa: diffLines");
    })
  );

  return service;
}

export function deactivate() {}