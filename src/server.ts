import express, { Request, Response } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { getMcpServer } from "./mcp";
import { logger } from "./logger";
import * as http from "http";

export function createServer() {
  logger.info("Initializing MCP server...");
  const server = getMcpServer();
  const app = express();

  // to support multiple simultaneous connections we have a lookup object from
  // sessionId to transport
  const transports: { [sessionId: string]: SSEServerTransport } = {};

  app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    logger.info(
      `New SSE connection established (sessionId: ${transport.sessionId})`
    );

    res.on("close", () => {
      delete transports[transport.sessionId];
      logger.info(`SSE connection closed (sessionId: ${transport.sessionId})`);
    });
    await server.connect(transport);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    logger.debug(`Received message for sessionId: ${sessionId}`);

    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
      logger.debug("Message handled successfully");
    } else {
      logger.error(`No transport found for sessionId: ${sessionId}`);
      res.status(400).send("No transport found for sessionId");
    }
  });

  return http.createServer(app);
}
