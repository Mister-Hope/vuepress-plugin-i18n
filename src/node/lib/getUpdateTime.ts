import { fs } from "vuepress/utils";
import { isGitRepo as _isGitRepo } from "@vuepress/plugin-git";
import { path } from "vuepress/utils";
import type { App } from "vuepress";
import type { I18nPluginInternalOptions } from "../options.js";
import { logger } from "../utils.js";
import type { Page } from "../../shared/types.js";

const gitRepoStatus: Record<string, boolean> = {};
const isGitRepo = (cwd: string) => (gitRepoStatus[cwd] ??= _isGitRepo(cwd));

import { spawn } from "node:child_process";

/**
 * Helper function to run git command using spawn and return stdout as a promise.
 * Rejects if the git command exits with a non-zero code.
 */
const runGitLog = (args: string[], cwd: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const gitProcess = spawn("git", ["log", ...args], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdoutData = "";
    let stderrData = "";

    gitProcess.stdout.on("data", (chunk: Buffer) => {
      stdoutData += chunk.toString("utf8");
    });

    gitProcess.stderr.on("data", (chunk: Buffer) => {
      stderrData += chunk.toString("utf8");
    });

    gitProcess.on("error", (error) => {
      reject(new Error(`Failed to spawn 'git log': ${error.message}`));
    });

    gitProcess.on("close", (code) => {
      if (code === 0) {
        resolve(stdoutData);
      } else {
        reject(
          new Error(
            `'git log' failed with exit code ${code}: ${stderrData.trim()}`,
          ),
        );
      }
    });
  });

/**
 * Get unix timestamp in milliseconds of the last commit
 */
export const getUpdatedTime = async (
  filePaths: string[],
  cwd: string,
): Promise<number> => {
  const result = await runGitLog(
    [
      "--no-pager",
      "--format=%at",
      // if there is only one file to be included, add `-1` option
      ...(filePaths.length > 1 ? [] : ["-1"]),
      ...filePaths,
    ],
    cwd,
  );

  return (
    Math.max(...result.split("\n").map((item) => Number.parseInt(item, 10))) *
    1000
  );
};

export const getUpdateTime = async (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions,
): Promise<number | undefined> => {
  let updatedTimeType = options.updatedTime;
  if (typeof updatedTimeType === "function") {
    const result = updatedTimeType(page, app);
    if (result === "git" || result === "file") updatedTimeType = result;
    else return result;
  }
  switch (updatedTimeType) {
    case "git": {
      const cwd = app.dir.source();
      if (page.data.git?.updatedTime) {
        return page.data.git.updatedTime;
      } else if (isGitRepo(cwd) && page.filePathRelative) {
        return await getUpdatedTime(
          [
            page.filePathRelative,
            ...(page.frontmatter.gitInclude ?? []).map((item) =>
              path.join(page.filePathRelative, "..", item),
            ),
          ],
          cwd,
        );
      }
      break;
    }
    case "file": {
      if (page.filePath) {
        return (await fs.stat(page.filePath)).mtimeMs;
      }
      break;
    }
    default: {
      logger.warn(
        `Invalid updatedTime type: ${updatedTimeType as string}, ignored.`,
      );
      break;
    }
  }
  return undefined;
};
