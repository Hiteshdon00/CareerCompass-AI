'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import {
  analyzeResumeAndRecommendJobs,
  type ResumeAnalysisOutput,
} from '@/ai/flows/analyze-resume-and-recommend-jobs';

export default function ProfessionalPage() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [jobRecommendations, setJobRecommendations] =
    useState<ResumeAnalysisOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setResumeData(reader.result as string);
      };
    }
  };

  const handleSubmit = async () => {
    if (!resumeData) return;
    setLoading(true);
    setJobRecommendations(null);
    try {
      const result = await analyzeResumeAndRecommendJobs({ resumeDataUri: resumeData });
      setJobRecommendations(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Advance or Pivot Your Career
        </h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
          Welcome, professional! Whether you're looking to climb the ladder,
          switch fields, or upskill, our AI-powered tools can help you
          strategize your next move.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Job Matching</CardTitle>
              <CardDescription>
                Upload your resume (PDF) and let our AI find the best job
                openings for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resume-upload" className="sr-only">
                  Upload Resume
                </Label>
                <div className="relative">
                   <Input
                    id="resume-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-muted-foreground/50 hover:border-primary transition-colors">
                     <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {fileName || 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF only</p>
                     </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!resumeData || loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Resume & Get Jobs
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Personalized Career Roadmap</CardTitle>
              <CardDescription>
                Answer a few questions to generate a step-by-step roadmap for your
                next career move.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/roadmap">
                <Button className="w-full">
                  Build Your New Career Roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          {loading && (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">
                  Scanning your resume and finding the best roles for you...
                </p>
             </div>
          )}
          {jobRecommendations && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Top Job Recommendations</CardTitle>
                <CardDescription>
                  Based on your resume, here are some roles that could be a
                  great fit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobRecommendations.jobRecommendations.map((job, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                      <Button asChild variant="link" className="px-0 mt-2">
                         <Link href="#" target="_blank">
                           Learn More & Apply
                           <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
