import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { STORAGE_KEY } from '@/shared/constants/application';
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '@/shared/types/application';
import { isApplication } from '@/shared/utils/validators';

/**
 * Custom Jotai storage that wraps `localStorage` with:
 * - schema validation on read (corrupt or partial entries are dropped),
 * - cross-tab sync via the `storage` event,
 * - SSR safety (no-ops on the server).
 */
const applicationsStorage = {
  getItem(key: string, initialValue: Application[]): Application[] {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initialValue;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return initialValue;
      return parsed.filter(isApplication);
    } catch {
      return initialValue;
    }
  },
  setItem(key: string, value: Application[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
  subscribe(
    key: string,
    callback: (value: Application[]) => void,
    initialValue: Application[],
  ): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null;
        callback(
          Array.isArray(parsed) ? parsed.filter(isApplication) : initialValue,
        );
      } catch {
        callback(initialValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
};

/** Source of truth: a Jotai atom backed by localStorage. */
export const applicationsAtom = atomWithStorage<Application[]>(
  STORAGE_KEY,
  [],
  applicationsStorage,
);

/** Action atom: create. Returns the new record (with id + timestamps). */
export const createApplicationAtom = atom(
  null,
  (get, set, input: CreateApplicationInput): Application => {
    const now = Date.now();
    const next: Application = {
      ...input,
      id: nanoid(10),
      createdAt: now,
      updatedAt: now,
    };
    set(applicationsAtom, [next, ...get(applicationsAtom)]);
    return next;
  },
);

/** Action atom: update. */
export const updateApplicationAtom = atom(
  null,
  (get, set, { id, patch }: UpdateApplicationInput): void => {
    set(
      applicationsAtom,
      get(applicationsAtom).map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a,
      ),
    );
  },
);

/** Action atom: remove. */
export const removeApplicationAtom = atom(
  null,
  (get, set, id: string): void => {
    set(
      applicationsAtom,
      get(applicationsAtom).filter((a) => a.id !== id),
    );
  },
);
