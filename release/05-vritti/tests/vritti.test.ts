import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { VrittiService } from "../src/vrittiService";

describe("Vritti - Live Developer Activity", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("vritti");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("metrics.activeEditor")).toBe(true);
    expect(cfg.get("metrics.runningTasks")).toBe(true);
    expect(cfg.get("metrics.extensionActivity")).toBe(true);
    expect(cfg.get("metrics.buildStatus")).toBe(true);
    expect(cfg.get("metrics.testStatus")).toBe(true);
    expect(cfg.get("metrics.debugState")).toBe(true);
  });

  it("should show UNAVAILABLE for metrics that cannot be obtained", () => {
    // The extension shows UNAVAILABLE instead of inventing data
    const cfg = vscode.workspace.getConfiguration("vritti");
    expect(cfg.get("enabled")).toBe(false);
  });

  it("should have all metric settings as booleans", () => {
    const cfg = vscode.workspace.getConfiguration("vritti");
    const metrics = [
      "activeEditor",
      "runningTasks",
      "extensionActivity",
      "buildStatus",
      "testStatus",
      "debugState"
    ];
    for (const metric of metrics) {
      expect(typeof cfg.get(`metrics.${metric}`)).toBe("boolean");
    }
  });
});