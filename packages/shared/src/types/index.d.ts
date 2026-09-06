/**
 * Shared TypeScript types for Kanak Prabhakar VS Code Extensions
 */
export type ToolchainName = 'gcc' | 'g++' | 'clang' | 'clang++' | 'java' | 'javac' | 'python' | 'python3' | 'node' | 'npm' | 'git' | 'gdb' | 'lldb' | 'make' | 'cmake' | 'gradle' | 'maven';
export interface ToolchainInfo {
    name: ToolchainName;
    displayName: string;
    version: string | null;
    path: string | null;
    status: ToolchainStatus;
    details: string;
    fixRecommendation?: FixRecommendation;
}
export type ToolchainStatus = 'working' | 'warning' | 'missing' | 'unable-to-verify';
export interface FixRecommendation {
    what: string;
    why: string;
    how: string;
    links?: string[];
}
export interface DiagnosticReport {
    timestamp: string;
    extensionVersion: string;
    vscodeVersion: string;
    platform: PlatformInfo;
    toolchains: ToolchainInfo[];
    workspace: WorkspaceInfo;
    configuration: ConfigurationSnapshot;
    errors: DiagnosticError[];
}
export interface PlatformInfo {
    os: string;
    arch: string;
    version: string;
    shell: string;
}
export interface WorkspaceInfo {
    hasWorkspace: boolean;
    rootPath?: string;
    folderCount: number;
    projectType?: string;
}
export interface ConfigurationSnapshot {
    [key: string]: unknown;
}
export interface DiagnosticError {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    source?: string;
    toolchain?: ToolchainName;
}
export interface ProcessOptions {
    command: string;
    args: string[];
    cwd?: string;
    env?: Record<string, string>;
    timeout?: number;
    maxOutputSize?: number;
    stdin?: string;
    allowlist?: string[];
}
export interface ProcessResult {
    exitCode: number | null;
    stdout: string;
    stderr: string;
    timedOut: boolean;
    killed: boolean;
    duration: number;
}
export interface ProcessLimits {
    maxConcurrent: number;
    maxMemoryMB: number;
    maxOutputMB: number;
    defaultTimeoutMs: number;
}
export interface ProcessTracker {
    pid: number;
    startTime: number;
    abortController: AbortController;
    command: string;
    args: string[];
}
export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript' | 'typescript';
export interface LanguageAdapter {
    readonly language: SupportedLanguage;
    readonly name: string;
    readonly extensions: string[];
    detectToolchain(): Promise<ToolchainDetectionResult>;
    compile(sourceFile: string, outputDir: string, options?: CompileOptions): Promise<CompileResult>;
    execute(compiledOutput: string, args?: string[], options?: ExecuteOptions): Promise<ProcessResult>;
    getCompileCommand(sourceFile: string, outputDir: string, options?: CompileOptions): string[];
    getExecuteCommand(compiledOutput: string, args?: string[]): string[];
}
export interface ToolchainDetectionResult {
    available: boolean;
    version?: string;
    path?: string;
    details: string;
}
export interface CompileOptions {
    optimizationLevel?: 'O0' | 'O1' | 'O2' | 'O3' | 'Os';
    debugInfo?: boolean;
    warnings?: string[];
    standard?: string;
    includes?: string[];
    defines?: Record<string, string>;
    outputName?: string;
}
export interface CompileResult {
    success: boolean;
    outputPath?: string;
    stdout: string;
    stderr: string;
    exitCode: number;
    diagnostics: CompileDiagnostic[];
}
export interface CompileDiagnostic {
    file: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    code?: string;
}
export interface ExecuteOptions {
    timeout?: number;
    memoryLimitMB?: number;
    input?: string;
    env?: Record<string, string>;
}
export type CompilerStage = 'source' | 'preprocessing' | 'lexical' | 'tokens' | 'parsing' | 'ast' | 'semantic' | 'symbol-table' | 'ir' | 'optimization' | 'assembly' | 'bytecode' | 'linking' | 'execution';
export type InformationSource = 'actual' | 'derived' | 'simulated' | 'educational';
export interface CompilerStageData {
    stage: CompilerStage;
    source: InformationSource;
    content: string;
    metadata?: Record<string, unknown>;
    timestamp: number;
}
export interface CompilerVisualization {
    language: SupportedLanguage;
    sourceFile: string;
    stages: CompilerStageData[];
    toolchain: string;
    toolchainVersion: string;
}
export type AlgorithmCategory = 'sorting' | 'searching' | 'graph' | 'recursion' | 'dynamic-programming';
export interface AlgorithmStep {
    line: number;
    description: string;
    variables: Record<string, unknown>;
    comparisons?: number;
    swaps?: number;
    dataState: unknown;
    highlights?: number[];
}
export interface AlgorithmVisualization {
    id: string;
    name: string;
    category: AlgorithmCategory;
    pseudocode: string;
    code: Record<SupportedLanguage, string>;
    steps: AlgorithmStep[];
    complexity: {
        time: string;
        space: string;
        best?: string;
        average?: string;
        worst?: string;
    };
}
export type DataStructureType = 'array' | 'linked-list' | 'stack' | 'queue' | 'circular-queue' | 'tree' | 'bst' | 'avl' | 'heap' | 'hash-table' | 'graph';
export interface DSOperation {
    name: string;
    description: string;
    parameters: DSParameter[];
    code: Record<SupportedLanguage, string>;
}
export interface DSParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
}
export interface DSVisualizationState {
    type: DataStructureType;
    data: unknown;
    highlights?: string[];
    annotations?: Record<string, string>;
}
export interface DataStructureLab {
    type: DataStructureType;
    name: string;
    operations: DSOperation[];
    initialState: DSVisualizationState;
    invariants: string[];
}
export interface DebugSession {
    id: string;
    language: SupportedLanguage;
    program: string;
    breakpoints: Breakpoint[];
    variables: Variable[];
    callStack: CallFrame[];
    currentLine?: number;
    status: 'running' | 'paused' | 'stopped' | 'terminated';
}
export interface Breakpoint {
    file: string;
    line: number;
    condition?: string;
    hitCount?: number;
    enabled: boolean;
}
export interface Variable {
    name: string;
    value: string;
    type: string;
    scope: 'local' | 'global' | 'closure';
    memoryAddress?: string;
}
export interface CallFrame {
    function: string;
    file: string;
    line: number;
    variables: Variable[];
}
export interface Experiment {
    id: string;
    title: string;
    objective: string;
    theory: string;
    algorithm: string;
    sourceCode: Record<SupportedLanguage, string>;
    inputs: ExperimentInput[];
    expectedOutputs: ExperimentOutput[];
    vivaQuestions: VivaQuestion[];
}
export interface ExperimentInput {
    name: string;
    description: string;
    data: string;
}
export interface ExperimentOutput {
    inputName: string;
    expected: string;
    actual?: string;
    match?: boolean;
    diff?: string;
}
export interface PracticalVivaQuestion {
    question: string;
    answer: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
}
export interface ExperimentResult {
    experimentId: string;
    timestamp: string;
    language: SupportedLanguage;
    inputs: ExperimentInput[];
    outputs: ExperimentOutput[];
    passed: boolean;
    duration: number;
    compilationResult?: CompileResult;
}
export interface ProjectHealth {
    build: HealthCheck;
    tests: HealthCheck;
    git: GitHealth;
    dependencies: DependencyHealth;
    documentation: DocHealth;
    security: SecurityHealth;
    environment: EnvironmentHealth;
    overall: 'healthy' | 'warning' | 'critical';
}
export interface HealthCheck {
    status: 'pass' | 'fail' | 'warning' | 'skipped';
    message: string;
    details?: string;
    timestamp: number;
}
export interface GitHealth {
    status: 'clean' | 'dirty' | 'no-repo';
    branch: string;
    ahead: number;
    behind: number;
    stagedFiles: string[];
    unstagedFiles: string[];
    untrackedFiles: string[];
    lastCommit?: GitCommit;
}
export interface GitCommit {
    hash: string;
    message: string;
    author: string;
    date: number;
}
export interface DependencyHealth {
    packageManager: 'npm' | 'pnpm' | 'yarn' | 'maven' | 'gradle' | 'pip' | 'unknown';
    total: number;
    outdated: number;
    vulnerable: number;
    duplicates: number;
}
export interface DocHealth {
    hasReadme: boolean;
    hasLicense: boolean;
    hasChangelog: boolean;
    hasContributing: boolean;
    readmeSize: number;
}
export interface SecurityHealth {
    hasSecurityPolicy: boolean;
    secretsScanned: boolean;
    vulnerabilities: number;
}
export interface EnvironmentHealth {
    toolchains: ToolchainInfo[];
    nodeVersion?: string;
    pythonVersion?: string;
    javaVersion?: string;
}
export interface TestCase {
    id: string;
    name: string;
    input: string;
    expectedOutput: string;
    timeout?: number;
    memoryLimitMB?: number;
    hidden?: boolean;
}
export interface TestSuite {
    id: string;
    name: string;
    testCases: TestCase[];
    language: SupportedLanguage;
    setup?: string;
    teardown?: string;
}
export interface TestRunResult {
    suiteId: string;
    timestamp: string;
    results: TestCaseResult[];
    summary: TestSummary;
}
export interface TestCaseResult {
    testCaseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    diff?: string;
    exitCode: number;
    stdout: string;
    stderr: string;
    duration: number;
    timedOut: boolean;
    crashed: boolean;
}
export interface TestSummary {
    total: number;
    passed: number;
    failed: number;
    timedOut: number;
    crashed: number;
    duration: number;
}
export interface SubmissionPackage {
    files: SubmissionFile[];
    manifest: SubmissionManifest;
    checksum: string;
}
export interface SubmissionFile {
    path: string;
    content: string;
    size: number;
}
export interface SubmissionManifest {
    studentId?: string;
    assignmentId?: string;
    timestamp: string;
    language: SupportedLanguage;
    mainFile: string;
    testResults?: TestRunResult;
}
export type ExplanationType = 'fact' | 'inference' | 'explanation' | 'ai-generated';
export interface CodeExplanation {
    range: {
        start: number;
        end: number;
    };
    code: string;
    explanations: ExplanationItem[];
    summary: string;
    complexity?: ComplexityAnalysis;
}
export interface ExplanationItem {
    type: ExplanationType;
    text: string;
    confidence?: number;
    source?: string;
}
export interface ComplexityAnalysis {
    time: string;
    space: string;
    notes: string[];
}
export type VivaTopic = 'programming' | 'dsa' | 'dbms' | 'os' | 'networks' | 'compiler-design' | 'oop' | 'projects';
export type VivaMode = 'beginner' | 'intermediate' | 'advanced' | 'rapid-fire';
export interface VivaQuestion {
    id: string;
    topic: VivaTopic;
    question: string;
    answer: string;
    difficulty: VivaMode;
    tags: string[];
    followUp?: string[];
}
export interface VivaSession {
    id: string;
    mode: VivaMode;
    topics: VivaTopic[];
    questions: VivaQuestion[];
    currentIndex: number;
    score: number;
    weakTopics: Map<VivaTopic, number>;
    startTime: number;
    endTime?: number;
}
export interface VivaProgress {
    topic: VivaTopic;
    totalQuestions: number;
    attempted: number;
    correct: number;
    weakAreas: string[];
    lastPracticed: number;
}
export interface WorkspaceItem {
    id: string;
    type: 'project' | 'assignment' | 'practical' | 'note' | 'code' | 'test' | 'task';
    title: string;
    description?: string;
    path?: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
    dueDate?: number;
    completed?: boolean;
    metadata?: Record<string, unknown>;
}
export interface WorkspaceState {
    items: WorkspaceItem[];
    recentErrors: RecentError[];
    recentRuns: RecentRun[];
    bookmarks: Bookmark[];
    learningChecklist: LearningChecklistItem[];
}
export interface RecentError {
    timestamp: number;
    extension: string;
    error: string;
    context?: string;
}
export interface RecentRun {
    timestamp: number;
    extension: string;
    file: string;
    language: SupportedLanguage;
    success: boolean;
    duration: number;
}
export interface Bookmark {
    id: string;
    file: string;
    line: number;
    label: string;
    note?: string;
}
export interface LearningChecklistItem {
    id: string;
    topic: string;
    completed: boolean;
    targetDate?: number;
    resources?: string[];
}
export interface ExtensionConfig {
    [key: string]: ConfigValue;
}
export interface ConfigObject {
    [key: string]: ConfigValue;
}
export type ConfigValue = string | number | boolean | string[] | number[] | boolean[] | ConfigObject;
export interface ConfigSchema {
    type: 'object';
    properties: Record<string, ConfigProperty>;
    required?: string[];
    additionalProperties?: boolean;
}
export interface ConfigProperty {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    default?: ConfigValue;
    enum?: ConfigValue[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    items?: ConfigProperty;
    properties?: Record<string, ConfigProperty>;
}
export interface UserFacingError {
    whatHappened: string;
    why: string;
    whatUserCanDo: string[];
    technicalDetails?: string;
    errorCode: string;
    recoverable: boolean;
}
export interface ExtensionError extends Error {
    code: string;
    userFacing: UserFacingError;
    context?: Record<string, unknown>;
    timestamp: number;
}
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    extension?: string;
    context?: Record<string, unknown>;
    error?: Error;
}
export interface Logger {
    error(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
    child(context: Record<string, unknown>): Logger;
    outputChannel?: {
        appendLine: (line: string) => void;
        dispose: () => void;
    };
}
//# sourceMappingURL=index.d.ts.map