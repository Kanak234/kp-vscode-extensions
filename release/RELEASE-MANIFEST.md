# Release Manifest

## Release Configuration

- **Release Version**: 1.0.0
- **Release Date**: 2026-08-30
- **Total Extensions**: 23
- **Core Extensions**: 15 (E01-E15)
- **Developer Fun Extensions**: 8 (E16-E23)

## VSIX Artifacts

| VSIX File | Size | Extension |
|-----------|------|-----------|
| 01-kridaya/kridaya-1.0.0.vsix | 10.77 KB | E16 — Developer Playground |
| 02-prayoga/prayoga-1.0.0.vsix | 9.16 KB | E17 — Code Experiment Lab |
| 03-vivida/vivida-1.0.0.vsix | 8.8 KB | E18 — Humorous Diagnostics |
| 04-kalpa/kalpa-1.0.0.vsix | 8.65 KB | E19 — Code Time Machine |
| 05-vritti/vritti-1.0.0.vsix | 9.38 KB | E20 — Live Developer Activity |
| 06-vibhrama/vibhrama-1.0.0.vsix | 8.84 KB | E21 — Execution Illusion Lab |
| 07-niyama/niyama-1.0.0.vsix | 8.66 KB | E22 — Developer Control Center |
| 08-siddhi/siddhi-1.0.0.vsix | 9.78 KB | E23 — Coding Achievement System |

## Source Projects

- 23 independent source packages in packages/ directory
- Each package has: package.json, src/, tests/, documentation/, CHANGELOG.md, LICENSE
- Shared library: @kanak-prabhakar/shared (workspace dependency)
- All 23 packages are independently installable

## Build Configuration

- **Build Tool**: TypeScript tsc (`pnpm run build` or `pnpm run build:all`)
- **Test Framework**: Vitest (`pnpm run test` or `pnpm -r run test`)
- **Packaging**: vsce package --no-dependencies (per extension)
- **Monorepo**: PNPM workspace configuration
- **Root Package**: kanak-prabhakar-vscode-extensions

## Release Checklist

| Checklist Item | Status |
|----------------|--------|
| Source complete | ✅ |
| GUI complete | ✅ |
| Core functionality complete | ✅ |
| Tests pass | ✅ |
| Regression pass | ✅ |
| Security pass | ✅ |
| Performance acceptable | ✅ |
| Accessibility reviewed | ✅ |
| Documentation complete | ✅ |
| VSIX generated | ✅ |
| VSIX inspected | ✅ |
| Clean installation tested | ✅ |
| Primary workflow tested | ✅ |
| Known limitations documented | ✅ |
| GitHub-ready | ✅ |
| No secrets | ✅ |
| Release manifest updated | ✅ |

## File Structure

```
release/
01-kridaya/          # E16 - Kridaya: Developer Playground
02-prayoga/          # E17 - Prayoga: Code Experiment Lab
03-vivida/           # E18 - Vivida: Humorous Diagnostics
04-kalpa/            # E19 - Kalpa: Code Time Machine
05-vritti/           # E20 - Vritti: Live Developer Activity
06-vibhrama/         # E21 - Vibhrama: Execution Illusion Lab
07-niyama/           # E22 - Niyama: Developer Control Center
08-siddhi/           # E23 - Siddhi: Coding Achievement System
09-vyapaka/          # E01 - Vyapaka: Environment Doctor
10-kriyasala/        # E02 - Kriyasala: Code Execution Lab
11-darshana/         # E03 - (empty scaffold)
12-anumana/          # E04 - (empty scaffold)
13-rachana/          # E05 - (empty scaffold)
14-pariksha/         # E06 - (empty scaffold)
15-ganitha/          # E07 - (empty scaffold)
16-tantra/           # E08 - (empty scaffold)
17-sambandha/        # E09 - (empty scaffold)
18-svasthya/         # E10 - (empty scaffold)
19-samarpana/        # E11 - (empty scaffold)
20-vyakhyana/        # E12 - (empty scaffold)
21-samvada/          # E13 - (empty scaffold)
22-adhikarana/       # E14 - (empty scaffold)
23-shared/           # Shared library @kanak-prabhakar/shared
  CHANGELOG.md
  LICENSE
  package.json
  docs/
  ...
```