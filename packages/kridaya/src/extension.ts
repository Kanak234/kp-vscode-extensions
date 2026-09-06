import * as vscode from "vscode";
import { KridayaService } from "./kridayaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new KridayaService(context);

  // Register enable/disable commands - these disposables are auto-managed by VS Code
  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.enable", () => {
      service.enabled = true;
      service.updateStatusBar();
      vscode.window.showInformationMessage("Kridaya enabled");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.disable", () => {
      service.enabled = false;
      service.updateStatusBar();
      vscode.window.showInformationMessage("Kridaya disabled");
    })
  );

  // Register playground command
  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.startPlayground", () => {
      if (service.getEnabled()) {
        service.updateStatusBar();
        vscode.window.showInformationMessage("Kridaya playground activated!");
      } else {
        vscode.window.showInformationMessage("Kridaya is disabled. Enable it in settings.");
      }
    })
  );

  // Register effects configuration command
  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.configureEffects", () => {
      if (service.getEnabled()) {
        const intensity = vscode.workspace.getConfiguration("kridaya").get<number>("effects.intensity") ?? 0.5;
        vscode.window.showInformationMessage(`Kridaya effects intensity set to ${intensity}`);
      }
    })
  );

  // Register reduce motion command
  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.toggleReduceMotion", () => {
      if (service.getEnabled()) {
        const current = !vscode.workspace.getConfiguration("kridaya").get<boolean>("effects.reduceMotion", false);
        vscode.workspace.getConfiguration("kridaya").update("effects.reduceMotion", current, vscode.ConfigurationTarget.Global).then(() => {
          vscode.window.showInformationMessage(`Kridaya reduce motion: ${current}`);
          service.updateStatusBar();
        });
      }
    })
  )

  // Register sound toggle command
  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.toggleSound", () => {
      if (service.getEnabled()) {
        const current = !vscode.workspace.getConfiguration("kridaya").get<boolean>("sound.enabled", false);
        vscode.workspace.getConfiguration("kridaya").update("sound.enabled", current, vscode.ConfigurationTarget.Global).then(() => {
          vscode.window.showInformationMessage(`Kridaya sound: ${current}`);
        });
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kridaya.toggleEffects", () => {
      vscode.window.showInformationMessage("Kridaya: toggleEffects");
    })
  );

  return service;
}

export function deactivate() {}