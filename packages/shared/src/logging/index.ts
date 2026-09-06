/**
 * Structured Logging
 * 
 * Provides structured logging with:
 * - Log levels (ERROR, WARN, INFO, DEBUG)
 * - Context enrichment
 * - Redaction of sensitive data
 * - Child loggers for component isolation
 * - VS Code output channel integration
 */

import { LogLevel, LogEntry, Logger, ExtensionError } from '../types';

const SENSITIVE_KEYS: ReadonlySet<string> = new Set([
  'password', 'token', 'apikey', 'api_key', 'secret', 'key',
  'authorization', 'auth', 'credential', 'private', 'cert',
  'passphrase', 'pass', 'pwd',
]);

const SENSITIVE_PATTERNS = [
  /bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi,
  /token\s*[:=]\s*[a-zA-Z0-9\-._~+/]+/gi,
  /password\s*[:=]\s*\S+/gi,
  /api[_-]?key\s*[:=]\s*[a-zA-Z0-9\-._~+/]+/gi,
];

export class StructuredLogger implements Logger {
  private readonly name: string;
  private readonly minLevel: LogLevel;
  outputChannel?: { appendLine: (line: string) => void; dispose: () => void };
  private context: Record<string, unknown> = {};

  private static levelOrder: LogLevel[] = ['debug', 'info', 'warn', 'error'];

  constructor(name: string, minLevel: LogLevel = 'info', outputChannel?: Logger['outputChannel']) {
    this.name = name;
    this.minLevel = minLevel;
    this.outputChannel = outputChannel;
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  child(context: Record<string, unknown>): Logger {
    const child = new StructuredLogger(this.name, this.minLevel, this.outputChannel);
    child.context = { ...this.context, ...context };
    return child;
  }

  setMinLevel(_level: LogLevel): void {
    // Can't actually change minLevel after construction in this impl
    // Would need mutable state or recreation
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      extension: this.name,
      context: this.sanitizeContext({ ...this.context, ...context }),
    };

    const formatted = this.formatEntry(entry);

    // Write to output channel if available
    if (this.outputChannel) {
      this.outputChannel.appendLine(formatted);
    } else {
      // Fallback to console
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](formatted);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const minIndex = StructuredLogger.levelOrder.indexOf(this.minLevel);
    const levelIndex = StructuredLogger.levelOrder.indexOf(level);
    return levelIndex >= minIndex;
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();

      // Redact sensitive keys
      if ([...SENSITIVE_KEYS].some((s) => lowerKey.includes(s))) {
        result[key] = '[REDACTED]';
        continue;
      }

      // Recursively sanitize objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.sanitizeContext(value as Record<string, unknown>);
        continue;
      }

      // Redact sensitive patterns in strings
      if (typeof value === 'string') {
        let sanitized = value;
        for (const pattern of SENSITIVE_PATTERNS) {
          sanitized = sanitized.replace(pattern, (match) => {
            const prefix = match.split(/[:=]/)[0];
            return `${prefix}=[REDACTED]`;
          });
        }
        result[key] = sanitized;
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  private formatEntry(entry: LogEntry): string {
    const time = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const ext = entry.extension ? `[${entry.extension}]` : '';
    const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    return `${time} ${level} ${ext} ${entry.message}${ctx}`;
  }
}

/**
 * Create a logger for an extension
 */
export function createLogger(extensionName: string, minLevel: LogLevel = 'info'): Logger {
  return new StructuredLogger(extensionName, minLevel) as Logger;
}

/**
 * Create a logger with VS Code output channel
 */
export function createOutputChannelLogger(
  extensionName: string,
  outputChannel: { appendLine: (line: string) => void; dispose: () => void },
  minLevel: LogLevel = 'info'
): Logger {
  return new StructuredLogger(extensionName, minLevel, outputChannel) as Logger;
}

/**
 * Log an error with user-facing details
 */
export function logError(logger: Logger, error: Error | ExtensionError, context?: Record<string, unknown>): void {
  if ('userFacing' in error) {
    const extError = error as ExtensionError;
    logger.error(extError.userFacing.whatHappened, {
      ...context,
      errorCode: extError.code,
      recoverable: extError.userFacing.recoverable,
      technicalDetails: extError.userFacing.technicalDetails,
    });
  } else {
    logger.error(error.message, {
      ...context,
      stack: error.stack,
    });
  }
}