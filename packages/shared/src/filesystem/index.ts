/**
 * Safe File System Operations
 * 
 * Provides secure file operations with:
 * - Workspace boundary enforcement
 * - Path traversal prevention
 * - Symlink handling
 * - Permission checking
 * - Atomic writes
 * - Safe deletion
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { ExtensionError, Logger } from '../types';

const fsPromises = fs.promises;
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export interface FileSystemOptions {
  workspaceRoots: string[];
  allowSymlinks?: boolean;
  maxFileSize?: number;
  allowedExtensions?: string[];
}

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  modifiedTime: Date;
  createdTime: Date;
  permissions: string;
  mimeType?: string;
}

export interface DirectoryTree {
  path: string;
  name: string;
  children: (DirectoryTree | FileInfo)[];
}

export class SafeFileSystem {
  private readonly workspaceRoots: string[];
  private readonly maxFileSize: number;

  constructor(options: FileSystemOptions, _logger?: Logger) {
    this.workspaceRoots = options.workspaceRoots.map((root) => path.resolve(root));
    this.maxFileSize = options.maxFileSize ?? 50 * 1024 * 1024; // 50MB default
  }

  /**
   * Validate that a path is within workspace boundaries
   */
  validatePath(inputPath: string): string {
    if (!inputPath || typeof inputPath !== 'string') {
      throw this.createError('INVALID_PATH', 'Path must be a non-empty string');
    }

    const resolved = path.resolve(inputPath);

    // Check for path traversal attempts
    if (resolved.includes('..')) {
      const normalized = path.normalize(inputPath);
      if (normalized !== inputPath && normalized.includes('..')) {
        throw this.createError('PATH_TRAVERSAL', 'Path contains directory traversal sequences');
      }
    }

    // Check if path is within any workspace root
    const inWorkspace = this.workspaceRoots.some((root) => {
      const relative = path.relative(root, resolved);
      return !relative.startsWith('..') && !path.isAbsolute(relative);
    });

    if (!inWorkspace && this.workspaceRoots.length > 0) {
      throw this.createError(
        'PATH_OUTSIDE_WORKSPACE',
        `Path '${resolved}' is outside workspace boundaries`,
        'Use paths within your workspace folders'
      );
    }

    return resolved;
  }

  /**
   * Read file content safely
   */
  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    const validatedPath = this.validatePath(filePath);
    await this.checkFileAccess(validatedPath, 'read');

    const stats = await stat(validatedPath);
    if (stats.size > this.maxFileSize) {
      throw this.createError(
        'FILE_TOO_LARGE',
        `File size (${stats.size} bytes) exceeds limit (${this.maxFileSize} bytes)`,
        'Use a smaller file or increase the limit'
      );
    }

    return readFile(validatedPath, encoding);
  }

  /**
   * Write file content safely (atomic)
   */
  async writeFile(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): Promise<void> {
    const validatedPath = this.validatePath(filePath);
    await this.checkFileAccess(validatedPath, 'write');

    const dir = path.dirname(validatedPath);
    await this.ensureDirectory(dir);

    // Atomic write: write to temp file then rename
    const tempPath = `${validatedPath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    try {
      await writeFile(tempPath, content, encoding);
      await fsPromises.rename(tempPath, validatedPath);
    } catch (error) {
      // Cleanup temp file on failure
      try {
        await unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  /**
   * Delete file safely
   */
  async deleteFile(filePath: string): Promise<void> {
    const validatedPath = this.validatePath(filePath);
    await this.checkFileAccess(validatedPath, 'delete');

    const stats = await lstat(validatedPath);
    if (stats.isDirectory()) {
      throw this.createError('IS_DIRECTORY', 'Cannot delete directory with deleteFile, use deleteDirectory');
    }

    await unlink(validatedPath);
  }

  /**
   * Delete directory recursively
   */
  async deleteDirectory(dirPath: string, recursive = false): Promise<void> {
    const validatedPath = this.validatePath(dirPath);
    await this.checkFileAccess(validatedPath, 'delete');

    const stats = await lstat(validatedPath);
    if (!stats.isDirectory()) {
      throw this.createError('NOT_DIRECTORY', 'Path is not a directory');
    }

    if (recursive) {
      await fsPromises.rm(validatedPath, { recursive: true, force: true });
    } else {
      const entries = await readdir(validatedPath);
      if (entries.length > 0) {
        throw this.createError('DIRECTORY_NOT_EMPTY', 'Directory is not empty, use recursive: true');
      }
      await rmdir(validatedPath);
    }
  }

  /**
   * Create directory safely
   */
  async createDirectory(dirPath: string): Promise<void> {
    const validatedPath = this.validatePath(dirPath);
    await this.checkFileAccess(validatedPath, 'write');
    await mkdir(validatedPath, { recursive: true });
  }

  /**
   * Check if path exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const validatedPath = this.validatePath(filePath);
      await fsPromises.access(validatedPath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file/directory info
   */
  async getInfo(filePath: string): Promise<FileInfo> {
    const validatedPath = this.validatePath(filePath);
    const stats = await stat(validatedPath);
    const lstats = await lstat(validatedPath);

    return {
      path: validatedPath,
      name: path.basename(validatedPath),
      size: stats.size,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      isSymlink: lstats.isSymbolicLink(),
      modifiedTime: stats.mtime,
      createdTime: stats.birthtime,
      permissions: this.formatPermissions(stats.mode),
    };
  }

  /**
   * List directory contents
   */
  async listDirectory(dirPath: string): Promise<FileInfo[]> {
    const validatedPath = this.validatePath(dirPath);
    await this.checkFileAccess(validatedPath, 'read');

    const entries = await readdir(validatedPath, { withFileTypes: true });
    const results: FileInfo[] = [];

    for (const entry of entries) {
      const fullPath = path.join(validatedPath, entry.name);
      try {
        const stats = await stat(fullPath);
        const lstats = await lstat(fullPath);
        results.push({
          path: fullPath,
          name: entry.name,
          size: stats.size,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          isSymlink: lstats.isSymbolicLink(),
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          permissions: this.formatPermissions(stats.mode),
        });
      } catch {
        // Skip entries we can't stat
      }
    }

    return results;
  }

  /**
   * Get directory tree
   */
  async getDirectoryTree(dirPath: string, maxDepth = 3, currentDepth = 0): Promise<DirectoryTree> {
    if (currentDepth > maxDepth) {
      return { path: dirPath, name: path.basename(dirPath), children: [] };
    }

    const validatedPath = this.validatePath(dirPath);
    const entries = await this.listDirectory(validatedPath);

    const children: (DirectoryTree | FileInfo)[] = [];
    for (const entry of entries) {
      if (entry.isDirectory) {
        children.push(await this.getDirectoryTree(entry.path, maxDepth, currentDepth + 1));
      } else {
        children.push(entry);
      }
    }

    return {
      path: validatedPath,
      name: path.basename(validatedPath),
      children,
    };
  }

  /**
   * Copy file
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    const validatedSource = this.validatePath(sourcePath);
    const validatedDest = this.validatePath(destPath);

    await this.checkFileAccess(validatedSource, 'read');
    await this.checkFileAccess(validatedDest, 'write');

    const destDir = path.dirname(validatedDest);
    await this.ensureDirectory(destDir);

    await copyFile(validatedSource, validatedDest);
  }

  /**
   * Move/rename file
   */
  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    const validatedSource = this.validatePath(sourcePath);
    const validatedDest = this.validatePath(destPath);

    await this.checkFileAccess(validatedSource, 'write');
    await this.checkFileAccess(validatedDest, 'write');

    const destDir = path.dirname(validatedDest);
    await this.ensureDirectory(destDir);

    await fsPromises.rename(validatedSource, validatedDest);
  }

  /**
   * Read file as JSON
   */
  async readJson<T>(filePath: string): Promise<T> {
    const content = await this.readFile(filePath);
    try {
      return JSON.parse(content) as T;
    } catch (error) {
      throw this.createError('INVALID_JSON', `File '${filePath}' contains invalid JSON`, 'Fix JSON syntax errors');
    }
  }

  /**
   * Write JSON to file
   */
  async writeJson<T>(filePath: string, data: T, spaces = 2): Promise<void> {
    const content = JSON.stringify(data, null, spaces);
    await this.writeFile(filePath, content);
  }

  /**
   * Find files matching pattern
   */
  async findFiles(
    rootPath: string,
    pattern: string | RegExp,
    options: { maxResults?: number; maxDepth?: number } = {}
  ): Promise<string[]> {
    const validatedRoot = this.validatePath(rootPath);
    const results: string[] = [];
    const maxResults = options.maxResults ?? 1000;
    const maxDepth = options.maxDepth ?? 10;

    await this.findFilesRecursive(validatedRoot, pattern, results, maxResults, maxDepth, 0);
    return results;
  }

  private async findFilesRecursive(
    dirPath: string,
    pattern: string | RegExp,
    results: string[],
    maxResults: number,
    maxDepth: number,
    currentDepth: number
  ): Promise<void> {
    if (currentDepth > maxDepth || results.length >= maxResults) {
      return;
    }

    try {
      const entries = await this.listDirectory(dirPath);

      for (const entry of entries) {
        if (results.length >= maxResults) break;

        if (entry.isFile) {
          const matches = typeof pattern === 'string'
            ? entry.name.includes(pattern)
            : pattern.test(entry.name);
          if (matches) {
            results.push(entry.path);
          }
        } else if (entry.isDirectory) {
          await this.findFilesRecursive(entry.path, pattern, results, maxResults, maxDepth, currentDepth + 1);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  /**
   * Get workspace roots
   */
  getWorkspaceRoots(): string[] {
    return [...this.workspaceRoots];
  }

  /**
   * Set workspace roots (e.g., when workspace folders change)
   */
  setWorkspaceRoots(roots: string[]): void {
    this.workspaceRoots.length = 0;
    this.workspaceRoots.push(...roots.map((r) => path.resolve(r)));
  }

  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }
  }

  private async checkFileAccess(filePath: string, operation: 'read' | 'write' | 'delete'): Promise<void> {
    try {
      const mode = operation === 'read' ? fs.constants.R_OK :
                   operation === 'write' ? fs.constants.W_OK :
                   fs.constants.W_OK; // delete needs write on parent
      await fsPromises.access(filePath, mode);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        if (operation === 'read' || operation === 'delete') {
          throw this.createError('FILE_NOT_FOUND', `File not found: ${filePath}`);
        }
        // For write, parent directory must exist
        const parent = path.dirname(filePath);
        await this.ensureDirectory(parent);
        return;
      }
      if (code === 'EACCES' || code === 'EPERM') {
        throw this.createError('PERMISSION_DENIED', `Permission denied for ${operation} operation on ${filePath}`);
      }
      throw error;
    }
  }

  private formatPermissions(mode: number): string {
    const perms = [];
    perms.push(mode & 0o400 ? 'r' : '-');
    perms.push(mode & 0o200 ? 'w' : '-');
    perms.push(mode & 0o100 ? 'x' : '-');
    perms.push(mode & 0o040 ? 'r' : '-');
    perms.push(mode & 0o020 ? 'w' : '-');
    perms.push(mode & 0o010 ? 'x' : '-');
    perms.push(mode & 0o004 ? 'r' : '-');
    perms.push(mode & 0o002 ? 'w' : '-');
    perms.push(mode & 0o001 ? 'x' : '-');
    return perms.join('');
  }

  private createError(code: string, whatHappened: string, whatUserCanDo?: string): ExtensionError {
    const error = new Error(whatHappened) as ExtensionError;
    error.code = code;
    error.userFacing = {
      whatHappened,
      why: 'File system access restriction',
      whatUserCanDo: whatUserCanDo ? [whatUserCanDo] : ['Check file path and permissions'],
      errorCode: code,
      recoverable: true,
    };
    error.timestamp = Date.now();
    return error;
  }
}

// Helper function to create from VS Code workspace folders
export function createFromWorkspaceFolders(folders: readonly { uri: { fsPath: string } }[], logger?: Logger): SafeFileSystem {
  const roots = folders.map((f) => f.uri.fsPath);
  return new SafeFileSystem({ workspaceRoots: roots }, logger);
}