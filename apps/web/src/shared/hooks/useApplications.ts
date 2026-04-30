import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  applicationsAtom,
  createApplicationAtom,
  removeApplicationAtom,
  updateApplicationAtom,
} from '@/shared/store';
import type {
  Application,
  CreateApplicationInput,
} from '@/shared/types/application';

/**
 * Stable hook for the applications collection. Reads via `useAtomValue`
 * (subscribes to the atom; component re-renders on change) and exposes
 * memoised action functions so callers don't pay for new identities on
 * every render.
 */
export function useApplications() {
  const applications = useAtomValue(applicationsAtom);
  const createAction = useSetAtom(createApplicationAtom);
  const updateAction = useSetAtom(updateApplicationAtom);
  const removeAction = useSetAtom(removeApplicationAtom);

  const create = useCallback(
    (input: CreateApplicationInput): Application => createAction(input),
    [createAction],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<Application, 'id' | 'createdAt'>>): void =>
      updateAction({ id, patch }),
    [updateAction],
  );

  const remove = useCallback(
    (id: string): void => removeAction(id),
    [removeAction],
  );

  return { applications, create, update, remove };
}
