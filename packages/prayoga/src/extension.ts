import * as vscode from "vscode";
import { PrayogaService } from "./prayogaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new PrayogaService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.runExperiment", () => {
      const type = vscode.workspace.getConfiguration("prayoga").get<string>("experiment.type") ?? "recursion";
      const mode = vscode.workspace.getConfiguration("prayoga").get<string>("results.mode") ?? "educational";
      vscode.window.showInformationMessage(
        `Prayoga: Running ${type} experiment (mode: ${mode})`
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.selectType", () => {
      vscode.window.showQuickPick(["recursion", "loop", "memory", "algorithm", "syntax", "performance"], {
        canPickMany: false,
      }).then((choice) => {
        if (choice) {
          vscode.workspace.getConfiguration("prayoga").update("experiment.type", choice, vscode.ConfigurationTarget.Global);
          vscode.window.showInformationMessage(`Experiment type set to ${choice}`);
        }
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.selectMode", () => {
      vscode.window.showQuickPick(["actual", "simulated", "educational"], { canPickMany: false }).then((choice) => {
        if (choice) {
          vscode.workspace.getConfiguration("prayoga").update("results.mode", choice, vscode.ConfigurationTarget.Global);
          vscode.window.showInformationMessage(`Result mode set to ${choice}`);
        }
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("prayoga.resetExperiment", () => {
      vscode.window.showInformationMessage("Prayoga: Reset");
    }),
    vscode.commands.registerCommand("prayoga.compareResults", () => {
      vscode.window.showInformationMessage("Prayoga: Compare");
    }),
    vscode.commands.registerCommand("prayoga.visualizeExperiment", () => {
      vscode.window.showInformationMessage("Prayoga: Visualize");
    }),
    vscode.commands.registerCommand("prayoga.exportExperiment", () => {
      vscode.window.showInformationMessage("Prayoga: Export");
    })
  );

  return service;
}

export function deactivate() {}