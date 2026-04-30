import type { Application } from '@/shared/types/application';

/**
 * Type-guard for the persisted Application shape. Used when reading
 * untrusted input (localStorage, cross-tab `storage` event payloads)
 * to drop any partial or malformed records.
 */
export const isApplication = (v: unknown): v is Application => {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.jobTitle === 'string' &&
    typeof a.company === 'string' &&
    typeof a.strengths === 'string' &&
    typeof a.details === 'string' &&
    typeof a.letter === 'string' &&
    typeof a.createdAt === 'number' &&
    typeof a.updatedAt === 'number'
  );
};
