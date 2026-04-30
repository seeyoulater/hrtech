/** A persisted cover-letter application. */
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

/** Input for `createApplication` — the store fills in id + timestamps. */
export type CreateApplicationInput = Omit<
  Application,
  'id' | 'createdAt' | 'updatedAt'
>;

/** Input for `updateApplication` — partial patch by id. */
export type UpdateApplicationInput = {
  id: string;
  patch: Partial<Omit<Application, 'id' | 'createdAt'>>;
};
