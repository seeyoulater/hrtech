/* Field length caps. Mirrored in apps/api/src/server.ts — keep them
   in sync (eventually move into @hrtech/shared and consume both sides). */
export const TITLE_MAX = 200;
export const COMPANY_MAX = 200;
export const STRENGTHS_MAX = 1000;
export const DETAILS_MAX = 1200;

/** Initial form state. Inferred shape matches FormValues structurally. */
export const EMPTY_FORM = {
  jobTitle: '',
  company: '',
  strengths: '',
  details: '',
};
