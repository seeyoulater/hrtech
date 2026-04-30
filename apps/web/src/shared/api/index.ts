import { generateLetter } from './letters';
import { getHealth } from './health';

/**
 * Single typed entrypoint for backend calls. Add new endpoints here
 * (and back them with a sibling file under `shared/api/`).
 *
 * ```ts
 * import { api } from '@/shared/api';
 * await api.generateLetter(input, { onToken });
 * await api.getHealth();
 * ```
 */
export const api = {
  generateLetter,
  getHealth,
} as const;

export type { StreamHandlers } from '@/shared/types/api';
export type { GenerateInput, HealthResponse } from '@hrtech/shared';
