import * as vscode from "vscode";
import * as http from "http";
import { createServer } from "./server";
import { logger } from "./logger";

const DEFAULT_PORT = 3344;
let server: http.Server;

export function activate(context: vscode.ExtensionContext) {
  logger.info("Activating vsc-mcp extension");

  async function startServer() {
    logger.debug("startServer() called");
    if (server && server.listening) {
      logger.info("Server already running, returning early");
      return;
    }

    logger.info("Starting MCP server...");
    logger.debug("Creating new HTTP server");
    server = createServer();
    logger.debug("HTTP server created");
    server.listen(DEFAULT_PORT, () => {
      logger.info(
        `MCP SSE Server running at http://127.0.0.1:${DEFAULT_PORT}/sse`,
        true
      );
    });

    logger.info("MCP server started");
  }

  function stopServer() {
    logger.info("Attempting to stop MCP server...");
    if (server) {
      if (!server.listening) {
        logger.info("Server not running, returning early");
        return;
      }
      logger.debug("Closing server...");
      server.close(() => {
        logger.info("Server closed successfully");
      });
    } else {
      logger.warn("No server instance found");
    }
  }

  startServer();

  // Register the command to start the server
  logger.debug("Registering startServer command");
  context.subscriptions.push(
    vscode.commands.registerCommand("vsc-mcp.startServer", () => {
      startServer();
    })
  );

  // Register the command to stop the server
  logger.debug("Registering stopServer command");
  context.subscriptions.push(
    vscode.commands.registerCommand("vsc-mcp.stopServer", () => {
      stopServer();
    })
  );

  logger.debug("Registering cleanup handlers");
  context.subscriptions.push({
    dispose: () => {
      logger.debug("Cleanup handler called");
      if (server) {
        server.close(() => {
          logger.info("Server closed during cleanup");
        });
      }
    },
  });
  context.subscriptions.push(logger);
  logger.info("vsc-mcp extension activation complete");
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (server) {
    server.close(() => {
      logger.info("MCP server closed");
    });
  }
}
