/**
 * Shared types between the web app and the API.
 * Importing TS sources directly works because both ends use bundler
 * module resolution (Vite for web, tsx for api dev, tsc for api build).
 */

export type GenerateInput = {
  jobTitle: string;
  company: string;
  strengths: string;
  details: string;
};

export type GenerateError = {
  error: string;
};

export type HealthResponse = {
  ok: true;
  aiConfigured: boolean;
  model: string;
};
