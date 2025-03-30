import { z } from 'zod'
import { McpServer } from '../../utils/mcp-server'
import * as Asana from 'asana'

export const updateAsanaTask = McpServer.defineTool({
  name: 'update-asana-task',
  description: 'Update a single task in Asana by ID',
  parameters: {
    taskId: z.string().describe('The task ID'),
    name: z.string().optional().describe('The name of the task'),
    completed: z.boolean().optional().describe('Whether the task is completed'),
    assignee: z.string().optional().describe('The assignee ID'),
    custom_fields: z.record(z.string(), z.any()).optional().describe('Custom fields to update'),
    parent: z.string().optional().describe('The parent task ID'),
  },
  handler: async ({ taskId, ...params }) => {
    try {
      const client = Asana.ApiClient.instance
      const token = client.authentications.token
      token.accessToken = Bun.env.ASANA_ACCESS_TOKEN

      const tasksApiInstance = new Asana.TasksApi()
      const result = await tasksApiInstance.updateTask(taskId, params)

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
            text: `Error updating task: ${
              error instanceof Error ? JSON.stringify(error, null, 2) : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
})
