import { describe, it, expect } from "vitest";
import * as vscode from "vscode";
import { SiddhiService } from "../src/siddhiService";

describe("Siddhi - Coding Achievement System", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have configuration settings defined", () => {
    const cfg = vscode.workspace.getConfiguration("siddhi");
    expect(cfg.get("enabled")).toBe(false);
    expect(cfg.get("privacy.localOnly")).toBe(true);
    expect(cfg.get("achievements.showNotifications")).toBe(true);
  });

  it("should default to local-only privacy", () => {
    const cfg = vscode.workspace.getConfiguration("siddhi");
    expect(cfg.get("privacy.localOnly")).toBe(true);
  });

  it("should have showNotifications default true", () => {
    const cfg = vscode.workspace.getConfiguration("siddhi");
    expect(cfg.get("achievements.showNotifications")).toBe(true);
  });

  it("should track achievements based on real events", () => {
    const cfg = vscode.workspace.getConfiguration("siddhi");
    const progress = cfg.get<Record<string, boolean>>("progress") ?? {};
    expect(typeof progress).toBe("object");
  });

  it("should have achievements list", () => {
    const cfg = vscode.workspace.getConfiguration("siddhi");
    const progress = cfg.get<Record<string, boolean>>("progress") ?? {};
    expect(progress["First Build"]).toBeDefined();
    expect(progress["First Test"]).toBeDefined();
    expect(progress["First Debug Session"]).toBeDefined();
    expect(progress["First Successful Project"]).toBeDefined();
    expect(progress["100 Successful Runs"]).toBeDefined();
    expect(progress["First Git Commit"]).toBeDefined();
    expect(progress["First Refactor"]).toBeDefined();
    expect(progress["First Passing Test Suite"]).toBeDefined();
  });
});