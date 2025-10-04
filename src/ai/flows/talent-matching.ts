'use server';
/**
 * @fileOverview An AI-powered talent matching flow.
 *
 * - talentMatching - A function that handles the talent matching process.
 * - TalentMatchingInput - The input type for the talentMatching function.
 * - TalentMatchingOutput - The return type for the talentMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TalentMatchingInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A detailed description of the user profile, including skills, experience, and career goals.'),
  companyRequirements: z
    .string()
    .describe('A detailed description of the company requirements, including required skills, experience, and company culture.'),
});
export type TalentMatchingInput = z.infer<typeof TalentMatchingInputSchema>;

const TalentMatchingOutputSchema = z.object({
  matchSummary: z.string().describe('A summary of how well the candidate matches the company requirements.'),
  jobRecommendations: z.array(z.string()).describe('A list of job recommendations based on the user profile and company requirements.'),
});
export type TalentMatchingOutput = z.infer<typeof TalentMatchingOutputSchema>;

export async function talentMatching(input: TalentMatchingInput): Promise<TalentMatchingOutput> {
  return talentMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'talentMatchingPrompt',
  input: {schema: TalentMatchingInputSchema},
  output: {schema: TalentMatchingOutputSchema},
  prompt: `You are an expert talent matching agent.

You will use the user profile and company requirements to determine how well the candidate matches the company requirements and provide job recommendations.

User Profile: {{{userProfile}}}
Company Requirements: {{{companyRequirements}}}

Based on the user profile and company requirements, provide a match summary and a list of job recommendations.
`,
});

const talentMatchingFlow = ai.defineFlow(
  {
    name: 'talentMatchingFlow',
    inputSchema: TalentMatchingInputSchema,
    outputSchema: TalentMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
