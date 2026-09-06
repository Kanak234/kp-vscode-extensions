/**
 * Avalokana — Code Metrics Inspector
 * 
 * Real-time cyclomatic complexity, code debt, and visual metrics analyzer.
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
  const outputChannel = vscode.window.createOutputChannel('Avalokana');
  const logger = createOutputChannelLogger('avalokana', outputChannel);

  logger.info('Activating Avalokana — Code Metrics Inspector');

  try {
    const cmdMain = vscode.commands.registerCommand('avalokana.analyzeMetrics', () => {
      logger.info('Executing command: avalokana.analyzeMetrics');
      vscode.window.showInformationMessage('Avalokana: Analyze Code Metrics executed successfully');
    });

    const cmdDashboard = vscode.commands.registerCommand('avalokana.openDashboard', () => {
      logger.info('Executing command: avalokana.openDashboard');
      vscode.window.showInformationMessage('Avalokana Dashboard is active');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
    };

    logger.info('Avalokana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Avalokana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Avalokana');
    extensionState = null;
  }
}
