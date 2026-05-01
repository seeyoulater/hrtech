import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
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

  // Wire Zod into Fastify: routes can pass Zod schemas as `body` /
  // `response` and they get used both for runtime validation and for
  // generating the OpenAPI spec via `jsonSchemaTransform`.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin:
      CORS_ORIGIN === '*'
        ? true
        : CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // Swagger MUST be registered before the routes so it can collect
  // their schemas as they're added. `transform` converts Zod schemas
  // attached to routes into JSON Schema for the OpenAPI doc.
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Alt+Shift HR Tech API',
        description:
          'Cover-letter generation backend. Proxies OpenAI Chat ' +
          'Completions with streaming and a deterministic mock fallback.',
        version: '0.0.0',
      },
      // No `servers` block on purpose. Swagger UI then targets the
      // same origin the docs page was loaded from — localhost in dev,
      // the prod hostname in prod — which matches the strict CSP that
      // `staticCSP: true` installs on the docs page.
      tags: [
        { name: 'health', description: 'Service status' },
        { name: 'generate', description: 'AI cover-letter generation' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    // UI at /docs, JSON spec at /docs/json, YAML at /docs/yaml.
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
    },
    staticCSP: true,
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
