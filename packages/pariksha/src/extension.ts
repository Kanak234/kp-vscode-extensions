/**
 * Pariksha — Test Automation Suite
 * 
 * Automated test runner, assertion generator, and coverage report viewer.
 */

import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import { createOutputChannelLogger, logError } from '@kanak-prabhakar/shared/logging';
import { TestScanner } from './test-scanner';
import { ParikshaTreeViewProvider } from './views/tree-view-provider';

export interface ExtensionContextState {
  subscriptions: vscode.Disposable[];
  logger: Logger;
  scanner: TestScanner;
  treeViewProvider: ParikshaTreeViewProvider;
}

let extensionState: ExtensionContextState | null = null;

export async function activate(context: vscode.ExtensionContext): Promise<ExtensionContextState | undefined> {
  const outputChannel = vscode.window.createOutputChannel('Pariksha');
  const logger = createOutputChannelLogger('pariksha', outputChannel);

  logger.info('Activating Pariksha — Test Automation Suite');

  try {
    const config = vscode.workspace.getConfiguration('pariksha');
    const patterns = config.get<string[]>('testPatterns') ?? ['**/*.test.ts', '**/*.spec.ts', '**/*_test.py'];
    
    const scanner = new TestScanner(logger, patterns);
    const treeViewProvider = new ParikshaTreeViewProvider(scanner, logger);

    const treeView = vscode.window.createTreeView('pariksha.testExplorer', {
      treeDataProvider: treeViewProvider,
      showCollapseAll: true,
    });
    context.subscriptions.push(treeView);

    // Initial load
    setTimeout(() => treeViewProvider.loadTests(), 1000);

    const cmdRun = vscode.commands.registerCommand('pariksha.runTests', async () => {
      logger.info('Executing command: pariksha.runTests');
      vscode.window.showInformationMessage('Pariksha: Discovering and running tests...');
      await treeViewProvider.loadTests();
      // Placeholder for actual test runner execution logic which would use CodeExecutor/ProcessExecutor
    });

    const cmdDashboard = vscode.commands.registerCommand('pariksha.openDashboard', () => {
      logger.info('Executing command: pariksha.openDashboard');
      vscode.window.showInformationMessage('Pariksha Dashboard is active');
    });

    context.subscriptions.push(cmdRun, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
      scanner,
      treeViewProvider
    };

    logger.info('Pariksha activated successfully');
    return extensionState;
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Pariksha failed to activate');
    return undefined;
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Pariksha');
    extensionState = null;
  }
}
