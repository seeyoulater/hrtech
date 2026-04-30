import { z } from 'zod';

export const TITLE_MAX = 200;
export const COMPANY_MAX = 200;
export const STRENGTHS_MAX = 1000;
export const DETAILS_MAX = 1200;

/**
 * Validation schema for the application form. Same shape and limits
 * as the API's body schema in apps/api/src/server.ts — keep them in
 * sync, or eventually move this file into @hrtech/shared and consume
 * from both ends.
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
  details: z
    .string()
    .max(DETAILS_MAX, `Maximum ${DETAILS_MAX} characters`),
});

export type FormValues = z.infer<typeof applicationSchema>;

export const EMPTY_FORM: FormValues = {
  jobTitle: '',
  company: '',
  strengths: '',
  details: '',
};
