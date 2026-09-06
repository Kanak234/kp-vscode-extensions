/**
 * Anumana — AI Code Inference
 * 
 * Lightweight AI-assisted code inference, type prediction, and logic checking.
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
  const outputChannel = vscode.window.createOutputChannel('Anumana');
  const logger = createOutputChannelLogger('anumana', outputChannel);

  logger.info('Activating Anumana — AI Code Inference');

  try {
    const cmdMain = vscode.commands.registerCommand('anumana.infer', () => {
      logger.info('Executing command: anumana.infer');
      vscode.window.showInformationMessage('Anumana: Infer Code Logic executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('anumana.openDashboard', () => {
      logger.info('Executing command: anumana.openDashboard');
      vscode.window.showInformationMessage('Anumana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Anumana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Anumana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Anumana');
    extensionState = null;
  }
}
