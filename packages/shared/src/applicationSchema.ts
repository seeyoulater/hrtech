import { z } from 'zod';

/**
 * Field length caps. Mirrored on both web and api because both
 * import this same module — the Zod schema below is the single
 * source of truth and these constants are exported alongside it for
 * UI counters and form-state defaults.
 */
export const TITLE_MAX = 100;
export const COMPANY_MAX = 100;
export const STRENGTHS_MAX = 500;
export const DETAILS_MAX = 1200;

/**
 * Validation schema for the application form.
 *
 * Used by:
 * - Web: `react-hook-form` resolver → real-time field errors and
 *   button disable state.
 * - API: `fastify-type-provider-zod` → request body validation +
 *   automatic OpenAPI doc generation for `/api/generate`.
 *
 * Both ends import from `@hrtech/shared` and run the exact same
 * validator, so any limit/error change is one edit.
 */
export const applicationSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(1, 'Job title is required')
    .max(TITLE_MAX, `Maximum ${TITLE_MAX} characters`),
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(COMPANY_MAX, `Maximum ${COMPANY_MAX} characters`),
  strengths: z
    .string()
    .max(STRENGTHS_MAX, `Maximum ${STRENGTHS_MAX} characters`),
  details: z.string().max(DETAILS_MAX, `Maximum ${DETAILS_MAX} characters`),
});

export type FormValues = z.infer<typeof applicationSchema>;
