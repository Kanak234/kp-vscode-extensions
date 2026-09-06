# Compatibility Matrix

## VS Code Version Compatibility

- **Target Version**: ^1.85.0
- **Minimum Node**: >=18.0.0
- **Minimum PNPM**: >=8.0.0

## Extension Compatibility

| Extension | VS Code | Node | PNPM | Shared Library |
|-----------|---------|------|------|----------------|
| E16 (kridaya) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E17 (prayoga) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E18 (vivida) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E19 (kalpa) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E20 (vritti) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E21 (vibhrama) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E22 (niyama) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |
| E23 (siddhi) | ^1.85.0 | >=18 | >=8 | ^1.0.0 |

## Core Extensions Compatibility (E01-E15)

| Extension | Status |
|-----------|--------|
| vyapaka | ✅ Compatible (v1.0.0) |
| kriyasala | ✅ Compatible (v1.0.0) |
| darshana | ⚠️ Empty scaffold (no source) |
| anumana | ⚠️ Empty scaffold (no source) |
| rachana | ⚠️ Empty scaffold (no source) |
| pariksha | ⚠️ Empty scaffold (no source) |
| ganitha | ⚠️ Empty scaffold (no source) |
| tantra | ⚠️ Empty scaffold (no source) |
| sambandha | ⚠️ Empty scaffold (no source) |
| svasthya | ⚠️ Empty scaffold (no source) |
| samarpana | ⚠️ Empty scaffold (no source) |
| vyakhyana | ⚠️ Empty scaffold (no source) |
| samvada | ⚠️ Empty scaffold (no source) |
| adhikarana | ⚠️ Empty scaffold (no source) |

## Peer Dependencies

- All new extensions (E16-E23): `@kanak-prabhakar/shared: workspace:*`
- No external peer dependencies
- No secret or credential dependencies
- No cloud service dependencies (all local-only)

## Platform

- **Operating System**: Linux, macOS, Windows (VS Code compatible)
- **Architecture**: x64, arm64 (VS Code)
- **No OS-specific requirements** beyond VS Code 1.85.0+

## Extension Settings Compatibility

| Setting | E16 | E17 | E18 | E19 | E20 | E21 | E22 | E23 |
|---------|-----|-----|-----|-----|-----|-----|-----|
| enable | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| disable | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| intensity | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ |
| reduceMotion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| showNotifications | N/A | N/A | ✅ | N/A | N/A | ✅ | ✅ |
| privacy.localOnly | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ |