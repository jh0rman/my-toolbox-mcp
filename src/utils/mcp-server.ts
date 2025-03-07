import { McpServer as Server } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { z } from 'zod'
import type { McpTool } from '../types/tool'
import { styleText } from 'node:util'

interface McpServerOptions {
  name: string
  version: string
}

export class McpServer {
  private server: Server
  private options: McpServerOptions

  constructor(options: McpServerOptions) {
    this.options = options
    this.server = new Server({
      name: this.options.name,
      version: this.options.version,
    })
    console.info(`${styleText('magenta', 'Initializing MCP Server:')} ${this.options.name} v${this.options.version}`)
  }

  register<Params extends z.ZodRawShape>(tool: McpTool<Params>) {
    console.info(`${styleText('green', 'Registering tool:')} ${tool.name} ${styleText('gray', tool.description)}`)
    this.server.tool(tool.name, tool.description, tool.parameters, tool.handler)
  }

  static defineTool<Params extends z.ZodRawShape>(tool: McpTool<Params>) {
    return tool
  }

  async start(transport: StdioServerTransport) {
    await this.server.connect(transport)
    console.info(`${styleText('magenta', 'MCP Server')} ${this.options.name} ${styleText('magenta', 'running.')}`)
  }
} 