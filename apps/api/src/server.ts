import Fastify from 'fastify';
import cors from '@fastify/cors';
import type {
  GenerateError,
  GenerateInput,
  HealthResponse,
} from '@hrtech/shared';
import { openOpenAiStream } from './openai.js';
import { mockOpenAiSseStream } from './mock.js';

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

const generateBodySchema = {
  type: 'object',
  required: ['jobTitle', 'company'],
  additionalProperties: false,
  properties: {
    jobTitle: { type: 'string', maxLength: 200 },
    company: { type: 'string', maxLength: 200 },
    strengths: { type: 'string', maxLength: 1000, default: '' },
    details: { type: 'string', maxLength: 1200, default: '' },
  },
} as const;

async function buildServer() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              target: 'pino-pretty',
              options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
            },
    },
  });

  await app.register(cors, {
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  app.get<{ Reply: HealthResponse }>('/api/health', async () => ({
    ok: true,
    aiConfigured: Boolean(OPENAI_API_KEY),
    model: OPENAI_MODEL,
  }));

  app.post<{ Body: GenerateInput; Reply: GenerateError | string }>(
    '/api/generate',
    { schema: { body: generateBodySchema } },
    async (request, reply) => {
      const input = request.body;
      const controller = new AbortController();
      // Cancel the upstream request if the client disconnects mid-stream.
      // (`reply.raw` is the response; its 'close' fires on the client's
      // socket close OR after we ourselves call .end() — either way an
      // already-completed AbortController.abort() is a no-op.)
      reply.raw.on('close', () => {
        if (!controller.signal.aborted) controller.abort();
      });

      let upstreamBody: ReadableStream<Uint8Array> | null;

      if (OPENAI_API_KEY) {
        const upstream = await openOpenAiStream(
          input,
          { apiKey: OPENAI_API_KEY, model: OPENAI_MODEL },
          controller.signal,
        );
        if (!upstream.ok || !upstream.body) {
          request.log.error(
            { status: upstream.status },
            'OpenAI request failed',
          );
          return reply
            .code(upstream.status >= 400 ? upstream.status : 502)
            .send({ error: `Upstream error (${upstream.status} ${upstream.statusText})` });
        }
        upstreamBody = upstream.body;
      } else {
        upstreamBody = mockOpenAiSseStream(input, controller.signal);
      }

      reply.raw.statusCode = 200;
      reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      reply.raw.setHeader('Cache-Control', 'no-store, no-transform');
      reply.raw.setHeader('Connection', 'keep-alive');
      // Disable proxy buffering (nginx, vercel-style edges).
      reply.raw.setHeader('X-Accel-Buffering', 'no');
      reply.raw.flushHeaders?.();

      const reader = upstreamBody.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!reply.raw.write(value)) {
            await new Promise<void>((res) => reply.raw.once('drain', res));
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          request.log.error({ err }, 'stream error');
        }
      } finally {
        reply.raw.end();
      }
    },
  );

  return app;
}

const app = await buildServer();
try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
