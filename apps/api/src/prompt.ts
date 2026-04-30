import type { GenerateInput } from '@hrtech/shared';

export const SYSTEM_PROMPT = `You are an expert career coach who writes
concise, warm, and specific cover letters for job applications. Output a
complete cover letter in plain text — no markdown, no subject line, no
headings. Always start with "Dear <Company> Team," on its own line. Keep
it under 200 words. Use short paragraphs separated by blank lines. Avoid
clichés ("dynamic", "passionate"). Reference the candidate's strengths
concretely.`;

export const userPrompt = ({
  jobTitle,
  company,
  strengths,
  details,
}: GenerateInput): string =>
  [
    `Job title: ${jobTitle.trim() || '(unspecified)'}`,
    `Company: ${company.trim() || '(unspecified)'}`,
    `Candidate's strengths: ${strengths.trim() || '(unspecified)'}`,
    `Additional details from the candidate: ${details.trim() || '(none)'}`,
    '',
    'Write the cover letter now.',
  ].join('\n');
