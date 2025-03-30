import * as vscode from "vscode";
import * as http from "http";
import { createServer } from "./server";

const DEFAULT_PORT = 3344;
export const outputChannel = vscode.window.createOutputChannel("vsc-mcp");
let server: http.Server;

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating vsc-mcp extension");

  function startServer() {
    console.log("startServer() called");
    if (server && server.listening) {
      console.log("Server already running, returning early");
      outputChannel.appendLine("MCP server is already running");
      vscode.window.showInformationMessage("MCP server is already running");
      return;
    }

    outputChannel.appendLine("Starting MCP server...");
    console.log("Creating new HTTP server");
    server = createServer();
    server.listen(DEFAULT_PORT, () => {
      console.log(`Server listening on port ${DEFAULT_PORT}`);
      outputChannel.appendLine(
        `MCP SSE Server running at http://127.0.0.1:${DEFAULT_PORT}/sse`
      );
      vscode.window.showInformationMessage(
        `MCP SSE Server running at http://127.0.0.1:${DEFAULT_PORT}/sse`
      );
    });

    outputChannel.appendLine("MCP server started");
    console.log("Server instance saved to global variable");
  }

  function stopServer() {
    console.log("stopServer() called");
    outputChannel.appendLine("Attempting to stop MCP server...");
    if (server) {
      if (!server.listening) {
        console.log("Server not running, returning early");
        outputChannel.appendLine("MCP server is not running");
        vscode.window.showInformationMessage("MCP server is not running");
        return;
      }
      console.log("Closing server...");
      outputChannel.appendLine("Closing MCP server...");
      server.close(() => {
        console.log("Server closed successfully");
        outputChannel.appendLine("MCP server closed");
        vscode.window.showInformationMessage("MCP server closed");
      });
    } else {
      console.log("No server instance found");
      outputChannel.appendLine("No MCP server instance found");
      vscode.window.showInformationMessage("No MCP server instance found");
    }
  }
  // for some reason, the server doesn't start when the extension is activated
  // startServer();

  // Register the command to start the server
  console.log("Registering startServer command");
  context.subscriptions.push(
    vscode.commands.registerCommand("vsc-mcp.startServer", () => {
      startServer();
    })
  );

  // Register the command to stop the server
  console.log("Registering stopServer command");
  context.subscriptions.push(
    vscode.commands.registerCommand("vsc-mcp.stopServer", () => {
      stopServer();
    })
  );

  console.log("Registering cleanup handlers");
  context.subscriptions.push({
    dispose: () => {
      console.log("Cleanup handler called");
      if (server) {
        server.close(() => {
          console.log("Server closed during cleanup");
          outputChannel.appendLine("MCP server closed");
          vscode.window.showInformationMessage("MCP server closed");
        });
      }
    },
  });
  context.subscriptions.push(outputChannel);
  console.log("vsc-mcp extension activation complete");
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (server) {
    server.close(() => {
      outputChannel.appendLine("MCP server closed");
      vscode.window.showInformationMessage("MCP server closed");
    });
  }
}
