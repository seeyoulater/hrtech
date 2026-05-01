/* Field length caps live in `@hrtech/shared` alongside the Zod schema
   that enforces them, so the web counter, the schema's `.max()`, and
   the API's body validator all read from one place. Re-exported here
   so existing `@/shared/constants/form` import paths keep working. */
export {
  TITLE_MAX,
  COMPANY_MAX,
  STRENGTHS_MAX,
  DETAILS_MAX,
} from '@hrtech/shared';

/** Initial form state. Inferred shape matches FormValues structurally. */
export const EMPTY_FORM = {
  jobTitle: '',
  company: '',
  strengths: '',
  details: '',
};
