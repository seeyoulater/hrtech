/* Schema lives in `@hrtech/shared` so the web form and the api body
   validator run the exact same Zod object. Re-exported here so
   `@/shared/scheme` import paths keep working. */
export { applicationSchema, type FormValues } from '@hrtech/shared';
