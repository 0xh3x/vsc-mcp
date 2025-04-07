import * as vscode from "vscode";
import { logger } from "../logger";

export function getOpenedFiles() {
  logger.debug("Getting opened files...");
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) => tabs.map((tab) => tab.label));
  logger.debug(`Found ${tabs.length} opened files`);
  return tabs;
}

export function closeFilesByLabel(labels: string[]) {
  logger.info(`Closing files with labels: ${labels.join(", ")}`);
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) =>
    tabs.filter((tab) => labels.includes(tab.label))
  );
  logger.debug(`Found ${tabs.length} matching tabs to close`);
  tabs.forEach((tab) => vscode.window.tabGroups.close(tab));
  logger.info("Files closed successfully");
}
