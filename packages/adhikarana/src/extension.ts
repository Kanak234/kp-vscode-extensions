/**
 * Adhikarana — Governance & Access Engine
 * 
 * Role-based access control, security policies, and workspace governance for CS projects.
 */

import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import { createOutputChannelLogger, logError } from '@kanak-prabhakar/shared/logging';
import { PolicyEnforcer } from './governance/policy-enforcer';

export interface ExtensionContextState {
  subscriptions: vscode.Disposable[];
  logger: Logger;
  enforcer: PolicyEnforcer;
}

let extensionState: ExtensionContextState | null = null;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel('Adhikarana');
  const logger = createOutputChannelLogger('adhikarana', outputChannel);

  logger.info('Activating Adhikarana — Governance & Access Engine');

  try {
    const enforcer = new PolicyEnforcer(logger);
    enforcer.register(context);

    const cmdMain = vscode.commands.registerCommand('adhikarana.checkPermissions', () => {
      logger.info('Executing command: adhikarana.checkPermissions');
      vscode.window.showInformationMessage('Adhikarana: Workspace governance rules are active.');
    });

    const cmdDashboard = vscode.commands.registerCommand('adhikarana.openDashboard', () => {
      logger.info('Executing command: adhikarana.openDashboard');
      vscode.window.showInformationMessage('Adhikarana: Settings can be configured in workspace settings (adhikarana.lockedFiles)');
      vscode.commands.executeCommand('workbench.action.openSettings', 'adhikarana');
    });

    context.subscriptions.push(cmdMain, cmdDashboard);

    extensionState = {
      subscriptions: context.subscriptions,
      logger,
      enforcer
    };

    logger.info('Adhikarana activated successfully');
  } catch (error) {
    logError(logger, error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage('Adhikarana failed to activate');
  }
}

export function deactivate(): void {
  if (extensionState) {
    extensionState.logger.info('Deactivating Adhikarana');
    extensionState = null;
  }
}
