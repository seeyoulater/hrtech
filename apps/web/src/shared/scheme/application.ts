import { z } from 'zod';
import {
  COMPANY_MAX,
  DETAILS_MAX,
  STRENGTHS_MAX,
  TITLE_MAX,
} from '@/shared/constants/form';

/**
 * Validation schema for the application form. Field caps come from
 * `@/shared/constants/form` so the form, the schema, and the UI counter all
 * read from the same numbers.
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
  strengths: z.string().max(STRENGTHS_MAX, `Maximum ${STRENGTHS_MAX} characters`),
  details: z.string().max(DETAILS_MAX, `Maximum ${DETAILS_MAX} characters`),
});

export type FormValues = z.infer<typeof applicationSchema>;
