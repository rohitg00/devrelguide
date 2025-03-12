'use client';

import React from 'react';
import { EcosystemCustomizer } from '@/components/builders/EcosystemCustomizer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EcosystemBuilder() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">DevRel Ecosystem Builder</h1>
          <p className="text-gray-600 mt-1">
            Create a custom visualization of your DevRel ecosystem and the relationships between different entities.
          </p>
        </div>
      </div>
      
      <EcosystemCustomizer />
    </div>
  );
} 