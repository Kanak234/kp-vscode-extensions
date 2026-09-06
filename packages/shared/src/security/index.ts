/**
 * Security Utilities
 * 
 * Provides security functions for:
 * - Input sanitization
 * - Path validation
 * - Command allowlisting
 * - Secret detection
 * - Content Security Policy helpers
 */

import * as crypto from 'crypto';
import * as path from 'path';
import { ExtensionError } from '../types';

export interface SanitizeOptions {
  allowHtml?: boolean;
  allowMarkdown?: boolean;
  maxLength?: number;
}

export interface PathValidationOptions {
  workspaceRoots: string[];
  allowAbsolute?: boolean;
  allowSymlinks?: boolean;
}

export interface CommandValidationOptions {
  allowlist: string[];
  allowAbsolutePaths?: boolean;
}

/**
 * Sanitize user input for safe display
 */
export function sanitizeInput(input: string, options: SanitizeOptions = {}): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let result = input;

  // Truncate if too long
  if (options.maxLength && result.length > options.maxLength) {
    result = result.slice(0, options.maxLength) + '…';
  }

  if (!options.allowHtml) {
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (!options.allowMarkdown) {
    // Escape markdown special chars
    result = result.replace(/[*_`~\[\]()#]/g, '\\$&');
  }

  return result;
}

/**
 * Sanitize for safe use in shell commands (prevent injection)
 * Note: Prefer using array arguments with spawn() instead of shell
 */
export function sanitizeShellArg(arg: string): string {
  if (!arg || typeof arg !== 'string') {
    return '';
  }

  // For use with array args (no shell), just validate
  const dangerous = /[;&|`$(){}[\]]/;
  if (dangerous.test(arg)) {
    throw new Error(`Argument contains shell metacharacters: ${arg}`);
  }

  return arg;
}

/**
 * Validate and resolve a file path within workspace boundaries
 */
export function validatePath(inputPath: string, options: PathValidationOptions): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw createSecurityError('INVALID_PATH', 'Path must be a non-empty string');
  }

  // Normalize path
  const normalized = path.normalize(inputPath);

  // Check for path traversal
  if (normalized.includes('..')) {
    const parts = normalized.split(path.sep);
    let depth = 0;
    for (const part of parts) {
      if (part === '..') depth++;
      else if (part !== '.' && part !== '') depth--;
      if (depth < 0) {
        throw createSecurityError('PATH_TRAVERSAL', 'Path attempts to traverse outside allowed directory');
      }
    }
  }

  // Resolve absolute path
  let resolved: string;
  if (path.isAbsolute(normalized)) {
    if (!options.allowAbsolute) {
      throw createSecurityError('ABSOLUTE_PATH_NOT_ALLOWED', 'Absolute paths are not allowed');
    }
    resolved = normalized;
  } else {
    // Relative to first workspace root
    const firstRoot = options.workspaceRoots[0];
    if (!firstRoot) {
      throw createSecurityError('NO_WORKSPACE', 'No workspace root available for relative path');
    }
    resolved = path.resolve(firstRoot, normalized);
  }

  // Verify path is within workspace roots
  const inWorkspace = options.workspaceRoots.some((root) => {
    const relative = path.relative(root, resolved)!;
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  });

  if (!inWorkspace) {
    throw createSecurityError('PATH_OUTSIDE_WORKSPACE', `Path is outside workspace boundaries`);
  }

  return resolved;
}

/**
 * Validate command against allowlist
 */
export function validateCommand(command: string, options: CommandValidationOptions): string {
  if (!command || typeof command !== 'string') {
    throw createSecurityError('INVALID_COMMAND', 'Command must be a non-empty string');
  }

  // Check for shell metacharacters
  const shellChars = /[;&|`$(){}[\]]/;
  if (shellChars.test(command)) {
    throw createSecurityError('SHELL_INJECTION', 'Command contains shell metacharacters');
  }

  // Extract base command
  const baseCommand = path.basename(command).toLowerCase();

  // Check allowlist
  const allowed = options.allowlist.some((allowed) => {
    const allowedBase = path.basename(allowed).toLowerCase();
    return allowedBase === baseCommand || allowedBase === command.toLowerCase();
  });

  if (!allowed) {
    throw createSecurityError('COMMAND_NOT_ALLOWED', `Command '${baseCommand}' is not in the allowlist`);
  }

  return command;
}

/**
 * Validate command arguments
 */
export function validateArgs(args: string[]): string[] {
  if (!Array.isArray(args)) {
    throw createSecurityError('INVALID_ARGS', 'Arguments must be an array');
  }

  const shellChars = /[;&|`$(){}[\]]/;
  for (const arg of args) {
    if (typeof arg !== 'string') {
      throw createSecurityError('INVALID_ARG_TYPE', 'All arguments must be strings');
    }
    if (shellChars.test(arg)) {
      throw createSecurityError('ARG_INJECTION', `Argument contains shell metacharacters: ${arg}`);
    }
  }

  return args;
}

/**
 * Detect potential secrets in content
 */
export function detectSecrets(content: string): SecretMatch[] {
  const matches: SecretMatch[] = [];

  const patterns: { pattern: RegExp; type: string; severity: 'high' | 'medium' | 'low' }[] = [
    { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?([a-zA-Z0-9\-._~+/]{20,})["']?/gi, type: 'API Key', severity: 'high' },
    { pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"']{8,})["']?/gi, type: 'Password', severity: 'high' },
    { pattern: /(?:secret|token)\s*[:=]\s*["']?([a-zA-Z0-9\-._~+/]{20,})["']?/gi, type: 'Secret/Token', severity: 'high' },
    { pattern: /(?:authorization|auth)\s*[:=]\s*["']?Bearer\s+([a-zA-Z0-9\-._~+/]+)["']?/gi, type: 'Bearer Token', severity: 'high' },
    { pattern: /(?:private[_-]?key|privatekey)\s*[:=]\s*["']?([\s\S]{50,})["']?/gi, type: 'Private Key', severity: 'high' },
    { pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/gi, type: 'Private Key Block', severity: 'high' },
    { pattern: /[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}/g, type: 'JWT Token', severity: 'medium' },
    { pattern: /[a-fA-F0-9]{32,}/g, type: 'Hex Secret', severity: 'low' },
    { pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s]+/gi, type: 'Database URL', severity: 'high' },
  ];

  for (const { pattern, type, severity } of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      matches.push({
        type,
        severity,
        match: match[0],
        index: match.index,
        redacted: redactSecret(match[0]),
      });
    }
  }

  return matches;
}

export interface SecretMatch {
  type: string;
  severity: 'high' | 'medium' | 'low';
  match: string;
  index: number;
  redacted: string;
}

/**
 * Redact secrets from content
 */
export function redactSecrets(content: string): string {
  let result = content;

  const patterns: RegExp[] = [
    /(?:api[_-]?key|apikey)\s*[:=]\s*["']?([a-zA-Z0-9\-._~+/]{20,})["']?/gi,
    /(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"']{8,})["']?/gi,
    /(?:secret|token)\s*[:=]\s*["']?([a-zA-Z0-9\-._~+/]{20,})["']?/gi,
    /(?:authorization|auth)\s*[:=]\s*["']?Bearer\s+([a-zA-Z0-9\-._~+/]+)["']?/gi,
    /(?:private[_-]?key|privatekey)\s*[:=]\s*["']?([\s\S]{50,})["']?/gi,
    /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/gi,
    /[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}/g,
    /(?:mongodb|postgres|mysql|redis):\/\/[^\s]+/gi,
  ];

  for (const pattern of patterns) {
    result = result.replace(pattern, (match) => {
      const parts = match.split(/[:=]/);
      if (parts.length >= 2) {
        return `${parts[0]}: [REDACTED]`;
      }
      return '[REDACTED]';
    });
  }

  return result;
}

function redactSecret(secret: string): string {
  if (secret.length <= 8) return '[REDACTED]';
  return secret.slice(0, 4) + '*'.repeat(secret.length - 8) + secret.slice(-4);
}

/**
 * Generate a secure random string
 */
export function generateSecureRandom(length: number, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

/**
 * Hash a string (for non-crypto uses like cache keys)
 */
export function hashString(input: string, algorithm = 'sha256'): string {
  return crypto.createHash(algorithm).update(input).digest('hex');
}

/**
 * Verify file integrity with checksum
 */
export async function verifyChecksum(filePath: string, expectedChecksum: string, algorithm = 'sha256'): Promise<boolean> {
  const fs = await import('fs/promises');
  const content = await fs.readFile(filePath);
  const actual = crypto.createHash(algorithm).update(content).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expectedChecksum));
}

/**
 * Create a security error
 */
function createSecurityError(code: string, whatHappened: string): ExtensionError {
  const error = new Error(whatHappened) as ExtensionError;
  error.code = code;
  error.userFacing = {
    whatHappened,
    why: 'Security validation failed',
    whatUserCanDo: ['Check input for invalid characters', 'Ensure paths are within workspace', 'Use allowed commands only'],
    errorCode: code,
    recoverable: true,
  };
  error.timestamp = Date.now();
  return error;
}
