# Known Limitations

## Extension-Specific Limitations

### E16 - Kridaya (Developer Playground)
- Visual effects are optional and OFF by default
- No actual code execution; provides visual feedback only
- Sound effects are purely decorative

### E17 - Prayoga (Code Experiment Lab)
- Experiments are educational/simulated, not actual runtime execution
- Performance experiments may not reflect real system behavior
- Memory experiments may not reflect actual heap state

### E18 - Vivida (Humorous Diagnostics)
- Humor is supplementary; always keep technical diagnostics visible
- Humor may not be appropriate for all audiences or professional settings
- Some error types may not have corresponding humorous explanations

### E19 - Kalpa (Code Time Machine)
- Timeline visualization integrates with Git where available
- Restore preview does NOT actually overwrite user files (by design)
- Git integration requires working git repository

### E20 - Vritti (Live Developer Activity)
- Metrics that cannot be obtained reliably show "UNAVAILABLE"
- Cannot collect metrics from external CI systems
- Debug state only shows active session, not detailed call stacks

### E21 - Vibhrama (Execution Illusion Lab)
- Visual simulation is NOT the actual CPU/runtime state
- Must clearly distinguish actual execution from visual simulation
- Simulation complexity limited to keep performance acceptable

### E22 - Niyama (Developer Control Center)
- Search limited to first 20 commands from vscode.commands.getCommands()
- Favorites and recent history are local-only, not synced
- Keyboard shortcut configurable but may conflict with other extensions

### E23 - Siddhi (Coding Achievement System)
- Achievements are local-only; no cloud sync or external tracking
- No mandatory cloud account required
- Progress resets on new workspace detection if configured

## System-Level Limitations

### Performance
- Visual effects may degrade typing/scrolling on low-end hardware if intensity is high
- All effects are intensity-controllable and should be kept at default (0) or disabled

### Accessibility
- Color-dependent information may not be accessible to color-blind users
- Screen reader experience varies; some webview content may not be fully optimized
- Reduced motion may eliminate some visual feedback users find helpful

### Functionality
- No extension provides actual code compilation or execution (except E02-Kriyasala which is separate)
- Humorous diagnostics (E18) are entertainment-only; not a substitute for actual debugging
- Achievement system (E23) tracks only a predefined set of milestones

### Accessibility
- Some icons are minimal placeholders (not custom-designed for accessibility)
- Reduced motion may eliminate some visual feedback users find helpful
- No sound may reduce enjoyment for users who expect audio feedback

### Known Bugs / Open Issues
- pnpm recursive run may fail when typechecking all packages simultaneously (workaround: run individual packages)
- Some extensions may have TypeScript strict mode issues in edge cases
- Icon files are placeholders; not custom-designed
- Test files require vscode module resolution (expected for VS Code extension development)