/**
 * Re-export of the Zod-inferred form shape. The schema in
 * `shared/scheme/application.ts` is the single source of truth;
 * this alias lives here so consumers can import all shared types
 * from one folder.
 */
export type { FormValues } from '@/shared/scheme/application';
