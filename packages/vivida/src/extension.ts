import * as vscode from "vscode";
import { VividaService } from "./vividaService";

export function activate(context: vscode.ExtensionContext) {
  const service = new VividaService(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("vivida.enable", () => {
      service.enabled = true;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vivida.disable", () => {
      service.enabled = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vivida.diagnose", () => {
      if (!service.getEnabled()) {
        vscode.window.showInformationMessage("Vivida diagnostics are disabled. Enable in settings.");
        return;
      }

      const technical = "Undefined reference: function not found in any object file";
      const humorous = "Your linker looked everywhere. The function did not attend the meeting.";

      vscode.window.showInformationMessage(
        `${humorous}\n\n${technical}`,
        "Show Technical Only"
      ).then((selection) => {
        if (selection !== "Show Technical Only") {
          vscode.window.showInformationMessage(`Technical: ${technical}`);
        }
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vivida.toggleHumor", () => {
      if (service.getEnabled()) {
        vscode.window.showInformationMessage("Vivida humor toggle");
      }
    })
  );

  return service;
}

export function deactivate() {}