import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ensureRuntimeGitEnvironment,
  resolveLocalGitDirectory,
  sanitizeLocalGitDirectory,
} from "./main/git_path";

describe("resolveLocalGitDirectory", () => {
  it("falls back to a valid system Git directory when the bundled Dugite git directory is missing", () => {
    const systemGitDir = "/Library/Developer/CommandLineTools/usr";
    const gitBin = "/usr/bin/git";
    const execPath = "/Library/Developer/CommandLineTools/usr/libexec/git-core";

    const resolved = resolveLocalGitDirectory({
      appPath: "/tmp/app",
      resourcesPath: "/tmp/resources",
      bundledGitDir: "/tmp/app/node_modules/dugite/git",
      systemGitBin: gitBin,
      systemGitExecPath: execPath,
      exists: (target: string) =>
        target === execPath ||
        target === systemGitDir ||
        target === path.join(systemGitDir, "bin", "git"),
    });

    expect(resolved).toBe(systemGitDir);
  });

  it("sanitizes a stale invalid LOCAL_GIT_DIRECTORY override and resolves a valid system Git root", () => {
    const previous = process.env.LOCAL_GIT_DIRECTORY;
    process.env.LOCAL_GIT_DIRECTORY = "/tmp/not-a-real-git-root";

    try {
      const systemGitDir = "/Library/Developer/CommandLineTools/usr";
      const gitBin = "/usr/bin/git";
      const execPath =
        "/Library/Developer/CommandLineTools/usr/libexec/git-core";

      const resolved = sanitizeLocalGitDirectory({
        appPath: "/tmp/app",
        resourcesPath: "/tmp/resources",
        bundledGitDir: "/tmp/app/node_modules/dugite/git",
        systemGitBin: gitBin,
        systemGitExecPath: execPath,
        exists: (target: string) =>
          target === process.env.LOCAL_GIT_DIRECTORY ||
          target === execPath ||
          target === systemGitDir ||
          target === path.join(systemGitDir, "bin", "git"),
      });

      expect(resolved).toBe(systemGitDir);
    } finally {
      if (previous === undefined) {
        delete process.env.LOCAL_GIT_DIRECTORY;
      } else {
        process.env.LOCAL_GIT_DIRECTORY = previous;
      }
    }
  });

  it("clears stale Git overrides before the headless runtime initializes", () => {
    const previous = process.env.LOCAL_GIT_DIRECTORY;
    process.env.LOCAL_GIT_DIRECTORY = "/Users/vishal/git";

    try {
      const systemGitDir = "/Library/Developer/CommandLineTools/usr";
      const execPath =
        "/Library/Developer/CommandLineTools/usr/libexec/git-core";

      const resolved = ensureRuntimeGitEnvironment({
        appPath: "/tmp/app",
        resourcesPath: "/tmp/resources",
        bundledGitDir: "/tmp/app/node_modules/dugite/git",
        systemGitBin: "/usr/bin/git",
        systemGitExecPath: execPath,
        exists: (target: string) =>
          target === execPath ||
          target === systemGitDir ||
          target === path.join(systemGitDir, "bin", "git"),
      });

      expect(resolved).toBe(systemGitDir);
      expect(process.env.LOCAL_GIT_DIRECTORY).toBe(systemGitDir);
    } finally {
      if (previous === undefined) {
        delete process.env.LOCAL_GIT_DIRECTORY;
      } else {
        process.env.LOCAL_GIT_DIRECTORY = previous;
      }
    }
  });
});
