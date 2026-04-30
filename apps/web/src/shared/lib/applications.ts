export type Application = {
  id: string;
  jobTitle: string;
  company: string;
  strengths: string;
  details: string;
  letter: string;
  createdAt: number;
  updatedAt: number;
};

export const GOAL = 5;
export const STORAGE_KEY = 'hrtech.applications.v1';

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
