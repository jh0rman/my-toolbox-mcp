import { z } from 'zod'
import { McpServer } from '../../utils/mcp-server'
import * as Asana from 'asana'

export const getAsanaTasks = McpServer.defineTool({
  name: 'get-asana-tasks',
  description: 'Get tasks from Asana',
  parameters: {
    workspace_gid: z.string().describe('The workspace ID'),
    'sections.any': z.string().optional().describe('The section ID'),
    'projects.any': z.string().optional().describe('The project ID'),
    'assignee.any': z.string().optional().describe('The assignee ID'),
    resource_subtype: z.enum(['default_task', 'milestone']).default('default_task').describe('The resource subtype to filter by'),
  },
  handler: async ({ workspace_gid, ...params }) => {
    try {
      const client = Asana.ApiClient.instance
      const token = client.authentications.token
      token.accessToken = Bun.env.ASANA_ACCESS_TOKEN

      const tasksApiInstance = new Asana.TasksApi()
      const result = await tasksApiInstance.searchTasksForWorkspace(workspace_gid, params)

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
