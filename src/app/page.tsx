'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

const roles = [
  {
    icon: <School className="h-12 w-12 text-primary" />,
    title: 'School Student',
    description: 'Exploring career paths after 10th or 12th? Find your direction here.',
    href: '/school',
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    title: 'College Student',
    description: 'Navigate internships, skill-building, and your first job with expert guidance.',
    href: '/college',
  },
  {
    icon: <Briefcase className="h-12 w-12 text-primary" />,
    title: 'Working Professional',
    description: 'Looking to switch careers, upskill, or advance in your current role? We can help.',
    href: '/professional',
  },
];

export default function RoleSelectorPage() {
  const heroImage = placeholderImages.find(p => p.id === 'role-selector-background');

  return (
    <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 md:py-24">
      {heroImage && (
        <>
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        </>
      )}
      <div className="container relative px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
            Welcome to CareerCompass AI
          </h1>
          <p className="mt-4 text-foreground/80 md:text-xl">
            To get started, please tell us who you are.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-1 md:grid-cols-3">
          {roles.map((role) => (
            <Link href={role.href} key={role.title} className="group">
              <Card className="flex h-full flex-col justify-between text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-background/80">
                <CardHeader className="flex flex-col items-center gap-4">
                  {role.icon}
                  <CardTitle>{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{role.description}</p>
                  <div className="mt-4 flex items-center justify-center text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
