'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateJobRecommendations,
  type JobRecommendationOutput,
} from '@/ai/flows/generate-job-recommendations';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  userProfile: z.string().min(1, { message: 'User profile is required.' }),
  careerRoadmap: z.string().min(1, { message: 'Career roadmap is required.' }),
});

export default function JobsPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<JobRecommendationOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      careerRoadmap: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendations(null);
    try {
      const result = await generateJobRecommendations(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Error generating job recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Get Job Recommendations</CardTitle>
            <CardDescription>
              Provide your profile and career roadmap to get tailored job recommendations.
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
                      <FormLabel>Your Profile</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Include your skills, experience, and interests." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careerRoadmap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Career Roadmap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your target roles and desired skills." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Recommendations
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {recommendations && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.jobRecommendations.map((job, index) => (
                  <li key={index} className="rounded-lg border bg-card p-3">
                    {job}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}