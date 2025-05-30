import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getOpenedFiles, closeFilesByLabel } from "./tools/opened-files";
import {
  listAvailableThemes,
  getCurrentTheme,
  setThemeByDisplayName,
} from "./tools/themes";

export function getMcpServer() {
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

  // Theme-related tools
  server.tool("listAvailableThemes", {}, async () => {
    const themes = listAvailableThemes();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(themes),
        },
      ],
    };
  });

  server.tool("getCurrentTheme", {}, async () => {
    const theme = getCurrentTheme();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(theme),
        },
      ],
    };
  });

  server.tool(
    "setThemeByDisplayName",
    { displayName: z.string() },
    async ({ displayName }) => {
      await setThemeByDisplayName(displayName);
      return {
        content: [
          {
            type: "text",
            text: `Theme set to: ${displayName}`,
          },
        ],
      };
    }
  );

  return server;
}
