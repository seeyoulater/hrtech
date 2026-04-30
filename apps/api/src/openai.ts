import type { GenerateInput } from '@hrtech/shared';
import { SYSTEM_PROMPT, userPrompt } from './prompt.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export type OpenAiConfig = {
  apiKey: string;
  model: string;
};

export async function openOpenAiStream(
  input: GenerateInput,
  config: OpenAiConfig,
  signal: AbortSignal,
): Promise<{ status: number; body: ReadableStream<Uint8Array> | null; ok: boolean; statusText: string }> {
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      stream: true,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt(input) },
      ],
    }),
  });

  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: response.body,
  };
}
