'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { talentMatching, type TalentMatchingOutput } from '@/ai/flows/talent-matching';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  userProfile: z.string().min(1, { message: 'User profile is required.' }),
  companyRequirements: z.string().min(1, { message: 'Company requirements are required.' }),
});

export default function TalentMatchPage() {
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<TalentMatchingOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      companyRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMatchResult(null);
    try {
      const result = await talentMatching(values);
      setMatchResult(result);
    } catch (error) {
      console.error('Error in talent matching:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Talent Matching</CardTitle>
            <CardDescription>
              Enter a user profile and company requirements to see the match summary and job recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Profile</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Skills, experience, career goals..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Requirements</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Required skills, experience, company culture..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Find Match
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {matchResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Talent Match Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold">Match Summary</h3>
                <p className="text-sm">{matchResult.matchSummary}</p>
              </div>
              <div>
                <h3 className="font-bold">Job Recommendations</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {matchResult.jobRecommendations.map((job, index) => (
                    <li key={index} className="text-sm">
                      {job}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}