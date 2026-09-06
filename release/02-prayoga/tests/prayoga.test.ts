import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { PrayogaService } from "../src/prayogaService";

describe("Prayoga - Code Experiment Lab", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("prayoga");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("experiment.type")).toBe("recursion");
    expect(cfg.get("results.mode")).toBe("educational");
  });

  it("should support experiment type selection", () => {
    const cfg = vscode.workspace.getConfiguration("prayoga");
    expect(["recursion", "loop", "memory", "algorithm", "syntax", "performance"]).toContain(cfg.get("experiment.type"));
  });

  it("should support result mode selection", () => {
    const cfg = vscode.workspace.getConfiguration("prayoga");
    expect(["actual", "simulated", "educational"]).toContain(cfg.get("results.mode"));
  });

  it("should default to educational mode", () => {
    const cfg = vscode.workspace.getConfiguration("prayoga");
    expect(cfg.get("results.mode")).toBe("educational");
  });
});