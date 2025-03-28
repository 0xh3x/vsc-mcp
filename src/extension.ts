import * as vscode from "vscode";
import express, { Request, Response } from "express";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

function getOpenedFiles() {
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) => tabs.map((tab) => tab.label));
  return tabs;
}

function closeFilesByLabel(labels: string[]) {
  const tabGroups = vscode.window.tabGroups.all;
  const tabs = tabGroups.flatMap(({ tabs }) =>
    tabs.filter((tab) => labels.includes(tab.label))
  );
  tabs.forEach((tab) => vscode.window.tabGroups.close(tab));
}

function getMcpServer() {
  const server = new McpServer({
    name: "vsc-mcp",
    version: "1.0.0",
  });

  server.resource("openedFiles", "files://opened", async () => ({
    contents: [
      {
        uri: "files://opened",
        text: JSON.stringify(getOpenedFiles()),
      },
    ],
  }));

  server.tool(
    "closeFiles",
    { labels: z.array(z.string()) },
    async ({ labels }) => {
      closeFilesByLabel(labels);
      return {
        content: [
          {
            type: "text",
            text: `Closed files with labels: ${labels.join(", ")}`,
          },
        ],
      };
    }
  );

  // This usually is a resource, but Cursor currently has disabled resources
  // So we use a tool in addition to the resource
  // https://forum.cursor.com/t/mcp-error-no-resources-available/62209/2
  server.tool("getOpenedFiles", {}, async () => {
    const files = getOpenedFiles();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(files),
        },
      ],
    };
  });

  return server;
}

function startServer() {
  const server = getMcpServer();
  const app = express();

  // to support multiple simultaneous connections we have a lookup object from
  // sessionId to transport
  const transports: { [sessionId: string]: SSEServerTransport } = {};

  app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
      delete transports[transport.sessionId];
    });
    await server.connect(transport);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send("No transport found for sessionId");
    }
  });

  app.listen(3001);
}

export function activate(context: vscode.ExtensionContext) {
  startServer();
}

// This method is called when your extension is deactivated
export function deactivate() {}
