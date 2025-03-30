import { McpServer } from './utils/mcp-server'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageJson from '../package.json'
import { getAsanaSections } from './tools/asana/get-sections'
import { getAsanaTasks } from './tools/asana/get-tasks'
import { getAsanaTask } from './tools/asana/get-task'
import { updateAsanaTask } from './tools/asana/update-task'

const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version
})

server.register(getAsanaSections)
server.register(getAsanaTasks)
server.register(getAsanaTask)
server.register(updateAsanaTask)

async function main() {
  const transport = new StdioServerTransport()
  await server.start(transport)
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
