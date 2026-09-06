/**
 * Mock implementation of the 'vscode' module for Vitest / Node environment testing.
 */

import { vi } from 'vitest';

export const TreeItemCollapsibleState = {
  None: 0,
  Collapsed: 1,
  Expanded: 2,
};

export class ThemeIcon {
  constructor(public readonly id: string) {}
}

export class TreeItem {
  public label?: string;
  public collapsibleState?: number;
  public description?: string;
  public tooltip?: string;
  public iconPath?: ThemeIcon | Uri;
  public contextValue?: string;
  public command?: unknown;

  constructor(label: string, collapsibleState?: number) {
    this.label = label;
    this.collapsibleState = collapsibleState;
  }
}

export class EventEmitter<T = unknown> {
  private listeners: Array<(e: T) => void> = [];

  get event() {
    return (listener: (e: T) => void) => {
      this.listeners.push(listener);
      return { dispose: () => {} };
    };
  }

  fire(data?: T) {
    this.listeners.forEach((l) => l(data as T));
  }

  dispose() {}
}

export class Uri {
  public scheme: string = 'file';
  public fsPath: string;
  public path: string;

  constructor(pathStr: string) {
    this.fsPath = pathStr;
    this.path = pathStr;
  }

  static file(p: string) {
    return new Uri(p);
  }

  static parse(p: string) {
    return new Uri(p);
  }

  static joinPath(base: Uri, ...paths: string[]) {
    return new Uri([base.fsPath, ...paths].join('/'));
  }
}

function createConfigGetter(section?: string) {
  const defaults: Record<string, Record<string, unknown>> = {
    kalpa: {
      enabled: false,
      'timeline.autoscroll': true,
      'restore.confirm': true,
    },
    kridaya: {
      enabled: false,
      'effects.reduceMotion': false,
      'sound.enabled': false,
    },
    niyama: {
      enabled: false,
      'search.enabled': true,
      'favorites.max': 10,
      'keyboard.shortcut': 'Ctrl+Shift+P',
    },
    prayoga: {
      enabled: false,
      'experiment.type': 'recursion',
      'results.mode': 'educational',
    },
    siddhi: {
      enabled: false,
      'privacy.localOnly': true,
      'achievements.showNotifications': true,
      progress: {
        'First Build': true,
        'First Test': true,
        'First Debug Session': true,
        'First Successful Project': true,
        '100 Successful Runs': true,
        'First Git Commit': true,
        'First Refactor': true,
        'First Passing Test Suite': true,
      },
    },
    vibhrama: {
      enabled: false,
      'simulation.enabled': false,
      mode: 'actual',
    },
    vivida: {
      enabled: false,
      'humor.enabled': true,
    },
    vritti: {
      enabled: false,
      'metrics.activeEditor': true,
      'metrics.runningTasks': true,
      'metrics.extensionActivity': true,
      'metrics.buildStatus': true,
      'metrics.testStatus': true,
      'metrics.debugState': true,
    },
  };

  const sec = section ?? '';
  const configMap = defaults[sec] ?? { enabled: false };

  return {
    get: (key: string, defaultValue?: unknown) => {
      if (key in configMap) return configMap[key];
      return defaultValue ?? false;
    },
    update: async () => {},
    has: (key: string) => key in configMap,
  };
}

const getConfigurationFn: any = (section?: string) => createConfigGetter(section);
getConfigurationFn.mockReset = () => {
  // stub to satisfy mockReset calls without destroying the function implementation
};
getConfigurationFn.mockRestore = () => {};

export const workspace = {
  getConfiguration: getConfigurationFn,
  workspaceFolders: [],
  onDidChangeWorkspaceFolders: () => ({ dispose: () => {} }),
};

export const window = {
  createOutputChannel: vi.fn((name: string) => ({
    name,
    append: () => {},
    appendLine: () => {},
    clear: () => {},
    show: () => {},
    hide: () => {},
    dispose: () => {},
  })),
  showInformationMessage: vi.fn(async (..._args: unknown[]) => undefined),
  showWarningMessage: vi.fn(async (..._args: unknown[]) => undefined),
  showErrorMessage: vi.fn(async (..._args: unknown[]) => undefined),
  createTreeView: vi.fn(() => ({ dispose: () => {} })),
  registerWebviewViewProvider: vi.fn(() => ({ dispose: () => {} })),
  activeTextEditor: undefined,
};

export const commands = {
  registerCommand: vi.fn((_command: string, _callback: (...args: unknown[]) => unknown) => ({
    dispose: () => {},
  })),
  executeCommand: vi.fn(async () => undefined),
};

export const ProgressLocation = {
  Notification: 15,
  SourceControl: 1,
  Window: 10,
};

export default {
  TreeItemCollapsibleState,
  ThemeIcon,
  TreeItem,
  EventEmitter,
  Uri,
  workspace,
  window,
  commands,
  ProgressLocation,
};
