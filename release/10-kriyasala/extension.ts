/**
 * Kriyasala — Code Execution Lab
 * 
 * Main extension entry point for the VS Code extension.
 * Provides a graphical code execution environment for CS students.
 * Supports C, C++, Java, Python, JavaScript, and TypeScript via language adapters.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { StructuredLogger, createOutputChannelLogger, logError } from '@kanak-prabhakar/shared/logging';
import { ConfigValidator, createCommonSchema } from '@kanak-prabhakar/shared/config';
import { ToolchainDetector } from './diagnostics/toolchain-detector';
import { VyapakaWebviewProvider } from './webview/webview-provider';
import { VyapakaTreeViewProvider } from './views/tree-view-provider';
import { registerCommands } from './commands';

export interface KriyasalaExtensionContext {
  subscriptions: vscode.Disposable[];
  logger: StructuredLogger;
  config: ConfigValidator;
  detector: ToolchainDetector;
  webviewProvider: VyapakaWebviewProvider;
  treeViewProvider: VyapakaTreeViewProvider;
}

let extensionContext: KriyasalaExtensionContext | null = null;

/**
 * Activate the extension
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Create output channel for logging
  const outputChannel = vscode.window.createOutputChannel('Kriyasala');
  const logger = createOutputChannelLogger('kriyasala', outputChannel) as StructuredLogger;

  logger.info('Activating Kriyasala — Code Execution Lab');

  try {
    // Load configuration
    const configSchema = createCommonSchema({
      autoExecuteOnStartup: { type: 'boolean', default: false, description: 'Auto-run test on startup' },
      defaultTimeout: { type: 'number', default: 30000, minimum: 1000, description: 'Default execution timeout (ms)' },
      maxOutputSize: { type: 'number', default: 10485760, description: 'Maximum output size (bytes)' },
    });

    const config = new ConfigValidator({
      schema: configSchema,
      configPath: context.globalStorageUri ? path.join(context.globalStorageUri.fsPath, 'config.json') : undefined,
      logger,
    });

    await config.load();

    // Initialize core components
    const detector = new ToolchainDetector({
      customToolchains: config.get('customToolchains') ?? [],
      logger,
    });

    const webviewProvider = new VyapakaWebviewProvider(context.extensionUri, logger);
    const treeViewProvider = new VyapakaTreeViewProvider(detector, logger);

    // Register tree view
    const treeView = vscode.window.createTreeView('kriyasala.executionView', {
      treeDataProvider: treeViewProvider,
      showCollapseAll: true,
    });

    // Register webview
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider('kriyasala.dashboard', webviewProvider)
    );

    // Store context globally
    extensionContext = {
      subscriptions: context.subscriptions,
      logger,
      config,
      detector,
      webviewProvider,
      treeViewProvider,
    };

    // Register commands
    registerCommands(extensionContext);

    // Auto-execute on startup if enabled
    if (config.get('autoExecuteOnStartup')) {
      setTimeout(() => runExecution(extensionContext), 1000);
    }

    // Periodic checks
    const interval = config.get('checkInterval') as number;
    if (interval > 0) {
      const timer = setInterval(() => checkExecutionStatus(extensionContext), interval);
      context.subscriptions.push({ dispose: () => clearInterval(timer) });
    }

    // Update tree view when workspace folders change
    context.subscriptions.push(
      vscode.workspace.onDidChangeWorkspaceFolders(() => {
        treeViewProvider.refresh();
      })
    );

    logger.info('Kriyasala activated successfully');
  } catch (error) {
    logError(logger, error);
    vscode.window.showErrorMessage(`Kriyasala failed to activate: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Deactivate the extension
 */
export function deactivate(): void {
  if (extensionContext) {
    extensionContext.logger.info('Deactivating Kriyasala');
    extensionContext = null;
  }
}

/**
 * Run code execution workflow
 */
async function runExecution(ctx: KriyasalaExtensionContext): Promise<void> {
  ctx.logger.info('Starting code execution workflow');
  try {
    const toolchains = await ctx.detector.detectAll();
    ctx.treeViewProvider.updateToolchains(toolchains);
    ctx.webviewProvider.updateToolchains(toolchains);

    // Show summary notification
    const working = toolchains.filter((t) => t.status === 'working').length;
    const missing = toolchains.filter((t) => t.status === 'missing').length;

    if (missing > 0) {
      vscode.window.showWarningMessage(
        `Kriyasala: ${missing} toolchain(s) missing. Configure custom toolchains or install required compilers.`,
        'Open Dashboard'
      ).then((selection) => {
        if (selection === 'Open Dashboard') {
          vscode.commands.executeCommand('kriyasala.openDashboard');
        }
      });
    } else {
      ctx.logger.info(`Execution infrastructure ready: ${working} toolchains working`);
    }
  } catch (error) {
    logError(ctx.logger, error);
    vscode.window.showErrorMessage(`Execution workflow failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Check execution status (for periodic checks)
 */
async function checkExecutionStatus(ctx: KriyasalaExtensionContext): Promise<void> {
  try {
    const toolchains = await ctx.detector.detectAll();
    ctx.treeViewProvider.updateToolchains(toolchains);
    ctx.webviewProvider.updateToolchains(toolchains);
  } catch (error) {
    logError(ctx.logger, error);
  }
}