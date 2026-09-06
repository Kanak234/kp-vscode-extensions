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
import { LogLevel, Logger, ExtensionError } from '../types';
export declare class StructuredLogger implements Logger {
    private readonly name;
    private readonly minLevel;
    outputChannel?: {
        appendLine: (line: string) => void;
        dispose: () => void;
    };
    private context;
    private static levelOrder;
    constructor(name: string, minLevel?: LogLevel, outputChannel?: Logger['outputChannel']);
    error(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
    child(context: Record<string, unknown>): Logger;
    setMinLevel(_level: LogLevel): void;
    private log;
    private shouldLog;
    private sanitizeContext;
    private formatEntry;
}
/**
 * Create a logger for an extension
 */
export declare function createLogger(extensionName: string, minLevel?: LogLevel): Logger;
/**
 * Create a logger with VS Code output channel
 */
export declare function createOutputChannelLogger(extensionName: string, outputChannel: {
    appendLine: (line: string) => void;
    dispose: () => void;
}, minLevel?: LogLevel): Logger;
/**
 * Log an error with user-facing details
 */
export declare function logError(logger: Logger, error: Error | ExtensionError, context?: Record<string, unknown>): void;
//# sourceMappingURL=index.d.ts.map