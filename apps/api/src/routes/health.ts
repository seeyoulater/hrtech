import type { FastifyPluginAsync } from 'fastify';
import type { HealthResponse } from '@hrtech/shared';

type HealthRouteOptions = {
  aiConfigured: boolean;
  model: string;
};

const responseSchema = {
  type: 'object',
  required: ['ok', 'aiConfigured', 'model'],
  properties: {
    ok: { type: 'boolean', enum: [true] },
    aiConfigured: { type: 'boolean' },
    model: { type: 'string' },
  },
} as const;

/**
 * GET /api/health — backend status. Reports whether OpenAI credentials
 * are configured and which model is in use. The web client reads this
 * once on page load to show the empty-state hint.
 */
export const healthRoute: FastifyPluginAsync<HealthRouteOptions> = async (
  app,
  opts,
) => {
  app.get<{ Reply: HealthResponse }>(
    '/api/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Backend status',
        description:
          'Returns whether the upstream AI provider is configured and which model is in use.',
        response: {
          200: responseSchema,
        },
      },
    },
    async () => ({
      ok: true,
      aiConfigured: opts.aiConfigured,
      model: opts.model,
    }),
  );
};
