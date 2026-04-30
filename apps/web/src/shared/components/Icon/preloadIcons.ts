import { loadIcons } from '@iconify/react';

/**
 * Lazy-loaded icons with persistent cache.
 *
 * Strategy:
 * - First-ever load: `loadIcons()` triggers a single batched fetch
 *   from api.iconify.design for every icon listed below, and
 *   @iconify/react writes the result to `localStorage` (its default
 *   cache backend). The first paint of any icon flashes once while
 *   waiting for that fetch.
 * - Every subsequent load: @iconify/react re-hydrates the in-memory
 *   store synchronously from `localStorage` at module-init time. By
 *   the time React's first render runs, every icon listed below is
 *   already resolvable in-memory, so no flash.
 *
 * Calling `loadIcons` at boot amortises the fetch — one request for
 * the whole set — instead of letting each `<Icon>` component fire
 * its own request on mount.
 */

const ICONS_USED = [
  'carbon:add',
  'carbon:arrow-up-right',
  'carbon:checkmark',
  'carbon:copy',
  'carbon:home',
  'carbon:renew',
  'carbon:trash-can',
  'svg-spinners:bars-rotate-fade',
];

loadIcons(ICONS_USED);
