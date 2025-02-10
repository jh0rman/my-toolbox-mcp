import { z } from 'zod'
import { components } from '../data/components-data.json'
import type { McpTool } from '../types/tool'

const parameters = {
  componentName: z.string().describe('ID del componente'),
}

export const getComponentDocs: McpTool<typeof parameters> = {
  name: 'get-component-docs',
  description: 'Obtiene la documentación completa de un componente',
  parameters,
  handler: ({ componentName }) => {
    try {
      // Obtener el componente
      const component = components.find((c) => c.name === componentName)

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component '${componentName}' not found`,
            },
          ],
        }
      }

      // Retornar toda la documentación
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(component, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving component documentation: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
}
