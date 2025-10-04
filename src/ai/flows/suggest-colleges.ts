'use server';

/**
 * @fileOverview Suggests colleges based on a student's stream and interests.
 *
 * - suggestColleges - A function that takes a stream and interests and returns college suggestions.
 * - CollegeSuggestionInput - The input type for the suggestColleges function.
 * - CollegeSuggestionOutput - The return type for the suggestColleges function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CollegeSuggestionInputSchema = z.object({
  stream: z.string().describe('The student\'s academic stream (e.g., Science, Commerce, Arts).'),
  interests: z
    .string()
    .describe('A comma-separated list of the student\'s interests.'),
});
export type CollegeSuggestionInput = z.infer<typeof CollegeSuggestionInputSchema>;

const CollegeSuggestionOutputSchema = z.object({
  colleges: z.array(
    z.object({
      name: z.string().describe('The name of the college.'),
      location: z.string().describe('The city and state where the college is located.'),
      suggestedCourses: z.string().describe('A comma-separated list of suggested courses at this college.'),
      reason: z.string().describe('A detailed reason why this college and these courses are a good fit for the student, referencing their specific interests.'),
    })
  ).describe('A list of up to 5 recommended colleges in India.'),
});
export type CollegeSuggestionOutput = z.infer<typeof CollegeSuggestionOutputSchema>;

export async function suggestColleges(
  input: CollegeSuggestionInput
): Promise<CollegeSuggestionOutput> {
  return suggestCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCollegesPrompt',
  input: { schema: CollegeSuggestionInputSchema },
  output: { schema: CollegeSuggestionOutputSchema },
  prompt: `You are an expert career counselor for high school students in India.
Your task is to recommend up to 5 suitable colleges and courses based on the student's academic stream and interests.

Student's Stream: {{{stream}}}
Student's Interests: {{{interests}}}

Instructions:
1.  Analyze the stream and interests to identify relevant fields of study.
2.  Suggest up to 5 real, well-regarded colleges in India (e.g., IITs, NITs, Delhi University colleges, etc.) that are strong in those fields.
3.  For each college, provide its location and a few relevant courses the student could pursue.
4.  Crucially, provide a detailed and encouraging reason why the college and courses are a great choice for them. Your reason must explicitly reference their stated interests and explain how the suggested path aligns with them.
5.  Ensure the output is a valid JSON object.
`,
});

const suggestCollegesFlow = ai.defineFlow(
  {
    name: 'suggestCollegesFlow',
    inputSchema: CollegeSuggestionInputSchema,
    outputSchema: CollegeSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
