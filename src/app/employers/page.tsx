'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';
import Link from 'next/link';

const employers = [
  {
    name: 'Tata Consultancy Services',
    description: 'A global leader in IT services, consulting, and business solutions.',
    website: 'https://www.tcs.com',
    linkedin: 'https://www.linkedin.com/company/tata-consultancy-services/',
  },
  {
    name: 'Reliance Industries',
    description: 'An Indian multinational conglomerate company, engaged in energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
    website: 'https://www.ril.com',
    linkedin: 'https://www.linkedin.com/company/reliance-industries-limited/',
  },
  {
    name: 'Infosys',
    description: 'A global leader in next-generation digital services and consulting.',
    website: 'https://www.infosys.com',
    linkedin: 'https://www.linkedin.com/company/infosys/',
  },
  {
    name: 'HDFC Bank',
    description: 'A leading private sector bank in India, providing a wide range of financial products and services.',
    website: 'https://www.hdfcbank.com',
    linkedin: 'https://www.linkedin.com/company/hdfc-bank/',
  },
    {
    name: 'Wipro',
    description: 'A leading global information technology, consulting and business process services company.',
    website: 'https://www.wipro.com',
    linkedin: 'https://www.linkedin.com/company/wipro/',
  },
  {
    name: 'Flipkart',
    description: 'One of India\'s leading e-commerce marketplaces.',
    website: 'https://www.flipkart.com',
    linkedin: 'https://www.linkedin.com/company/flipkart/',
  },
];

export default function EmployersPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Top Employers in India</h1>
        <p className="max-w-[600px] mx-auto mt-4 text-muted-foreground md:text-xl">
          Discover leading companies, their culture, and opportunities.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {employers.map((employer) => (
          <Card key={employer.name} className="flex flex-col hover:shadow-xl transition-shadow">
            <Link
              href={`/employers/${encodeURIComponent(employer.name)}?description=${encodeURIComponent(employer.description)}`}
              className="flex-grow"
            >
              <CardHeader>
                <CardTitle>{employer.name}</CardTitle>
                <CardDescription className="line-clamp-3 h-[60px]">{employer.description}</CardDescription>
              </CardHeader>
            </Link>
            <CardContent className="flex flex-col gap-4 mt-auto">
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button asChild variant="outline">
                    <Link href={employer.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </Link>
                  </Button>
                  <Link href={employer.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${employer.name} LinkedIn Profile`}>
                    <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
