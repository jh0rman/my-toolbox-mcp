import { z } from 'zod'
import { McpServer } from '../../utils/mcp-server'
import * as Asana from 'asana'

export const getAsanaTasks = McpServer.defineTool({
  name: 'get-asana-tasks',
  description: 'Get tasks from Asana',
  parameters: {
    project: z.string().describe('The project ID to filter tasks on'),
    section: z.string().optional().describe('The section ID to filter tasks on'),
    assignee: z.string().optional().describe('The assignee ID to filter tasks on'),
  },
  handler: async (params) => {
    try {
      const client = Asana.ApiClient.instance
      const token = client.authentications.token
      token.accessToken = Bun.env.ASANA_ACCESS_TOKEN

      const taskApiInstance = new Asana.TasksApi()
      const result = await taskApiInstance.getTasks(params)

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing tasks: ${
              error instanceof Error ? JSON.stringify(error, null, 2) : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
})
