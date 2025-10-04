'use client';

import { Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import {
  generateJobListings,
  type GenerateJobListingsOutput,
} from '@/ai/flows/generate-job-listings';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function EmployerDetail() {
  const searchParams = useSearchParams();
  const params = useParams();

  const employerName = decodeURIComponent(params.employerName as string);
  const employerDescription = searchParams.get('description') || '';

  const [jobs, setJobs] = useState<GenerateJobListingsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employerName && employerDescription) {
      setLoading(true);
      setError(null);
      generateJobListings({
        companyName: employerName,
        companyDescription: employerDescription,
      })
        .then(setJobs)
        .catch((err) => {
          console.error('Error generating job listings', err);
          setError('Could not load job listings at this time.');
        })
        .finally(() => setLoading(false));
    }
  }, [employerName, employerDescription]);

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl flex items-center gap-4">
          <Building className="h-10 w-10 text-primary" />
          {employerName}
        </h1>
        <p className="max-w-[800px] mt-4 text-muted-foreground md:text-xl">
          {employerDescription}
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tighter mb-8 flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          Potential Job Openings
        </h2>
        {loading && <JobListingsSkeleton />}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs?.map((jobTitle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{jobTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A potential opportunity at {employerName}.
                  </p>
                </CardContent>
              </Card>
            ))}
             {!jobs || jobs.length === 0 && (
                <p className="text-muted-foreground col-span-full">No job listings could be generated at this time.</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

function JobListingsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function EmployerPage() {
    return (
        <Suspense fallback={<JobListingsSkeleton />}>
            <EmployerDetail />
        </Suspense>
    )
}
