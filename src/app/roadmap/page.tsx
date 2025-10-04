'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateCareerRoadmap,
  type CareerRoadmapOutput,
} from '@/ai/flows/generate-career-roadmap';
import { Award, Briefcase, Flag, Loader2, Rocket, Target } from 'lucide-react';

const formSchema = z.object({
  skills: z.string().min(1, { message: 'Skills are required.' }),
  interests: z.string().min(1, { message: 'Interests are required.' }),
  experience: z.string().min(1, { message: 'Experience is required.' }),
});

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmapOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: '',
      interests: '',
      experience: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRoadmap(null);
    try {
      const result = await generateCareerRoadmap(values);
      setRoadmap(result);
    } catch (error) {
      console.error('Error generating career roadmap:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Rocket className="h-8 w-8 text-accent" />
              <span>Generate Your Career Roadmap</span>
            </CardTitle>
            <CardDescription>
              Chart your course to success. Enter your details, and our AI will
              craft a personalized career roadmap just for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Current Skills
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Python, Financial Modeling, Content Marketing"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Interests
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., AI, Product Management, UI/UX Design"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Work Experience
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your previous roles and responsibilities."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:col-span-2"
                  size="lg"
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Roadmap
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI is building your custom roadmap...
            </p>
          </div>
        )}

        {roadmap && (
          <div>
            <h2 className="mb-8 text-center text-3xl font-bold">
              Your AI-Generated Career Roadmap
            </h2>
            <div className="relative space-y-12 pl-6 before:absolute before:left-[30px] before:top-0 before:h-full before:w-1 before:-translate-x-1/2 before:bg-border before:content-['']">
              {roadmap.roadmap.map((item, index) => (
                <div
                  key={index}
                  className="relative pl-12"
                >
                  <div className="absolute left-[30px] top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-accent text-accent-foreground flex items-center justify-center ring-4 ring-background">
                     <Flag className="h-4 w-4" />
                  </div>
                  <Card className="shadow-md transition-shadow hover:shadow-xl">
                    <CardHeader>
                      <CardTitle>{item.role}</CardTitle>
                      <CardDescription>
                        A potential next step in your career journey.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold">Skills to Acquire:</h4>
                      <p className="mt-2 text-muted-foreground">
                        {item.skillsToAcquire}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button onClick={() => setRoadmap(null)} variant="outline">Create a New Roadmap</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
