import { z } from 'zod'
import { components } from '../data/components-data.json'
import type { McpTool } from '../types/tool'

const parameters = {
  includeDeprecated: z
    .boolean()
    .default(false)
    .describe('Incluir componentes deprecados'),
}

type ComponentData = (typeof components)[keyof typeof components]

export const listComponents: McpTool<typeof parameters> = {
  name: 'list-components',
  description: 'Lista todos los componentes disponibles en la librería',
  parameters,
  handler: async ({ includeDeprecated }) => {
    try {
      // Filtrar componentes
      const filteredComponents = Object.entries(components).map(
        ([id, comp]) => ({
          id,
          ...comp,
        }),
      )

      // Preparar respuesta
      const response = {
        components: filteredComponents.map((comp) => ({
          id: comp.id,
          name: comp.name,
          description: comp.description,
        })),
        total: filteredComponents.length,
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing components: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          },
        ],
      }
    }
  },
}
