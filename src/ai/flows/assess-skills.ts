'use server';

/**
 * @fileOverview Assesses user skills based on quiz answers to suggest a suitable role.
 *
 * - assessSkills - A function that takes user answers and returns a suitable role and reasoning.
 * - SkillAssessmentInput - The input type for the assessSkills function.
 * - SkillAssessmentOutput - The return type for the assessSkills function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillAssessmentInputSchema = z.object({
  userAnswers: z
    .string()
    .describe('A string of user answers to the assessment quiz.'),
});
export type SkillAssessmentInput = z.infer<typeof SkillAssessmentInputSchema>;

const SkillAssessmentOutputSchema = z.object({
  suitableRole: z
    .string()
    .describe('The job role most suitable for the user based on their answers.'),
  reasoning: z
    .string()
    .describe(
      'A detailed, step-by-step explanation of why the suggested role is a good fit, linking back to their specific answers.'
    ),
});
export type SkillAssessmentOutput = z.infer<typeof SkillAssessmentOutputSchema>;

export async function assessSkills(
  input: SkillAssessmentInput
): Promise<SkillAssessmentOutput> {
  return assessSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillAssessmentPrompt',
  input: { schema: SkillAssessmentInputSchema },
  output: { schema: SkillAssessmentOutputSchema },
  prompt: `You are an expert career advisor. Based on the user's answers to a personality and interest quiz, you will suggest a single, specific job role or academic stream that would be a good fit for them. You will also provide a detailed, step-by-step reasoning for your suggestion, explaining how their answers point to this conclusion.

Here are the user's answers:
{{{userAnswers}}}

Analyze these answers to determine a suitable job role or stream and provide a comprehensive explanation for your reasoning.
If suggesting an academic stream (Science, Commerce, Arts), explain which subjects within that stream align with their answers.
If suggesting a job role, cover a wide range of roles common in the tech, business, design, and marketing sectors in India.
Example roles: Software Engineer, Product Manager, UX/UI Designer, Data Analyst, Business Development Manager, Content Strategist, Digital Marketer, etc.
`,
});

const assessSkillsFlow = ai.defineFlow(
  {
    name: 'assessSkillsFlow',
    inputSchema: SkillAssessmentInputSchema,
    outputSchema: SkillAssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
