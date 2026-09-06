import * as vscode from 'vscode';
import { Logger } from '@kanak-prabhakar/shared/types';
import * as path from 'path';

export interface TestFile {
  uri: vscode.Uri;
  name: string;
  relativePath: string;
  status: 'untested' | 'passing' | 'failing' | 'running';
  lastRun?: number;
}

export class TestScanner {
  private readonly logger: Logger;
  private readonly patterns: string[];
  
  constructor(logger: Logger, patterns: string[] = ['**/*.test.ts', '**/*.spec.ts', '**/*_test.py', '**/*_test.cpp']) {
    this.logger = logger;
    this.patterns = patterns;
  }

  async scanWorkspace(): Promise<TestFile[]> {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
      this.logger.info('No workspace folders found for test scanning.');
      return [];
    }

    this.logger.info(`Scanning for test files using patterns: ${this.patterns.join(', ')}`);
    
    const allFiles: TestFile[] = [];
    
    for (const pattern of this.patterns) {
      try {
        const uris = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        for (const uri of uris) {
          const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
          const relativePath = workspaceFolder 
            ? path.relative(workspaceFolder.uri.fsPath, uri.fsPath) 
            : path.basename(uri.fsPath);
            
          allFiles.push({
            uri,
            name: path.basename(uri.fsPath),
            relativePath,
            status: 'untested'
          });
        }
      } catch (err) {
        this.logger.error(`Error scanning for pattern ${pattern}`, { error: String(err) });
      }
    }

    this.logger.info(`Found ${allFiles.length} test files.`);
    
    // Sort alphabetically by path
    return allFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }
}
