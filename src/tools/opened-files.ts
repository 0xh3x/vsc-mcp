import * as vscode from "vscode";

export function getOpenedFiles() {
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) => tabs.map((tab) => tab.label));
  return tabs;
}

export function closeFilesByLabel(labels: string[]) {
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) =>
    tabs.filter((tab) => labels.includes(tab.label))
  );
  tabs.forEach((tab) => vscode.window.tabGroups.close(tab));
}
