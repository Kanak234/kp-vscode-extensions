/**
 * Darshana — AST & Graph Visualizer
 * 
 * AST graph visualizer and dependency tree inspector for programming languages.
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
  const outputChannel = vscode.window.createOutputChannel('Darshana');
  const logger = createOutputChannelLogger('darshana', outputChannel);

  logger.info('Activating Darshana — AST & Graph Visualizer');

  try {
    const cmdMain = vscode.commands.registerCommand('darshana.showAst', () => {
      logger.info('Executing command: darshana.showAst');
      vscode.window.showInformationMessage('Darshana: Show AST Graph executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('darshana.openDashboard', () => {
      logger.info('Executing command: darshana.openDashboard');
      vscode.window.showInformationMessage('Darshana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Darshana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Darshana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Darshana');
    extensionState = null;
  }
}
