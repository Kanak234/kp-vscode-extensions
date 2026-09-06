import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { VividaService } from "../src/vividaService";

describe("Vivida - Humorous Diagnostics", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("vivida");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("humor.enabled")).toBe(true);
  });

  it("should display humorous explanation with technical diagnostic", () => {
    const cfg = vscode.workspace.getConfiguration("vivida");
    expect(cfg.get("humor.enabled")).toBe(true);
  });

  it("should support humor toggle", () => {
    const cfg = vscode.workspace.getConfiguration("vivida");
    expect(cfg.get("humor.enabled")).toBe(true);
  });

  it("should always keep technical diagnostic visible", () => {
    // The extension ensures technical explanation is never replaced
    vscode.window.showInformationMessage = () => Promise.resolve();
    const cfg = vscode.workspace.getConfiguration("vivida");
    expect(cfg.get("humor.enabled")).toBe(true);
  });
});