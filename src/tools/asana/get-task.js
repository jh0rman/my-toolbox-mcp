import { z } from 'zod'
import { McpServer } from '../../utils/mcp-server'
import * as Asana from 'asana'

export const getAsanaTask = McpServer.defineTool({
  name: 'get-asana-task',
  description: 'Get a single task from Asana by ID',
  parameters: {
    taskId: z.string().describe('The task ID'),
  },
  handler: async ({ taskId }) => {
    try {
      const client = Asana.ApiClient.instance
      const token = client.authentications.token
      token.accessToken = Bun.env.ASANA_ACCESS_TOKEN

      const tasksApiInstance = new Asana.TasksApi()
      const result = await tasksApiInstance.getTask(taskId)

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
            text: `Error getting task: ${
              error instanceof Error ? JSON.stringify(error, null, 2) : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
})
