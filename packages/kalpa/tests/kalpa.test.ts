import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { KalpaService } from "../src/kalpaService";

describe("Kalpa - Code Time Machine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("kalpa");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("timeline.autoscroll")).toBe(true);
    expect(cfg.get("restore.confirm")).toBe(true);
  });

  it("should support timeline autoscroll setting", () => {
    const cfg = vscode.workspace.getConfiguration("kalpa");
    expect(typeof cfg.get("timeline.autoscroll")).toBe("boolean");
  });

  it("should require confirmation for destructive restore", () => {
    const cfg = vscode.workspace.getConfiguration("kalpa");
    expect(cfg.get("restore.confirm")).toBe(true);
  });

  it("should default confirm to true", () => {
    const cfg = vscode.workspace.getConfiguration("kalpa");
    expect(cfg.get("restore.confirm")).toBe(true);
  });
});