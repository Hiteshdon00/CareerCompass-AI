'use server';

/**
 * @fileOverview Analyzes a user's resume and provides tailored job recommendations.
 *
 * - analyzeResumeAndRecommendJobs - The main function to process the resume and return jobs.
 * - ResumeAnalysisInput - The input type, containing the resume as a data URI.
 * - ResumeAnalysisOutput - The output type, containing a list of job recommendations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResumeAnalysisInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ResumeAnalysisInput = z.infer<typeof ResumeAnalysisInputSchema>;

const ResumeAnalysisOutputSchema = z.object({
  jobRecommendations: z
    .array(
      z.object({
        title: z.string().describe('The job title.'),
        company: z.string().describe('The name of the hiring company.'),
        description: z
          .string()
          .describe('A brief, compelling description of the job role.'),
        matchReason: z
          .string()
          .describe(
            'A short explanation of why this job is a good match for the user.'
          ),
      })
    )
    .describe('A list of 5 tailored job recommendations.'),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;

export async function analyzeResumeAndRecommendJobs(
  input: ResumeAnalysisInput
): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: { schema: ResumeAnalysisInputSchema },
  output: { schema: ResumeAnalysisOutputSchema },
  prompt: `You are an expert career consultant and headhunter with deep knowledge of the job market in India.
Your task is to analyze the provided resume and generate a list of 5 highly relevant job recommendations.

Resume:
{{media url=resumeDataUri}}

Instructions:
1. Carefully parse the resume to understand the user's skills, experience, and career trajectory.
2. Based on this analysis, identify 5 plausible, currently available job roles in India that would be an excellent fit.
3. For each recommendation, provide a job title, a plausible company name (can be a real or realistic fictional company), a short job description, and a brief "matchReason" explaining why the user is a strong candidate.
4. The companies and job descriptions should be realistic for the Indian job market.
5. Return the output in the specified JSON format.
`,
});

const resumeAnalysisFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
