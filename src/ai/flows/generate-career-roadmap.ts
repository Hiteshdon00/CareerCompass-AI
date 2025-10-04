'use server';

/**
 * @fileOverview Generates personalized career roadmaps based on user skills and interests.
 *
 * - generateCareerRoadmap - A function that generates a career roadmap.
 * - CareerRoadmapInput - The input type for the generateCareerRoadmap function.
 * - CareerRoadmapOutput - The return type for the generateCareerRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerRoadmapInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma-separated list of the user\u2019s current skills.'),
  interests: z
    .string()
    .describe('A comma-separated list of the user\u2019s interests.'),
  experience: z
    .string()
    .describe('Description of the user\u2019s prior work experience.'),
});
export type CareerRoadmapInput = z.infer<typeof CareerRoadmapInputSchema>;

const CareerRoadmapOutputSchema = z.object({
  roadmap: z.array(
    z.object({
      role: z.string().describe('The potential job role.'),
      skillsToAcquire: z
        .string()
        .describe('A comma-separated list of skills to acquire for the role.'),
    })
  ).describe('A list of potential job roles with skills to acquire for each role.')
});
export type CareerRoadmapOutput = z.infer<typeof CareerRoadmapOutputSchema>;

export async function generateCareerRoadmap(input: CareerRoadmapInput): Promise<CareerRoadmapOutput> {
  return generateCareerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerRoadmapPrompt',
  input: {schema: CareerRoadmapInputSchema},
  output: {schema: CareerRoadmapOutputSchema},
  prompt: `You are an expert career advisor. Given a user's skills, interests, and experience, you will generate a personalized career roadmap, suggesting relevant roles and necessary skills to acquire.

Your suggestions should cover a wide range of fields including tech, business, design, and marketing. Be inclusive and provide diverse career paths.

Skills: {{{skills}}}
Interests: {{{interests}}}
Experience: {{{experience}}}

Generate a list of potential job roles and the skills the user needs to acquire for each role. Format the skills as a comma separated list.

Ensure that the output is a valid JSON array.`
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: CareerRoadmapInputSchema,
    outputSchema: CareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
