import type { FastifyPluginAsync } from 'fastify';
import { Readable } from 'node:stream';
import type { GenerateInput } from '@hrtech/shared';
import { openOpenAiStream } from '../utils/openai.js';
import { mockOpenAiSseStream } from '../utils/mock.js';

type GenerateRouteOptions = {
  /** OpenAI API key. Empty string means use the mock streamer. */
  apiKey: string;
  /** Model name passed through to OpenAI. */
  model: string;
};

const generateBodySchema = {
  type: 'object',
  required: ['jobTitle', 'company'],
  additionalProperties: false,
  properties: {
    jobTitle: { type: 'string', maxLength: 200, examples: ['Product manager'] },
    company: { type: 'string', maxLength: 200, examples: ['Apple'] },
    strengths: {
      type: 'string',
      maxLength: 1000,
      default: '',
      examples: ['Design systems and reliable shipping'],
    },
    details: {
      type: 'string',
      maxLength: 1200,
      default: '',
      examples: ['5 years on developer tooling'],
    },
  },
} as const;

const errorResponseSchema = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

/**
 * POST /api/generate — streams a cover letter back as OpenAI-format
 * SSE. Falls back to the deterministic mock when no API key is
 * configured. Cancels the upstream OpenAI request when the client
 * disconnects mid-stream.
 */
export const generateRoute: FastifyPluginAsync<GenerateRouteOptions> = async (
  app,
  opts,
) => {
  app.post<{ Body: GenerateInput }>(
    '/api/generate',
    {
      schema: {
        tags: ['generate'],
        summary: 'Stream a generated cover letter',
        description:
          'Returns OpenAI-format Server-Sent Events. Each `data:` frame ' +
          'contains a `choices[0].delta.content` token; the stream ends ' +
          'with `data: [DONE]`. The same shape is produced by the mock ' +
          'fallback when the backend has no API key.',
        body: generateBodySchema,
        response: {
          // 200 is the streamed response; declared loosely since the
          // body is text/event-stream, not JSON.
          200: {
            description: 'OpenAI-format SSE stream of letter tokens.',
            type: 'string',
          },
          400: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const input = request.body;
      const controller = new AbortController();
      // Cancel the upstream request if the client disconnects mid-stream.
      // (`reply.raw` is the response; its 'close' fires on the client's
      // socket close OR after we ourselves end it — abort() on an
      // already-completed controller is a no-op.)
      reply.raw.on('close', () => {
        if (!controller.signal.aborted) controller.abort();
      });

      let upstreamBody: ReadableStream<Uint8Array> | null;

      if (opts.apiKey) {
        const upstream = await openOpenAiStream(
          input,
          { apiKey: opts.apiKey, model: opts.model },
          controller.signal,
        );
        if (!upstream.ok || !upstream.body) {
          request.log.error(
            { status: upstream.status },
            'OpenAI request failed',
          );
          return reply
            .code(upstream.status >= 400 ? upstream.status : 502)
            .send({
              error: `Upstream error (${upstream.status} ${upstream.statusText})`,
            });
        }
        upstreamBody = upstream.body;
      } else {
        upstreamBody = mockOpenAiSseStream(input, controller.signal);
      }

      // Pipe through Fastify's reply pipeline (NOT reply.raw) so the
      // @fastify/cors `onSend` hook runs and adds Access-Control-Allow-*
      // headers to this streaming response. `X-Accel-Buffering: no`
      // tells nginx-style proxies to flush per-chunk.
      return reply
        .code(200)
        .header('Content-Type', 'text/event-stream; charset=utf-8')
        .header('Cache-Control', 'no-store, no-transform')
        .header('Connection', 'keep-alive')
        .header('X-Accel-Buffering', 'no')
        .send(Readable.fromWeb(upstreamBody as never));
    },
  );
};
