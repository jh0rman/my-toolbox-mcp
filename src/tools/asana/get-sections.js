import { z } from 'zod'
import { McpServer } from '../../utils/mcp-server'
import * as Asana from 'asana'

export const getAsanaSections = McpServer.defineTool({
  name: 'get-asana-sections',
  description: 'Get sections for a project from Asana',
  parameters: {
    project: z.string().optional().describe('The project ID to filter sections on'),
  },
  handler: async ({ project }) => {
    const projectId = project || Bun.env.ASANA_PROJECT_ID
    try {
      const client = Asana.ApiClient.instance
      const token = client.authentications.token
      token.accessToken = Bun.env.ASANA_ACCESS_TOKEN

      const sectionsApiInstance = new Asana.SectionsApi()
      const result = await sectionsApiInstance.getSectionsForProject(projectId)

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
            text: `Error listing sections: ${
              error instanceof Error ? JSON.stringify(error, null, 2) : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
})
