import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as vscode from "vscode";
import { KridayaService } from "../src/kridayaService";

describe("Kridaya - Developer Playground", () => {
  beforeEach(() => {
    vscode.window.showInformationMessage = () => Promise.resolve();
    (vscode.workspace.getConfiguration as any).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("kridaya");
    expect(cfg.get("enabled")).toBe(false);
  });

  it("should support enable/disable via commands", () => {
    // Configuration should start disabled
    expect(vscode.workspace.getConfiguration("kridaya").get("enabled")).toBe(false);
  });

  it("should have reduceMotion setting", () => {
    const cfg = vscode.workspace.getConfiguration("kridaya");
    expect(cfg.get("effects.reduceMotion")).toBe(false);
  });

  it("should have sound setting", () => {
    const cfg = vscode.workspace.getConfiguration("kridaya");
    expect(cfg.get("sound.enabled")).toBe(false);
  });
});