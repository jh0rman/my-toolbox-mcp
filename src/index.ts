import { McpServer } from './utils/mcp-server'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageJson from '../package.json'
import { listComponents } from './tools/list-components'
import { getComponentDocs } from './tools/get-component-docs'

const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version
})

server.register(listComponents)
server.register(getComponentDocs)

async function main() {
  const transport = new StdioServerTransport()
  await server.start(transport)
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
