import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import * as minimatch from 'minimatch';

export class PolicyEnforcer {
  private readonly logger: Logger;
  private lockedPatterns: string[] = [];
  private warningPatterns: string[] = [];

  constructor(logger: Logger) {
    this.logger = logger;
    this.loadConfig();
    
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('adhikarana')) {
        this.loadConfig();
      }
    });
  }

  private loadConfig(): void {
    const config = vscode.workspace.getConfiguration('adhikarana');
    this.lockedPatterns = config.get<string[]>('lockedFiles') ?? [];
    this.warningPatterns = config.get<string[]>('warningFiles') ?? [];
    this.logger.info(`Loaded ${this.lockedPatterns.length} locked patterns and ${this.warningPatterns.length} warning patterns.`);
  }

  public register(context: vscode.ExtensionContext): void {
    // Prevent edits on locked files
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(e => this.handleDocumentChange(e))
    );

    // Warn on saving warning files
    context.subscriptions.push(
      vscode.workspace.onWillSaveTextDocument(e => this.handleWillSave(e))
    );
  }

  private handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
    if (event.contentChanges.length === 0) return;

    const uri = event.document.uri;
    if (uri.scheme !== 'file') return;

    const relativePath = vscode.workspace.asRelativePath(uri);
    
    // Check locked patterns
    const isLocked = this.lockedPatterns.some(pattern => minimatch.minimatch(relativePath, pattern));
    
    if (isLocked) {
      this.logger.warn(`Blocked edit on locked file: ${relativePath}`);
      vscode.window.showErrorMessage(`Adhikarana: Editing ${relativePath} is governed and locked by project policy.`);
      // Note: We can't synchronously revert the edit via onDidChangeTextDocument safely without causing a loop.
      // In a real extension, we might use a TextDocumentContentProvider or FileSystemProvider to make it strictly readonly,
      // but showing a warning is a good start for this layer.
    }
  }

  private handleWillSave(event: vscode.TextDocumentWillSaveEvent): void {
    const uri = event.document.uri;
    if (uri.scheme !== 'file') return;

    const relativePath = vscode.workspace.asRelativePath(uri);
    
    const isWarning = this.warningPatterns.some(pattern => minimatch.minimatch(relativePath, pattern));
    
    if (isWarning) {
      this.logger.info(`Warning on save: ${relativePath}`);
      vscode.window.showWarningMessage(`Adhikarana: You are saving ${relativePath}, which is flagged for review under project governance.`);
    }
  }
}
