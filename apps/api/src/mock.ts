import type { GenerateInput } from '@hrtech/shared';

/**
 * Streams a deterministic mock letter as OpenAI-format SSE so the
 * frontend's parser can treat real and mock responses identically.
 */
export function mockOpenAiSseStream(
  input: GenerateInput,
  signal: AbortSignal,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const text = mockLetter(input);
  const tokens = text.match(/\s+|\S+/g) ?? [];

  return new ReadableStream({
    async start(controller) {
      const encode = (delta: string) =>
        `data: ${JSON.stringify({
          choices: [{ delta: { content: delta }, finish_reason: null }],
        })}\n\n`;

      for (const token of tokens) {
        if (signal.aborted) {
          controller.close();
          return;
        }
        await delay(15 + Math.random() * 35);
        controller.enqueue(encoder.encode(encode(token)));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function mockLetter({
  jobTitle,
  company,
  strengths,
  details,
}: GenerateInput): string {
  const co = company.trim() || 'your';
  const role = jobTitle.trim() || 'this role';
  const strong = strengths.trim() || 'building reliable, user-focused software';
  const extra = details.trim();

  const paragraphs = [
    `Dear ${co} Team,`,
    `I am writing to express my interest in the ${role} position. The work your team is doing resonates with the kind of problems I love solving, and I would welcome the chance to contribute.`,
    `My experience is rooted in ${strong}. I focus on shipping work that holds up in production and on collaborating closely with designers, PMs, and engineers to make the right tradeoffs.`,
    extra
      ? `A bit more context: ${extra}`
      : `I bring a bias toward clear thinking, fast iteration, and tight feedback loops with users.`,
    `I would be glad to discuss how I can support ${co}'s next chapter. Thank you for your time and consideration.`,
  ];
  return paragraphs.join('\n\n');
}
