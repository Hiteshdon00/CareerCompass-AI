'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  GitMerge,
  ClipboardCheck,
  Briefcase,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function CollegeHomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const heroImage = placeholderImages[0];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  const transformShape = (invert = false, depth = 1) => {
    const invertFactor = invert ? -1 : 1;
    const transX = (mousePosition.x - 0.5) * 40 * invertFactor * depth;
    const transY = (mousePosition.y - 0.5) * 40 * invertFactor * depth;

    return {
      transform: `translate3d(${transX}px, ${transY}px, 0)`,
    };
  };

  return (
    <>
      <section
        className="relative w-full border-b"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
           <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        </div>


        <div className="container relative grid lg:grid-cols-2 gap-8 px-4 md:px-6 py-20 md:py-32 lg:py-40">
          <div
             className="flex flex-col justify-center space-y-4 transition-transform duration-500 ease-out"
             style={transformShape(true, 0.2)}
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Navigate Your Career with AI Precision
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                CareerCompass AI provides personalized career roadmaps, skill
                assessments, and job recommendations to guide you to your dream
                job.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/assessment?role=college">
                <Button size="lg">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/employers">
                <Button variant="outline" size="lg">
                  Browse Employers
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            {/* Visuals are handled by the background shapes */}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                A Smarter Path to Your Career Goals
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our suite of AI-powered tools is designed to give you a
                competitive edge in the job market.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
            <Link href="/roadmap">
              <FeatureCard
                icon={<GitMerge className="h-8 w-8 text-primary" />}
                title="AI Career Roadmap"
                description="Generate a personalized career plan with suggested roles and skills to learn."
              />
            </Link>
            <Link href="/assessment?role=college">
              <FeatureCard
                icon={<ClipboardCheck className="h-8 w-8 text-primary" />}
                title="Skill Assessment"
                description="Identify your strengths and areas for growth with our comprehensive assessment."
              />
            </Link>
            <Link href="/jobs">
              <FeatureCard
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Job Recommendations"
                description="Receive curated job listings that align with your profile and career aspirations."
              />
            </Link>
            <Link href="/employers">
              <FeatureCard
                icon={<Building2 className="h-8 w-8 text-primary" />}
                title="Employer Profiles"
                description="Get insights into top companies, their culture, and open positions in India."
              />
            </Link>
            <Link href="/talent-match">
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Talent Matching"
                description="Our AI intelligently connects you with employers looking for your unique skillset."
              />
            </Link>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-bold">Ready to Begin?</h3>
              <p className="text-sm text-muted-foreground">
                Take the first step towards your dream career.
              </p>
              <Link href="/assessment?role=college" className="pt-2">
                <Button>Start Assessment</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group grid h-full gap-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
      <div className="flex items-center gap-4">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
