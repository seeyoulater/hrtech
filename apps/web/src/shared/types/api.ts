/** Streaming handlers for `api.generateLetter`. */
export type StreamHandlers = {
  onToken: (chunk: string) => void;
  signal?: AbortSignal;
};
