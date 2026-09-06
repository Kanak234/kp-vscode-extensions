import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { NiyamaService } from "../src/niyamaService";

describe("Niyama - Developer Control Center", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("niyama");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("search.enabled")).toBe(true);
    expect(cfg.get("favorites.max")).toBe(10);
    expect(cfg.get("keyboard.shortcut")).toBe("Ctrl+Shift+P");
  });

  it("should have default search enabled", () => {
    const cfg = vscode.workspace.getConfiguration("niyama");
    expect(cfg.get("search.enabled")).toBe(true);
  });

  it("should have default favorites max of 10", () => {
    const cfg = vscode.workspace.getConfiguration("niyama");
    expect(cfg.get("favorites.max")).toBe(10);
  });

  it("should have default keyboard shortcut", () => {
    const cfg = vscode.workspace.getConfiguration("niyama");
    expect(cfg.get("keyboard.shortcut")).toBe("Ctrl+Shift+P");
  });
});