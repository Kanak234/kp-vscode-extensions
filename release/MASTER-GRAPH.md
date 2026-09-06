# Dependency Graph

## Package Dependencies

All extensions depend on the shared library:

```
@kanak-prabhakar/shared ← E01 through E23
```

## New Extensions (E16-E23) Dependency Details

| Extension | Package Name | Dependencies |
|-----------|-------------|-------------|
| E16 | kridaya | @kanak-prabhakar/shared |
| E17 | prayoga | @kanak-prabhakar/shared |
| E18 | vivida | @kanak-prabhakar/shared |
| E19 | kalpa | @kanak-prabhakar/shared |
| E20 | vritti | @kanak-prabhakar/shared |
| E21 | vibhrama | @kanak-prabhakar/shared |
| E22 | niyama | @kanak-prabhakar/shared |
| E23 | siddhi | @kanak-prabhakar/shared |

## Shared Library

- **Package**: @kanak-prabhakar/shared
- **Version**: 1.0.0
- **Features**: Logging, configuration validation, filesystem operations, process execution, security inputs, testing utilities
- **All extensions**: Depend on shared for core functionality
- **No circular dependencies**: Each extension is independently installable

## Root Package

- **kanak-prabhakar-vscode-extensions**: Root monorepo configuration
- **Scripts**: build:all, lint, typecheck, test, package:all
- **PNPM Workspace**: Lists all 23 packages plus shared library