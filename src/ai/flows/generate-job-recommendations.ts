'use server';

/**
 * @fileOverview Generates dynamic job recommendations based on user profile and career roadmap.
 *
 * - generateJobRecommendations - A function that generates job recommendations.
 * - JobRecommendationInput - The input type for the generateJobRecommendations function.
 * - JobRecommendationOutput - The return type for the generateJobRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobRecommendationInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile, including skills, experience, and interests.'),
  careerRoadmap: z
    .string()
    .describe('The user defined career roadmap, including target roles and desired skills.'),
});
export type JobRecommendationInput = z.infer<typeof JobRecommendationInputSchema>;

const JobRecommendationOutputSchema = z.object({
  jobRecommendations: z
    .array(z.string())
    .describe('A list of job recommendations based on the user profile and career roadmap.'),
});
export type JobRecommendationOutput = z.infer<typeof JobRecommendationOutputSchema>;

export async function generateJobRecommendations(
  input: JobRecommendationInput
): Promise<JobRecommendationOutput> {
  return generateJobRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobRecommendationsPrompt',
  input: {schema: JobRecommendationInputSchema},
  output: {schema: JobRecommendationOutputSchema},
  prompt: `You are an expert career advisor. Based on the user's profile and career roadmap, provide a list of relevant job recommendations.

User Profile: {{{userProfile}}}
Career Roadmap: {{{careerRoadmap}}}

Job Recommendations:`, // The prompt here is intentionally simple; actual implementations often require more sophisticated prompts.
});

const generateJobRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateJobRecommendationsFlow',
    inputSchema: JobRecommendationInputSchema,
    outputSchema: JobRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
