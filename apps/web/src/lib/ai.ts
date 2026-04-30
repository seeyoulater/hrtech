import type { GenerateInput } from '@hrtech/shared';

export type StreamHandlers = {
  onToken: (chunk: string) => void;
  signal?: AbortSignal;
};

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

/**
 * Calls the backend's /api/generate endpoint, which proxies OpenAI and
 * keeps the API key server-side. The response is OpenAI-format SSE,
 * whether the backend is talking to OpenAI or returning a mock — the
 * parser doesn't care.
 */
export async function generateLetter(
  input: GenerateInput,
  { onToken, signal }: StreamHandlers,
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `Generate failed (${response.status}): ${text || response.statusText}`,
    );
  }

  return readSseStream(response.body, onToken, signal);
}

async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onToken: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  while (true) {
    if (signal?.aborted) {
      reader.cancel().catch(() => {});
      throw new DOMException('Aborted', 'AbortError');
    }
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return full;
      try {
        const json = JSON.parse(payload);
        const delta: string | undefined = json?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onToken(delta);
        }
      } catch {
        // ignore partial frames
      }
    }
  }
  return full;
}
