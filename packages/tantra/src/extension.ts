/**
 * Tantra — Code Generation Engine
 * 
 * Boilerplate, data structure, and API wrapper generator.
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
  const outputChannel = vscode.window.createOutputChannel('Tantra');
  const logger = createOutputChannelLogger('tantra', outputChannel);

  logger.info('Activating Tantra — Code Generation Engine');

  try {
    const cmdMain = vscode.commands.registerCommand('tantra.generateCode', () => {
      logger.info('Executing command: tantra.generateCode');
      vscode.window.showInformationMessage('Tantra: Generate Code Snippet executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('tantra.openDashboard', () => {
      logger.info('Executing command: tantra.openDashboard');
      vscode.window.showInformationMessage('Tantra Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Tantra activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Tantra failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Tantra');
    extensionState = null;
  }
}
