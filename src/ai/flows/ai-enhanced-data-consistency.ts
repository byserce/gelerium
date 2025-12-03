'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-enhanced data consistency.
 *
 * The flow uses AI to determine if changes in scraped car listing data represent
 * meaningful updates or just website glitches, avoiding false positives.
 *
 * @exports aiEnhancedDataConsistency - The main function to check data consistency.
 * @exports AiEnhancedDataConsistencyInput - The input type for the function.
 * @exports AiEnhancedDataConsistencyOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEnhancedDataConsistencyInputSchema = z.object({
  currentData: z.string().describe('The current car listing data from the database.'),
  newData: z.string().describe('The newly scraped car listing data.'),
});

export type AiEnhancedDataConsistencyInput = z.infer<typeof AiEnhancedDataConsistencyInputSchema>;

const AiEnhancedDataConsistencyOutputSchema = z.object({
  shouldUpdate: z.boolean().describe('Whether the data should be updated in the database.'),
  reason: z.string().describe('The reason for the decision.'),
});

export type AiEnhancedDataConsistencyOutput = z.infer<typeof AiEnhancedDataConsistencyOutputSchema>;

export async function aiEnhancedDataConsistency(input: AiEnhancedDataConsistencyInput): Promise<AiEnhancedDataConsistencyOutput> {
  return aiEnhancedDataConsistencyFlow(input);
}

const aiEnhancedDataConsistencyPrompt = ai.definePrompt({
  name: 'aiEnhancedDataConsistencyPrompt',
  input: {schema: AiEnhancedDataConsistencyInputSchema},
  output: {schema: AiEnhancedDataConsistencyOutputSchema},
  prompt: `You are an AI assistant that determines whether car listing data should be updated in a database.

  You will receive the current data from the database and the newly scraped data from a website.
  You should determine if the new data represents a meaningful update (e.g., price change, availability) or just a website glitch or cosmetic change.

  Respond with a boolean value for 'shouldUpdate' indicating whether the data should be updated.
  Also, provide a 'reason' for your decision.

Current Data: {{{currentData}}}
New Data: {{{newData}}}

Consider these factors:
- Is there a significant price change?
- Is the availability status changed?
- Are there any major changes in the car specifications?
- Could this be a temporary website issue?

Output your decision in JSON format:
{
  "shouldUpdate": boolean,
  "reason": string
}
`,
});

const aiEnhancedDataConsistencyFlow = ai.defineFlow(
  {
    name: 'aiEnhancedDataConsistencyFlow',
    inputSchema: AiEnhancedDataConsistencyInputSchema,
    outputSchema: AiEnhancedDataConsistencyOutputSchema,
  },
  async input => {
    const {output} = await aiEnhancedDataConsistencyPrompt(input);
    return output!;
  }
);
