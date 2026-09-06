/**
 * Sambandha — Peer Collaboration Engine
 * 
 * Peer-to-peer live workspace sharing and pair programming session manager.
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
  const outputChannel = vscode.window.createOutputChannel('Sambandha');
  const logger = createOutputChannelLogger('sambandha', outputChannel);

  logger.info('Activating Sambandha — Peer Collaboration Engine');

  try {
    const cmdMain = vscode.commands.registerCommand('sambandha.startSession', () => {
      logger.info('Executing command: sambandha.startSession');
      vscode.window.showInformationMessage('Sambandha: Start Collaboration Session executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('sambandha.openDashboard', () => {
      logger.info('Executing command: sambandha.openDashboard');
      vscode.window.showInformationMessage('Sambandha Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Sambandha activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Sambandha failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Sambandha');
    extensionState = null;
  }
}
