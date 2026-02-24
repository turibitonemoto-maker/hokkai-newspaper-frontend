'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating a concise summary of an article.
 *
 * - generateArticleSummary - A function that handles the article summary generation process.
 * - GenerateArticleSummaryInput - The input type for the generateArticleSummary function.
 * - GenerateArticleSummaryOutput - The return type for the generateArticleSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleSummaryInputSchema = z.object({
  articleContent: z.string().describe('The full content of the article to be summarized.'),
});
export type GenerateArticleSummaryInput = z.infer<typeof GenerateArticleSummaryInputSchema>;

const GenerateArticleSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article.'),
});
export type GenerateArticleSummaryOutput = z.infer<typeof GenerateArticleSummaryOutputSchema>;

export async function generateArticleSummary(
  input: GenerateArticleSummaryInput
): Promise<GenerateArticleSummaryOutput> {
  return generateArticleSummaryFlow(input);
}

const generateArticleSummaryPrompt = ai.definePrompt({
  name: 'generateArticleSummaryPrompt',
  input: {schema: GenerateArticleSummaryInputSchema},
  output: {schema: GenerateArticleSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing news articles. Read the following article content and provide a concise, factual summary that captures the main points. The summary should be easy to understand and brief, ideally under 100 words.

Article Content: {{{articleContent}}}`,
});

const generateArticleSummaryFlow = ai.defineFlow(
  {
    name: 'generateArticleSummaryFlow',
    inputSchema: GenerateArticleSummaryInputSchema,
    outputSchema: GenerateArticleSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateArticleSummaryPrompt(input);
    return output!;
  }
);
