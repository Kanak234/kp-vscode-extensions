/**
 * Rachana — Project Scaffolding
 * 
 * Instant CS laboratory template generator and boilerplate scaffolder.
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
  const outputChannel = vscode.window.createOutputChannel('Rachana');
  const logger = createOutputChannelLogger('rachana', outputChannel);

  logger.info('Activating Rachana — Project Scaffolding');

  try {
    const cmdMain = vscode.commands.registerCommand('rachana.createProject', () => {
      logger.info('Executing command: rachana.createProject');
      vscode.window.showInformationMessage('Rachana: Create Project Scaffold executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('rachana.openDashboard', () => {
      logger.info('Executing command: rachana.openDashboard');
      vscode.window.showInformationMessage('Rachana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Rachana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Rachana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Rachana');
    extensionState = null;
  }
}
