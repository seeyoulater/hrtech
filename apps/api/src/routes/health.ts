import type { FastifyPluginAsync } from 'fastify';
import type { HealthResponse } from '@hrtech/shared';

type HealthRouteOptions = {
  aiConfigured: boolean;
  model: string;
};

/**
 * GET /api/health — backend status. Reports whether OpenAI credentials
 * are configured and which model is in use. The web client reads this
 * once on page load to show the empty-state hint.
 */
export const healthRoute: FastifyPluginAsync<HealthRouteOptions> = async (
  app,
  opts,
) => {
  app.get<{ Reply: HealthResponse }>('/api/health', async () => ({
    ok: true,
    aiConfigured: opts.aiConfigured,
    model: opts.model,
  }));
};
