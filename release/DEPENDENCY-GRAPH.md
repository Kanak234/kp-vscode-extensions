# Dependency Graph

## Overall Dependency Structure

```
                           +----------------------+
                           |  @kanak-prabhakar/   |
                           |     shared (v1.0.0)  |
                           +----------+-----------+
                                      |
                                      v
+--------------------+     +--------------------+     +--------------------+
|  E16 (kridaya)    |     |  E17 (prayoga)    |     |  E18 (vivida)    |
|  Kridaya         |     |  Prayoga         |     |  Vivida          |
|  Developer Playground |   |  Code Experiment Lab |   |  Humorous Diagnostics |
+--------+----------+     +--------+----------+     +--------+-----------+
         |                     |                     |
         v                     v                     v
+--------------------+     +--------------------+     +--------------------+
|  E19 (kalpa)    |     |  E20 (vritti)    |     |  E21 (vibhrama)  |
|  Code Time Machine|     |  Live Developer  |     |  Execution Illusion|
|                  |     |  Activity        |     |  Lab               |
+--------+----------+     +--------+----------+     +--------+-----------+
         |                     |                     |
         v                     v                     v
+--------------------+     +--------------------+     +--------------------+
|  E22 (niyama)    |     |  E23 (siddhi)    |     |  (completed)     |
|  Developer Control|     |  Coding Achiev-  |     |  system complete   |
|  Center           |     |  ement System    |     |                   |
+--------------------+     +--------------------+                   
```

## Detailed Package Dependencies

### E16 - Kridaya (Developer Playground)
- @kanak-prabhakar/shared (workspace:*)

### E17 - Prayoga (Code Experiment Lab)
- @kanak-prabhakar/shared (workspace:*)

### E18 - Vivida (Humorous Diagnostics)
- @kanak-prabhakar/shared (workspace:*)

### E19 - Kalpa (Code Time Machine)
- @kanak-prabhakar/shared (workspace:*)

### E20 - Vritti (Live Developer Activity)
- @kanak-prabhakar/shared (workspace:*)

### E21 - Vibhrama (Execution Illusion Lab)
- @kanak-prabhakar/shared (workspace:*)

### E22 - Niyama (Developer Control Center)
- @kanak-prabhakar/shared (workspace:*)

### E23 - Siddhi (Coding Achievement System)
- @kanak-prabhakar/shared (workspace:*)

## Core Student Extensions (E01-E15)

- **vyapaka**: @kanak-prabhakar/shared (workspace:*)
- **kriyasala**: @kanak-prabhakar/shared (workspace:*)
- **adhikarana**: Empty scaffold
- **anumana**: Empty scaffold
- **avalokana**: Empty scaffold
- **darshana**: Empty scaffold
- **ganitha**: Empty scaffold
- **pariksha**: Empty scaffold
- **rachana**: Empty scaffold
- **samarpana**: Empty scaffold
- **sambandha**: Empty scaffold
- **svasthya**: Empty scaffold
- **samvada**: Empty scaffold
- **vyakhyana**: Empty scaffold
- **tantra**: Empty scaffold

## Root Package Configuration

- **Package**: kanak-prabhakar-vscode-extensions
- **PNPM Workspace**: 24 packages (23 extensions + shared library)
- **Build**: `pnpm run build` or `pnpm run build:all`
- **TypeCheck**: `pnpm run typecheck` or `pnpm -r run typecheck`
- **Test**: `pnpm run test` or `pnpm -r run test`
- **Package**: `pnpm run package` or `pnpm -r run package`
- **VSIX**: `vsce package --no-dependencies` per extension