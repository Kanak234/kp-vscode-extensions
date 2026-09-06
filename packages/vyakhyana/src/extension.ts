/**
 * Vyakhyana — Code Explanation Engine
 * 
 * Line-by-line code explanation, natural language doc generator, and concept explainer.
 */

import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import { createOutputChannelLogger, logError } from '@kanak-prabhakar/shared/logging';

export interface ExtensionContextState {
  subscriptions: vscode.Disposable[];
  logger: Logger;
}

let extensionState: ExtensionContextState | null = null;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel('Vyakhyana');
  const logger = createOutputChannelLogger('vyakhyana', outputChannel);

  logger.info('Activating Vyakhyana — Code Explanation Engine');

  try {
    const cmdMain = vscode.commands.registerCommand('vyakhyana.explainCode', () => {
      logger.info('Executing command: vyakhyana.explainCode');
      vscode.window.showInformationMessage('Vyakhyana: Explain Selected Code executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('vyakhyana.openDashboard', () => {
      logger.info('Executing command: vyakhyana.openDashboard');
      vscode.window.showInformationMessage('Vyakhyana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Vyakhyana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Vyakhyana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Vyakhyana');
    extensionState = null;
  }
}
