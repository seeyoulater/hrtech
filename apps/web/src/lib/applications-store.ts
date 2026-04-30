import { nanoid } from 'nanoid';
import {
  loadApplications,
  saveApplications,
  STORAGE_KEY,
  type Application,
} from './applications';

type Listener = () => void;

let state: Application[] = loadApplications();
const listeners = new Set<Listener>();

const emit = () => {
  for (const l of listeners) l();
};

const setState = (next: Application[]) => {
  state = next;
  saveApplications(state);
  emit();
};

export const applicationsStore = {
  getSnapshot(): Application[] {
    return state;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  create(input: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application {
    const now = Date.now();
    const next: Application = {
      ...input,
      id: nanoid(10),
      createdAt: now,
      updatedAt: now,
    };
    setState([next, ...state]);
    return next;
  },
  update(id: string, patch: Partial<Omit<Application, 'id' | 'createdAt'>>): void {
    setState(
      state.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a,
      ),
    );
  },
  remove(id: string): void {
    setState(state.filter((a) => a.id !== id));
  },
  /** Replace from another tab — called by storage event listener. */
  hydrateFromStorage(): void {
    state = loadApplications();
    emit();
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      applicationsStore.hydrateFromStorage();
    }
  });
}
