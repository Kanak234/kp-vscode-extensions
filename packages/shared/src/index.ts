/**
 * @kanak-prabhakar/shared - Shared utilities for Kanak Prabhakar VS Code Extensions
 * 
 * This package provides common utilities used across all 15 extensions:
 * - Secure process execution
 * - Safe file system operations
 * - Configuration validation
 * - Structured logging
 * - Security helpers
 * - Shared TypeScript types
 * - Testing utilities
 */

export * from './types';
export * from './process';
export * from './filesystem';
export * from './config';
export * from './logging';
export * from './security';
export * from './testing';

// Re-export commonly used types for convenience
export type {
  ToolchainName,
  ToolchainInfo,
  ToolchainStatus,
  FixRecommendation,
  DiagnosticReport,
  PlatformInfo,
  WorkspaceInfo,
  ProcessOptions,
  ProcessResult,
  ProcessLimits,
  SupportedLanguage,
  LanguageAdapter,
  ToolchainDetectionResult,
  CompileOptions,
  CompileResult,
  CompileDiagnostic,
  ExecuteOptions,
  CompilerStage,
  InformationSource,
  CompilerStageData,
  CompilerVisualization,
  AlgorithmCategory,
  AlgorithmStep,
  AlgorithmVisualization,
  DataStructureType,
  DSOperation,
  DSParameter,
  DSVisualizationState,
  DataStructureLab,
  DebugSession,
  Breakpoint,
  Variable,
  CallFrame,
  Experiment,
  ExperimentInput,
  ExperimentOutput,
  PracticalVivaQuestion,
  ExperimentResult,
  ProjectHealth,
  HealthCheck,
  GitHealth,
  GitCommit,
  DependencyHealth,
  DocHealth,
  SecurityHealth,
  EnvironmentHealth,
  TestCase,
  TestSuite,
  TestRunResult,
  TestCaseResult,
  TestSummary,
  SubmissionPackage,
  SubmissionFile,
  SubmissionManifest,
  ExplanationType,
  CodeExplanation,
  ExplanationItem,
  ComplexityAnalysis,
  VivaTopic,
  VivaMode,
  VivaQuestion,
  VivaSession,
  VivaProgress,
  WorkspaceItem,
  WorkspaceState,
  RecentError,
  RecentRun,
  Bookmark,
  LearningChecklistItem,
  ExtensionConfig,
  ConfigValue,
  ConfigSchema,
  ConfigProperty,
  UserFacingError,
  ExtensionError,
  LogLevel,
  LogEntry,
  Logger,
} from './types';

export { ProcessExecutor, getDefaultExecutor, setDefaultExecutor } from './process';
export { SafeFileSystem, createFromWorkspaceFolders } from './filesystem';
export { ConfigValidator, createCommonSchema } from './config';
export { StructuredLogger, createLogger, createOutputChannelLogger, logError } from './logging';
export {
  sanitizeInput,
  sanitizeShellArg,
  validatePath,
  validateCommand,
  validateArgs,
  detectSecrets,
  redactSecrets,
  generateSecureRandom,
  hashString,
  verifyChecksum,
} from './security';
export {
  createTestDir,
  cleanupTestDir,
  createTestFiles,
  assertGoldenFile,
  createMockProcessResult,
  createMockCompileResult,
  createMockToolchainInfo,
  assertUserFacingError,
  waitFor,
  withTimeout,
  expectThrow,
  createTestSuite,
  benchmark,
} from './testing';