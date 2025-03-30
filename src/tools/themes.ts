import * as vscode from "vscode";

export function listAvailableThemes() {
  const extensions = vscode.extensions.all;
  const themeExtensions = extensions
    .filter((e) => e.packageJSON.categories?.includes("Themes"))
    .map((e) => ({
      displayName: e.packageJSON.displayName,
      description: e.packageJSON.description,
    }));
  return themeExtensions;
}

export function getCurrentTheme() {
  return vscode.workspace.getConfiguration("workbench").get("colorTheme");
}

export function setThemeByDisplayName(displayName: string) {
  return vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", displayName, true);
}
