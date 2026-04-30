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

const isApplication = (v: unknown): v is Application => {
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

export function loadApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isApplication);
  } catch {
    return [];
  }
}

export function saveApplications(apps: Application[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}
