'use server';

/**
 * @fileOverview Dynamically generates a list of plausible job openings for a given company.
 *
 * - generateJobListings - A function that generates a list of job listings for a company.
 * - GenerateJobListingsInput - The input type for the generateJobListings function.
 * - GenerateJobListingsOutput - The return type for the generateJobListings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobListingsInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  companyDescription: z.string().describe('A brief description of the company.'),
});
export type GenerateJobListingsInput = z.infer<typeof GenerateJobListingsInputSchema>;

const GenerateJobListingsOutputSchema = z.array(z.string()).describe('A list of job titles.');
export type GenerateJobListingsOutput = z.infer<typeof GenerateJobListingsOutputSchema>;

export async function generateJobListings(input: GenerateJobListingsInput): Promise<GenerateJobListingsOutput> {
  return generateJobListingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobListingsPrompt',
  input: {schema: GenerateJobListingsInputSchema},
  output: {schema: GenerateJobListingsOutputSchema},
  prompt: `You are a job market expert familiar with current hiring trends in India.

  Based on the following company information, generate a list of 5 plausible job openings that the company might have right now.
  Return ONLY a plain list of job titles, one job title per line.

  Company Name: {{{companyName}}}
  Company Description: {{{companyDescription}}}
  `,
});

const generateJobListingsFlow = ai.defineFlow(
  {
    name: 'generateJobListingsFlow',
    inputSchema: GenerateJobListingsInputSchema,
    outputSchema: GenerateJobListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
