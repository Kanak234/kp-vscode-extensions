/**
 * Configuration Validation
 * 
 * Provides type-safe configuration with:
 * - JSON Schema validation
 * - Actionable error messages
 * - Default value handling
 * - Migration support
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { ConfigSchema, ExtensionConfig, ExtensionError, Logger } from '../types';

export interface ConfigValidatorOptions {
  schema: ConfigSchema;
  configPath?: string;
  logger?: Logger;
}

export class ConfigValidator {
  private readonly ajv: Ajv;
  private readonly validate;
  private readonly schema: ConfigSchema;
  private readonly configPath?: string;
  private readonly logger: Logger;
  private config: ExtensionConfig = {};

  constructor(options: ConfigValidatorOptions) {
    this.schema = options.schema;
    this.configPath = options.configPath;
    this.logger = options.logger ?? ((console as unknown) as Logger);

    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
    });
    addFormats(this.ajv);
    this.validate = this.ajv.compile(this.schema);
  }

  /**
   * Load configuration from file
   */
  async load(): Promise<ExtensionConfig> {
    if (!this.configPath) {
      this.config = this.applyDefaults({});
      return this.config;
    }

    try {
      const content = await fs.promises.readFile(this.configPath, 'utf8');
      const parsed = JSON.parse(content);
      this.config = this.validateConfig(parsed);
      return this.config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.config = this.applyDefaults({});
        await this.save();
        return this.config;
      }
      throw this.createError('CONFIG_LOAD_FAILED', `Failed to load config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Save configuration to file
   */
  async save(): Promise<void> {
    if (!this.configPath) return;

    const dir = path.dirname(this.configPath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
  }

  /**
   * Get current configuration
   */
  getConfig(): ExtensionConfig {
    return { ...this.config };
  }

  /**
   * Get a specific config value
   */
  get<K extends keyof ExtensionConfig>(key: K): ExtensionConfig[K] {
    return this.config[key];
  }

  /**
   * Set a config value with validation
   */
  async set<K extends keyof ExtensionConfig>(key: K, value: ExtensionConfig[K]): Promise<void> {
    const newConfig = { ...this.config, [key]: value };
    this.config = this.validateConfig(newConfig);
    await this.save();
  }

  /**
   * Update multiple config values
   */
  async update(updates: Partial<ExtensionConfig>): Promise<void> {
    const newConfig = { ...this.config, ...updates };
    this.config = this.validateConfig(newConfig as ExtensionConfig);
    await this.save();
  }

  /**
   * Reset to defaults
   */
  async reset(): Promise<void> {
    this.config = this.applyDefaults({});
    await this.save();
  }

  /**
   * Validate configuration against schema
   */
  validateConfig(config: ExtensionConfig): ExtensionConfig {
    const valid = this.validate(config);
    if (!valid) {
      const errors = this.validate.errors ?? [];
      const messages = errors.map((e) => this.formatError(e)).join('; ');
      throw this.createError('CONFIG_VALIDATION_FAILED', `Configuration validation failed: ${messages}`);
    }

    // Apply defaults for missing optional properties
    return this.applyDefaults(config);
  }

  /**
   * Migrate configuration from older version
   */
  migrate(migrations: Record<string, (config: ExtensionConfig) => ExtensionConfig>): void {
    const version = (this.config['version'] as string) ?? '0.0.0';
    const sortedVersions = Object.keys(migrations).sort((a, b) => this.compareVersions(a, b));

    for (const v of sortedVersions) {
      if (this.compareVersions(v, version) > 0) {
        this.logger.info(`Migrating config from ${version} to ${v}`);
        const migrationFn = migrations[v];
        if (migrationFn) {
          this.config = migrationFn(this.config);
          this.config['version'] = v;
        }
      }
    }
  }

  private applyDefaults(config: ExtensionConfig): ExtensionConfig {
    const result = { ...config };

    if (this.schema.properties) {
      for (const [key, prop] of Object.entries(this.schema.properties)) {
        if (result[key] === undefined && prop.default !== undefined) {
          result[key] = prop.default;
        }
      }
    }

    return result;
  }

  private formatError(error: ErrorObject): string {
    const path = error.instancePath || error.schemaPath;
    const msg = error.message || 'invalid';
    return `${path}: ${msg}`;
  }

  private compareVersions(a: string, b: string): number {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] ?? 0;
      const nb = pb[i] ?? 0;
      if (na !== nb) return na - nb;
    }
    return 0;
  }

  private createError(code: string, whatHappened: string): ExtensionError {
    const error = new Error(whatHappened) as ExtensionError;
    error.code = code;
    error.userFacing = {
      whatHappened,
      why: 'Configuration validation error',
      whatUserCanDo: ['Check configuration file for syntax errors', 'Verify all required fields are present'],
      errorCode: code,
      recoverable: true,
    };
    error.timestamp = Date.now();
    return error;
  }
}

/**
 * Create a configuration schema for common extension settings
 */
export function createCommonSchema(extensionSpecific: ConfigSchema['properties'] = {}): ConfigSchema {
  return {
    type: 'object',
    properties: {
      version: { type: 'string', default: '1.0.0', description: 'Configuration schema version' },
      logLevel: { type: 'string', enum: ['error', 'warn', 'info', 'debug'], default: 'info', description: 'Log level' },
      telemetryEnabled: { type: 'boolean', default: false, description: 'Enable telemetry collection' },
      autoUpdate: { type: 'boolean', default: true, description: 'Auto-update extension' },
      ...extensionSpecific,
    },
    required: ['version'],
    additionalProperties: false,
  };
}