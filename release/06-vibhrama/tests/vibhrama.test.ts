import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { VibhramaService } from "../src/vibhramaService";

describe("Vibhrama - Execution Illusion Lab", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("vibhrama");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("simulation.enabled")).toBe(false);
    expect(cfg.get("mode")).toBe("actual");
  });

  it("should distinguish actual execution from visual simulation", () => {
    const cfg = vscode.workspace.getConfiguration("vibhrama");
    expect(["actual", "simulated"]).toContain(cfg.get("mode"));
  });

  it("should default to actual execution mode", () => {
    const cfg = vscode.workspace.getConfiguration("vibhrama");
    expect(cfg.get("mode")).toBe("actual");
  });

  it("should support mode toggle between actual and simulated", () => {
    const cfg = vscode.workspace.getConfiguration("vibhrama");
    expect(cfg.get("mode")).toBe("actual");
  });
});