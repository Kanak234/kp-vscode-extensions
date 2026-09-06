"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
exports.createLogger = createLogger;
exports.createOutputChannelLogger = createOutputChannelLogger;
exports.logError = logError;
const SENSITIVE_KEYS = new Set([
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
class StructuredLogger {
    name;
    minLevel;
    outputChannel;
    context = {};
    static levelOrder = ['debug', 'info', 'warn', 'error'];
    constructor(name, minLevel = 'info', outputChannel) {
        this.name = name;
        this.minLevel = minLevel;
        this.outputChannel = outputChannel;
    }
    error(message, context) {
        this.log('error', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    child(context) {
        const child = new StructuredLogger(this.name, this.minLevel, this.outputChannel);
        child.context = { ...this.context, ...context };
        return child;
    }
    setMinLevel(_level) {
        // Can't actually change minLevel after construction in this impl
        // Would need mutable state or recreation
    }
    log(level, message, context) {
        if (!this.shouldLog(level))
            return;
        const entry = {
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
        }
        else {
            // Fallback to console
            const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
            console[consoleMethod](formatted);
        }
    }
    shouldLog(level) {
        const minIndex = StructuredLogger.levelOrder.indexOf(this.minLevel);
        const levelIndex = StructuredLogger.levelOrder.indexOf(level);
        return levelIndex >= minIndex;
    }
    sanitizeContext(context) {
        const result = {};
        for (const [key, value] of Object.entries(context)) {
            const lowerKey = key.toLowerCase();
            // Redact sensitive keys
            if ([...SENSITIVE_KEYS].some((s) => lowerKey.includes(s))) {
                result[key] = '[REDACTED]';
                continue;
            }
            // Recursively sanitize objects
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = this.sanitizeContext(value);
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
    formatEntry(entry) {
        const time = new Date(entry.timestamp).toISOString();
        const level = entry.level.toUpperCase().padEnd(5);
        const ext = entry.extension ? `[${entry.extension}]` : '';
        const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
        return `${time} ${level} ${ext} ${entry.message}${ctx}`;
    }
}
exports.StructuredLogger = StructuredLogger;
/**
 * Create a logger for an extension
 */
function createLogger(extensionName, minLevel = 'info') {
    return new StructuredLogger(extensionName, minLevel);
}
/**
 * Create a logger with VS Code output channel
 */
function createOutputChannelLogger(extensionName, outputChannel, minLevel = 'info') {
    return new StructuredLogger(extensionName, minLevel, outputChannel);
}
/**
 * Log an error with user-facing details
 */
function logError(logger, error, context) {
    if ('userFacing' in error) {
        const extError = error;
        logger.error(extError.userFacing.whatHappened, {
            ...context,
            errorCode: extError.code,
            recoverable: extError.userFacing.recoverable,
            technicalDetails: extError.userFacing.technicalDetails,
        });
    }
    else {
        logger.error(error.message, {
            ...context,
            stack: error.stack,
        });
    }
}
//# sourceMappingURL=index.js.map