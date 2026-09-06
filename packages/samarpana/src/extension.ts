/**
 * Samarpana — Assignment Submission Manager
 * 
 * Student assignment submission, grading check, and feedback manager.
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
  const outputChannel = vscode.window.createOutputChannel('Samarpana');
  const logger = createOutputChannelLogger('samarpana', outputChannel);

  logger.info('Activating Samarpana — Assignment Submission Manager');

  try {
    const cmdMain = vscode.commands.registerCommand('samarpana.submitAssignment', () => {
      logger.info('Executing command: samarpana.submitAssignment');
      vscode.window.showInformationMessage('Samarpana: Submit Assignment executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('samarpana.openDashboard', () => {
      logger.info('Executing command: samarpana.openDashboard');
      vscode.window.showInformationMessage('Samarpana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Samarpana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Samarpana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Samarpana');
    extensionState = null;
  }
}
