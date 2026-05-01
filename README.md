# Alt+Shift — Cover letter generator

[![Live demo](https://img.shields.io/badge/Live%20demo-1f7a4a?style=for-the-badge&logo=react&logoColor=white)](https://hrtech-web.sliplane.app/)
[![Storybook](https://img.shields.io/badge/Storybook-ff4785?style=for-the-badge&logo=storybook&logoColor=white)](https://hrtech-storybook.sliplane.app/)
[![API docs](https://img.shields.io/badge/API%20docs-85ea2d?style=for-the-badge&logo=swagger&logoColor=black)](https://hrtech.sliplane.app/docs)

A small HR-tech app that helps job seekers draft AI-generated cover
letters and nudges them toward a goal of five applications. Built as a
test assignment for Variant Group.

- **Dashboard** — list of all generated letters with copy / delete and a
  goal banner that disappears once the user reaches five letters.
- **Generator** — split layout: form on the left, streamed letter on the
  right. "Try Again" re-generates with the same record.
- **Persistence** — letters survive a tab close (localStorage) and stay
  in sync across tabs (`storage` event).
- **AI** — Backend Fastify proxy → OpenAI Chat Completions with
  streaming. Falls back to a deterministic mock when no key is
  configured so the app is fully functional without credentials. The
  API key never reaches the browser.

## Monorepo layout

```
.
├── apps
│   ├── web              # React + Vite frontend
│   └── api              # Fastify backend (proxies OpenAI)
├── packages
│   └── shared           # Types shared by web + api
├── pnpm-workspace.yaml
├── package.json         # root scripts (dev/build/typecheck across workspaces)
└── vercel.json
```

pnpm workspaces. Cross-package imports go through `@hrtech/shared` so
both apps reference the same `GenerateInput` / `HealthResponse` types.

## Stack

**Web (`apps/web`)**

- React 19 + TypeScript (strict, `verbatimModuleSyntax`)
- Vite 8 (dev proxy forwards `/api/*` to the API)
- React Router 7 (`/`, `/new`, `/applications/:id`)
- Jotai (`atomWithStorage` for the persisted application list, action atoms for create/update/remove)
- react-hook-form + Zod (`@hookform/resolvers/zod`) — schema is the single source of truth
- CSS Modules + design-token layer; `@custom-media` breakpoints via `postcss-custom-media` + `@csstools/postcss-global-data`
- `@iconify/react` icons (Carbon + Streamline collections, type-constrained to `carbon:* | streamline:*`)
- `classnames` for dynamic class composition
- Fixel font (MacPaw, SIL OFL 1.1) bundled locally
- [Storybook](https://hrtech-storybook.sliplane.app/) 10 (`@storybook/react-vite`) with one story per shared component

**API (`apps/api`)**

- Fastify 5 + `@fastify/cors`
- `@fastify/swagger` + `@fastify/swagger-ui` (OpenAPI 3.0 + Swagger UI auto-generated from route schemas)
- TypeScript with `tsx` for dev (`tsc` for prod build)
- No DB; streams upstream OpenAI SSE through to the client
- Built-in mock when `OPENAI_API_KEY` is unset

## Run it locally

### Prerequisites

- **Node 20.19+ or 22.12+** (Vite 8 + Storybook 10 require it). A
  `.nvmrc` pins Node 22 — `nvm use` in the repo root picks it up.
- **pnpm 9.4+** (the workspace is configured for it; Corepack works:
  `corepack enable && corepack prepare pnpm@9.4.0 --activate`).

### One-command setup

```bash
nvm use                                   # uses .nvmrc → Node 22
pnpm install                              # installs every workspace
cp apps/api/.env.example apps/api/.env    # optional — mock fallback works without
echo 'OPENAI_API_KEY=sk-...' >> apps/api/.env

pnpm dev                                  # boots web + api in parallel
```

| URL                                  | What                           |
| ------------------------------------ | ------------------------------ |
| <http://localhost:5173>              | Web app (Vite dev server, HMR) |
| <http://localhost:3001/api/health>   | API health                     |
| <http://localhost:3001/api/generate> | API streaming endpoint         |
| <http://localhost:3001/docs>         | Swagger UI (auto-generated)    |
| <http://localhost:3001/docs/json>    | OpenAPI 3.0 spec               |

### Other scripts

```bash
# run apps individually
pnpm dev:web
pnpm dev:api

# storybook (one story per shared component, hosted at https://hrtech-storybook.sliplane.app/)
pnpm --filter @hrtech/web run storybook        # → http://localhost:6006

# checks
pnpm typecheck                                  # all workspaces
pnpm build                                      # builds web + api

# preview the built web bundle
pnpm preview
```

### Without an OpenAI key

The app is fully usable without `OPENAI_API_KEY`. The api detects the
empty key on boot and serves a deterministic mock cover letter using
the same OpenAI-format SSE shape, so the streaming UI behaves
identically. `GET /api/health` returns `aiConfigured: false`, which the
generator screen surfaces as a small "using a mock generator" hint in
the empty state.

## Run it via Docker (shortcut)

If you'd rather skip the Node/pnpm install, the same prod images that
run on Sliplane will run locally. Start one container per app:

```bash
# 1) API container — Fastify + Swagger UI on :3001
docker build -f apps/api/Dockerfile -t hrtech-api .
docker run --rm -p 3001:3001 \
  -e OPENAI_API_KEY=sk-... \
  -e CORS_ORIGIN=http://localhost:8080 \
  hrtech-api

# 2) Web container — static React bundle on :8080
#    (in another terminal, with the api still running)
docker build \
  --build-arg VITE_API_URL=http://localhost:3001 \
  -f apps/web/Dockerfile -t hrtech-web .
docker run --rm -p 8080:80 hrtech-web

# 3) Storybook container — optional, on :6006
#    (live version at https://hrtech-storybook.sliplane.app/)
docker build -f apps/web/Dockerfile.storybook -t hrtech-storybook .
docker run --rm -p 6006:80 hrtech-storybook
```

## Services:

| URL                             | What                                        |
| ------------------------------- | ------------------------------------------- |
| <http://localhost:8080>         | Web app (production build, served by nginx) |
| <http://localhost:3001/api/...> | API                                         |
| <http://localhost:3001/docs>    | Swagger UI (lives inside the api container) |
| <http://localhost:6006>         | Storybook                                   |

`OPENAI_API_KEY` can be omitted — the api falls back to the mock as
in dev. `VITE_API_URL` is **build-time** for the web image (Vite
inlines it into the JS bundle), so changing it requires a rebuild of
the web image. `CORS_ORIGIN` is runtime on the api side.

## Production via Docker

Two **independent** Dockerfiles, one per app. There's no compose
orchestration — each container is built and run on its own and they
talk to each other over the public URL (cross-origin), which matches
how PaaS platforms like Coolify, Railway, Fly, App Platform, etc.
deploy each component separately.

```
browser ──▶ nginx (web, static React bundle on its own URL)
                │
                └─ JS bundle has VITE_API_URL baked in
                                    │
                                    ▼
                          fastify (api, on its own URL) ──▶ OpenAI
                                    │
                                    └─ CORS_ORIGIN allows the web URL
```

- **api** image: multi-stage `pnpm install → tsc → pnpm deploy --prod`
  onto `node:22-alpine`. ~169 MB, runs as `node`, listens on the port
  in `$PORT` (default 3001).
- **web** image: multi-stage `pnpm install → vite build` then static
  files into `nginx:1.27-alpine`. ~50 MB. nginx serves the SPA with
  the React-Router fallback and long-cache headers on `/assets/` and
  `/fonts/`. **No `/api` proxy** — the bundle calls the API directly
  via `VITE_API_URL`.

Build context is the monorepo root in both cases (pnpm-lock and the
`packages/shared` workspace are needed inside the build). The exact
build/run commands are in the [Run it via Docker (shortcut)](#run-it-via-docker-shortcut)
section above; what follows is the deeper context.

The **Swagger UI ships with the api container itself**, on the same
port as the routes — no extra service to run. With the `hrtech-api`
container up: <http://localhost:3001/docs> (UI), `/docs/json` (spec),
`/docs/yaml` (spec). Same Fastify process that serves `/api/*`, so
deploying the api anywhere automatically deploys its docs. Would be disabled for real production environment.

### Notes

- **`VITE_API_URL` is build-time.** Vite inlines `import.meta.env.*`
  into the JS at build, so it reaches the bundle through `--build-arg`.
  Setting it on `docker run` is a no-op. To change which API the web
  bundle talks to, rebuild the web image.
- **`CORS_ORIGIN` is runtime.** Pass it via `-e` on the api container.
  Comma-separated for multiple origins (`https://example.com,https://staging.example.com`).
- **No key → mock fallback.** If `OPENAI_API_KEY` is unset, the api
  streams a deterministic mock letter using the same SSE format. The
  web's `/api/health` hint surfaces this.
- **PaaS-friendly.** Each Dockerfile expects nothing from the other —
  drop them into separate components on Coolify/Railway/Fly/App
  Platform, set `VITE_API_URL` as a build arg on web and
  `OPENAI_API_KEY` + `CORS_ORIGIN` as runtime env on api, done.
- **`.dockerignore`** excludes `node_modules`, `dist`, `.env*` (except
  `.env.example`), `.git`, IDE folders — keeps build contexts small
  and secrets out of image layers.

## How the apps talk to each other

```
browser ──fetch /api/generate──▶ Vite dev proxy ──▶ Fastify ──▶ OpenAI
                                       │                │
                                       │                └──▶ mock streamer
                                       └─ in prod: same origin or
                                          VITE_API_URL override
```

- **Wire format.** The API forwards OpenAI's SSE response intact. The
  mock streamer emits the same shape (`data: {"choices":[{"delta":{"content":"..."}}]}`)
  so the web's parser doesn't care which mode the backend is in.
- **Cancellation.** The frontend wraps each generation in an
  `AbortController`; on the API side, `reply.raw`'s `'close'` event
  cancels the upstream OpenAI request when the client disconnects. No
  paying for tokens nobody reads.
- **Health endpoint.** `GET /api/health` returns
  `{ ok, aiConfigured, model }`. The web reads this once per page load
  and shows a hint in the empty state if the backend is in mock or
  offline mode.

## Decision log

> **Up front: localStorage was a deliberate scope choice.** I'm aware
> of the limits — synchronous API, ~5–10 MB per origin, string-only
> values, no transactions, no querying. IndexedDB solves all of that,
> but I didn't reach for it because in a real product neither would be
> the answer: this data belongs in a backend (auth, multi-device sync,
> audit trail, deletion). For a test assignment with at-most-five
> records that need to survive a reload in one browser, a single
> localStorage key is the right amount of code. Swapping the storage
> backend out later is a one-file change behind the Jotai action atoms
> (`shared/store/applications.ts`), so this isn't a wall, it's a
> deliberately small footprint.

### Architecture

**Backend exists for one reason: hide the OpenAI key.** A browser-only
setup put `VITE_OPENAI_API_KEY` in the bundle; anyone with devtools
could lift it. The Fastify proxy is intentionally minimal (two routes

`Yes, Next.js would’ve handled this way more easily, I know. But there weren’t any specific stack requirements, so I went with the one I wanted to practice a bit more. I’ve done way too much Next.js in the last few years`

- a health check + auto-generated docs), so it's a small surface to
  host and reason about.

**Monorepo (pnpm workspaces).** `apps/web` + `apps/api` +
`packages/shared`. Workspaces let both apps consume the same
`GenerateInput` / `HealthResponse` types from `@hrtech/shared` without
a build step (the package's `main` points at `src/index.ts`; both
`vite` and `tsx` resolve through it).

**`apps/web/src/shared/`** holds everything cross-cutting, sub-foldered
by concern: `components/<Name>/` (each with `.tsx` + `.module.css` +
`index.ts`), `hooks/`, `store/`, `scheme/` (Zod), `api/` (typed API
client), `types/`, `constants/`, `utils/`. Pages stay at `pages/`,
app-shell + global styles at the root. The constraint is that anything
importable across features lives in `shared/`.

**Backend mirrors the same split.** `routes/{health,generate}.ts` are
Fastify plugins (each takes options, registers one route);
`utils/{prompt,openai,mock}.ts` are pure helpers with no Fastify
imports. `server.ts` is just bootstrap.

### State, persistence, forms

**Jotai for client state.** I started with a hand-rolled
`useSyncExternalStore` and moved to `atomWithStorage` because it folds
the storage adapter, cross-tab `storage` event sync, and SSR safety
into one primitive. A custom storage object wraps `localStorage` with
schema validation (`isApplication`) so corrupt or partial entries get
dropped on read instead of crashing the UI. Action atoms
(`createApplicationAtom`, `updateApplicationAtom`,
`removeApplicationAtom`) keep id/timestamp invariants in one place.

**Persistence key is versioned** (`hrtech.applications.v1`) so a
future schema change can break cleanly without trying to migrate.

**Forms: react-hook-form + Zod via `@hookform/resolvers`.** The schema
in `shared/scheme/application.ts` is the single source of truth for
shape and limits; `FormValues = z.infer<typeof schema>`. `mode:
'onChange'` means the submit button state, the field error rings, and
the textarea counter color all update as the user types. Field caps
live in `shared/constants/form.ts` so the schema, the soft-cap UI, and
the API's body schema all read from one place.

**Soft-capped textarea.** The 1200-char `details` field doesn't enforce
`maxLength` on the HTML element — the user can type past it. Once
over, the counter goes red, the border tints `--color-danger`
(`aria-invalid` set), and Zod blocks the submit. Better UX than
silently truncating mid-keystroke.

**Generator save semantics.** The form persists a record on the
_first_ successful generation and updates that same record on
subsequent "Try Again" clicks. A user who tweaks the form and
re-generates ends up with one application, not five drafts. Cards on
the dashboard are clickable: navigating to `/applications/:id`
re-opens the same record (form pre-filled, letter visible) so "Try
Again" updates that one row instead of creating a new one.

### API layer

**Typed entrypoint on the web side.** `shared/api/` exposes one
object: `import { api } from '@/shared/api'` then `api.generateLetter(...)`
or `api.getHealth(...)`. New endpoints get a sibling file; the index
composes them. Consumers never touch `fetch` directly — the SSE parser
and base URL handling stay in one place.

**Wire format.** The API forwards OpenAI's SSE response intact rather
than re-encoding. The mock streamer emits the same shape, so the
frontend's parser is one tiny function that doesn't care which mode
the backend is in.

**Cancellation.** Frontend wraps each generation in `AbortController`;
on the server, `reply.raw.on('close')` cancels the upstream OpenAI
fetch when the client disconnects. We don't pay for tokens nobody
reads. The first cut listened for the request stream's `'close'` event
instead — that fires when Fastify finishes reading the request body,
not when the client tears down, so it aborted upstream too early.

**Streaming through `reply.send(Readable.fromWeb(...))`, not
`reply.raw`.** Writing directly to `reply.raw` bypasses Fastify's
hooks — `@fastify/cors`'s `onSend` hook never ran on the streaming
response, and CORS headers were missing for the cross-origin POST.
Switching to the regular reply pipeline fixed it; the `Readable` is
piped lazily so streaming behaviour is unchanged.

**Auto-generated Swagger UI at `/docs`.** Same Fastify, same port —
deploying the api anywhere automatically deploys its docs. The
OpenAPI doc deliberately has **no `servers`** field, so Swagger UI
targets `window.location.origin` for "Try it out". An explicit
`localhost:3001` entry would have been blocked in production by the
strict CSP that `staticCSP: true` installs.

### Design system & components

**No UI kit.** The brief explicitly calls out "systematizing components
and styles" as part of the assessment. CSS Modules + design tokens
(`tokens.css`) over Tailwind (per the brief) and over CSS-in-JS (no
runtime cost; build output is one stylesheet). Eighteen UI components,
one folder each, all arrow functions; `forwardRef` wrappers carry
explicit `displayName` so React DevTools labels stay readable.

**Iconify for everything pictographic.** `@iconify/react`, names
type-constrained to `` `carbon:${string}` | `streamline:${string}` ``
via a template-literal type. Sizes restricted to `12 | 14 | 16 | 18 |
24` so the design system doesn't drift. Lazy fetch + localStorage
cache. **No inline SVGs anywhere in source** — the brand mark moved
to a static `/logo-mark.svg` rendered via `<img>`, and the spinner is
`svg-spinners:bars-rotate-fade` from a separate Iconify collection.

**Breakpoints centralized.** `shared/styles/breakpoints.css` defines
`--bp-*` runtime variables and `@custom-media` macros (`--mobile`
≤480, `--tablet-down` ≤720, `--laptop-down` ≤1024, `--desktop-down`
≤1280, plus `--reduce-motion`, `--dark`, etc.). The PostCSS pipeline
is `@csstools/postcss-global-data` (loads breakpoints.css globally)
→ `postcss-custom-media` (expands the macros). Every `@media` rule
in the codebase reads from those names; raw `(max-width: …)` is
banned outside the one source file.

**`<Grid>` primitive.** Customizable `as`, `columns`, `collapse`
breakpoint, and `gap` token. Used by the dashboard list and ready for
any future card grid. Replaces the bespoke grid CSS that lived inside
DashboardPage.

**`<Confirm>` system.** `<ConfirmProvider>` mounted at app root,
`useConfirm()` returns a `(opts) => Promise<boolean>` function. Backed
by the native `<dialog>` element for free focus-trap, Esc handling,
`aria-modal`, and inert background. Destructive variant defaults focus
to Cancel so an accidental Enter doesn't delete data. Replaced
`window.confirm` site-wide.

**`classnames` lib for class composition.** Object form for boolean
toggles (`{ [styles.error]: hasError }`), bare strings for static.
Replaced the array `.filter(Boolean).join(' ')` idiom that had grown
across the primitives.

**Mobile.** dashboard collapses to
one column at `--tablet-down` (≤720), generator stacks at
`--laptop-down` (≤1024), form row stacks at `--mobile` (≤480), header
progress label hides at `--mobile`. Slight shifts from the original
hand-tuned numbers, in exchange for a system anyone reading the code
can predict.

### Operations & DevOps

**Three independent Dockerfiles, no compose.** `apps/api/Dockerfile`,
`apps/web/Dockerfile`, `apps/web/Dockerfile.storybook`. Every PaaS
worth deploying to (Coolify, Sliplane, Railway, Fly, App Platform)
runs components separately, so designing for an orchestration that
won't match production is wasted effort. **Cross-origin model**: the
web bundle has `VITE_API_URL` baked in at build, the api has
`CORS_ORIGIN` set at runtime; `@fastify/cors` annotates responses
accordingly. SSE works through this without a hitch.

**Image shapes.** Web and Storybook images are
`nginx:1.27-alpine` serving the static Vite output (SPA fallback +
long-cache `/assets/`). The api uses `pnpm deploy --prod` to produce
a self-contained directory and runs on `node:22-alpine` as the `node`
user. Healthchecks `wget` against `127.0.0.1` (alpine's `localhost`
resolves to `::1` IPv6, which Fastify isn't listening on; the IPv4
literal is required).

**Storybook colocated, served separately.** Stories live next to
their component (`<Name>.stories.tsx`); 19 stories total, organized
into `UI/`, `Layout/`, `App/` sidebar sections. A global decorator
wraps every story in `MemoryRouter + ConfirmProvider +
EmojiExplosionProvider`, so any component-under-test that uses those
hooks just works. Live at <https://hrtech-storybook.sliplane.app/>.

**Custom favicon.** A green chip carrying the same wavy stack as the
in-app logo, so pinned tabs telegraph the same identity.

### Accessibility

Inputs are labelled. The home button has an `aria-label`. The progress
dots expose `"3 of 5 completed"`. Focus states use a visible focus
ring; the streaming caret and the emoji rain are `aria-hidden`. The
confirm modal trap-focuses, returns focus to the trigger on close, and
defaults focus to Cancel for destructive actions. Generate is disabled
until the required fields (job title, company) pass Zod.
