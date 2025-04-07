import * as vscode from "vscode";
import { logger } from "../logger";

export function listAvailableThemes() {
  logger.debug("Listing available themes...");
  const extensions = vscode.extensions.all;
  const themeExtensions = extensions
    .filter((e) => e.packageJSON.categories?.includes("Themes"))
    .map((e) => ({
      displayName: e.packageJSON.displayName,
      description: e.packageJSON.description,
    }));
  logger.debug(`Found ${themeExtensions.length} theme extensions`);
  return themeExtensions;
}

export function getCurrentTheme() {
  logger.debug("Getting current theme...");
  const theme = vscode.workspace
    .getConfiguration("workbench")
    .get("colorTheme");
  logger.debug(`Current theme is: ${theme}`);
  return theme;
}

export function setThemeByDisplayName(displayName: string) {
  logger.info(`Setting theme to: ${displayName}`);
  return vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", displayName, true)
    .then(() => {
      logger.info(`Theme successfully set to: ${displayName}`, true);
    });
}
