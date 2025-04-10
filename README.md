# vsc-mcp - VSCode MCP Server

MCP server for interacting with VSCode and forks (Cursor, Windsurf and others)

## Installation

1. Install the extension from the VSCode marketplace
2. The server will start automatically when VSCode launches
3. You can manually start/stop the server using the commands:
   - `Start MCP Server`
   - `Stop MCP Server`

## Configuration

Configure your MCP client to connect to the server at: `http://localhost:3344/sse`

### Example Configuration for Cursor (~/.cursor/mcp.json)

```json
{
  "mcpServers": {
    "vsc-mcp": {
      "url": "http://localhost:3344/sse"
    }
  }
}
```

### Currently supported tools

1. File Management

   - `getOpenedFiles`: Retrieves a list of currently opened files
   - `closeFiles`: Closes files based on provided labels

2. Theme Management
   - `listAvailableThemes`: Lists all available VSCode themes
   - `getCurrentTheme`: Gets the currently active theme
   - `setThemeByDisplayName`: Changes the current theme by display name
