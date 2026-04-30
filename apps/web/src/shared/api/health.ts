import type { HealthResponse } from '@hrtech/shared';
import { API_BASE } from '@/constants/api';

/**
 * GET /api/health — reports backend status: whether OpenAI credentials
 * are configured and which model is in use. Used for the empty-state
 * hint on the generator screen.
 */
export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/api/health`, { signal });
  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`);
  }
  return response.json() as Promise<HealthResponse>;
}
