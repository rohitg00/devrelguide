'use client';

import React from 'react';
import { DeveloperJourneyCustomizer } from '@/components/builders/DeveloperJourneyCustomizer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperJourneyBuilder() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Developer Journey Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create a custom visualization of your developer journey with metrics for each stage.
          </p>
        </div>
      </div>
      
      <DeveloperJourneyCustomizer />
    </div>
  );
} 