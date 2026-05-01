import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf8'),
);

// Real npm deps stay external — Fastify et al. rely on dynamic require
// patterns that don't survive bundling, and the deploy step ships them
// in `node_modules` anyway. Workspace `@hrtech/*` packages are inlined
// instead, so prod never tries to load a `.ts` file from `node_modules`
// (Node's type-stripping skips that path, which is what broke the
// Sliplane healthcheck after the Zod migration).
const external = Object.keys(pkg.dependencies ?? {}).filter(
  (name) => !name.startsWith('@hrtech/'),
);

await build({
  entryPoints: ['src/server.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  external,
  sourcemap: true,
  logLevel: 'info',
});
