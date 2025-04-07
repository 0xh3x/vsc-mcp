import * as vscode from "vscode";
import { logger } from "../logger";

export function listAvailableThemes() {
  logger.debug("Listing available themes...");
  const themeExtensions = vscode.extensions.all.filter((e) =>
    e.packageJSON.categories?.includes("Themes")
  );

  const themes = themeExtensions.flatMap((extension) => {
    const contributes = extension.packageJSON.contributes;
    if (!contributes?.themes) return [];

    return contributes.themes.map((theme: { label: string }) => ({
      label: theme.label,
      extensionId: extension.id,
      extensionName: extension.packageJSON.displayName,
      description: extension.packageJSON.description,
    }));
  });

  logger.debug(
    `Found ${themes.length} themes across ${themeExtensions.length} extensions`
  );
  return themes;
}

export function getCurrentTheme() {
  logger.debug("Getting current theme...");
  const theme = vscode.workspace
    .getConfiguration("workbench")
    .get("colorTheme");
  logger.debug(`Current theme is: ${theme}`);
  return theme;
}

export async function setThemeByDisplayName(displayName: string) {
  logger.info(`Setting theme to: ${displayName}`);
  await vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", displayName, true);
  logger.info(`Theme successfully set to: ${displayName}`, true);
}
