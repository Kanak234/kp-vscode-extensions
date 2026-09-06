/**
 * Ganitha — Math & Algorithm Solver
 * 
 * Symbolic math computation, algorithm step tracer, and numerical solver.
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
  const outputChannel = vscode.window.createOutputChannel('Ganitha');
  const logger = createOutputChannelLogger('ganitha', outputChannel);

  logger.info('Activating Ganitha — Math & Algorithm Solver');

  try {
    const cmdMain = vscode.commands.registerCommand('ganitha.evaluateExpression', () => {
      logger.info('Executing command: ganitha.evaluateExpression');
      vscode.window.showInformationMessage('Ganitha: Evaluate Expression executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('ganitha.openDashboard', () => {
      logger.info('Executing command: ganitha.openDashboard');
      vscode.window.showInformationMessage('Ganitha Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Ganitha activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Ganitha failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Ganitha');
    extensionState = null;
  }
}
