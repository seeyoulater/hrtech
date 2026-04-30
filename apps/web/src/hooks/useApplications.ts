import { useSyncExternalStore } from 'react';
import { applicationsStore } from '@/lib/applications-store';

export function useApplications() {
  const apps = useSyncExternalStore(
    applicationsStore.subscribe,
    applicationsStore.getSnapshot,
    applicationsStore.getSnapshot,
  );
  return {
    applications: apps,
    create: applicationsStore.create,
    update: applicationsStore.update,
    remove: applicationsStore.remove,
  };
}
