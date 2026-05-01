import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

type HealthRouteOptions = {
  aiConfigured: boolean;
  model: string;
};

const healthResponseSchema = z.object({
  ok: z.literal(true),
  aiConfigured: z.boolean(),
  model: z.string(),
});

/**
 * GET /api/health — backend status. Reports whether OpenAI credentials
 * are configured and which model is in use. The web client reads this
 * once on page load to show the empty-state hint.
 */
export const healthRoute: FastifyPluginAsync<HealthRouteOptions> = async (
  app,
  opts,
) => {
  app.get(
    '/api/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Backend status',
        description:
          'Returns whether the upstream AI provider is configured and which model is in use.',
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => ({
      ok: true as const,
      aiConfigured: opts.aiConfigured,
      model: opts.model,
    }),
  );
};
