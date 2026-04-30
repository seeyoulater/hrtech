/**
 * Base URL prefix for all API requests. Empty in dev (Vite proxies
 * `/api/*` to the backend) and in production same-origin deploys; set
 * `VITE_API_URL` at build time to point the bundle at a different host.
 */
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? '';
