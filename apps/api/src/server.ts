import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoute } from './routes/health.js';
import { generateRoute } from './routes/generate.js';

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

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
    origin:
      CORS_ORIGIN === '*'
        ? true
        : CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  await app.register(healthRoute, {
    aiConfigured: Boolean(OPENAI_API_KEY),
    model: OPENAI_MODEL,
  });

  await app.register(generateRoute, {
    apiKey: OPENAI_API_KEY,
    model: OPENAI_MODEL,
  });

  return app;
}

const app = await buildServer();
try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
