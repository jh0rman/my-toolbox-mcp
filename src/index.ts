import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageJson from '../package.json'
import { listComponents } from './tools/list-components'
import { registerTool } from './utils/register-tool'

// Create server instance
const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
})

// Registrar tools
registerTool(server, listComponents)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('UI Docs MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
