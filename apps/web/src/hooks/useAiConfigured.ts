import { useEffect, useState } from 'react';
import type { HealthResponse } from '@hrtech/shared';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

type Status = 'unknown' | 'live' | 'mock' | 'offline';

let cached: Status = 'unknown';
let inflight: Promise<Status> | null = null;

const probe = async (): Promise<Status> => {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) return 'offline';
    const data = (await res.json()) as HealthResponse;
    return data.aiConfigured ? 'live' : 'mock';
  } catch {
    return 'offline';
  }
};

/**
 * Reads /api/health once per page load and tells the UI whether the
 * backend is calling OpenAI for real or returning a mock — useful for
 * the empty-state hint on the generator screen.
 */
export function useAiConfigured(): Status {
  const [status, setStatus] = useState<Status>(cached);

  useEffect(() => {
    if (cached !== 'unknown') return;
    if (!inflight) inflight = probe();
    let cancelled = false;
    inflight.then((next) => {
      cached = next;
      inflight = null;
      if (!cancelled) setStatus(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
