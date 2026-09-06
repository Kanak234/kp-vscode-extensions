/**
 * Samvada — Contextual AI Assistant
 * 
 * Interactive inline assistant for coding questions, debugging, and hints.
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
  const outputChannel = vscode.window.createOutputChannel('Samvada');
  const logger = createOutputChannelLogger('samvada', outputChannel);

  logger.info('Activating Samvada — Contextual AI Assistant');

  try {
    const cmdMain = vscode.commands.registerCommand('samvada.openChat', () => {
      logger.info('Executing command: samvada.openChat');
      vscode.window.showInformationMessage('Samvada: Open Contextual Chat executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('samvada.openDashboard', () => {
      logger.info('Executing command: samvada.openDashboard');
      vscode.window.showInformationMessage('Samvada Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Samvada activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Samvada failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Samvada');
    extensionState = null;
  }
}
