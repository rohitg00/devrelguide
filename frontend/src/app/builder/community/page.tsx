'use client';

import React from 'react';
import { CommunityGraphCustomizer } from '@/components/builders/CommunityGraphCustomizer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CommunityGraphBuilder() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Community Graph Builder</h1>
          <p className="text-gray-600 mt-1">
            Create a custom network graph showing your communities and their connections.
          </p>
        </div>
      </div>
      
      <CommunityGraphCustomizer />
    </div>
  );
} 