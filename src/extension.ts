import * as vscode from "vscode";
import { startServer } from "./server";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("vsc-mcp");
  const disposable = vscode.commands.registerCommand(
    "vsc-mcp.startServer",
    () => {
      outputChannel.appendLine("Starting MCP server...");
      startServer();
      outputChannel.appendLine("MCP server started");
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
