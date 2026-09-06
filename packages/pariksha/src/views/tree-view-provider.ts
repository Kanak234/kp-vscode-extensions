import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import { TestFile, TestScanner } from '../test-scanner';
export class ParikshaTreeItem extends vscode.TreeItem {
  constructor(
    public readonly testFile: TestFile,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(testFile.name, collapsibleState);
    
    this.tooltip = testFile.relativePath;
    this.description = testFile.relativePath.substring(0, testFile.relativePath.length - testFile.name.length);
    
    this.command = {
      command: 'vscode.open',
      title: 'Open Test File',
      arguments: [testFile.uri]
    };
    
    this.iconPath = this.getIconForStatus(testFile.status);
    this.contextValue = 'testFile';
  }

  private getIconForStatus(status: TestFile['status']): vscode.ThemeIcon {
    switch (status) {
      case 'passing':
        return new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
      case 'failing':
        return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
      case 'running':
        return new vscode.ThemeIcon('sync~spin', new vscode.ThemeColor('testing.iconQueued'));
      case 'untested':
      default:
        return new vscode.ThemeIcon('beaker', new vscode.ThemeColor('testing.iconUntested'));
    }
  }
}

export class ParikshaTreeViewProvider implements vscode.TreeDataProvider<ParikshaTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ParikshaTreeItem | undefined | void> = new vscode.EventEmitter<ParikshaTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ParikshaTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  private testFiles: TestFile[] = [];
  private readonly scanner: TestScanner;
  private readonly logger: Logger;

  constructor(scanner: TestScanner, logger: Logger) {
    this.scanner = scanner;
    this.logger = logger;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async loadTests(): Promise<void> {
    this.logger.info('Loading test files for TreeView');
    this.testFiles = await this.scanner.scanWorkspace();
    this.refresh();
  }

  getTreeItem(element: ParikshaTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ParikshaTreeItem): Promise<ParikshaTreeItem[]> {
    if (element) {
      // For now, it's a flat list. We could group by folder later.
      return [];
    }
    
    if (this.testFiles.length === 0) {
      // Lazy load if empty initially (but normally called explicitly)
      await this.loadTests();
    }
    
    return this.testFiles.map(tf => new ParikshaTreeItem(tf, vscode.TreeItemCollapsibleState.None));
  }
}
