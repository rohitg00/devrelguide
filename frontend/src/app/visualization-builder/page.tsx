'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VisualizationBuilderRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/builder');
  }, [router]);
  
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>The Visualization Builder has moved to a new location.</p>
      <p>If you are not redirected automatically, <a href="/builder" className="text-primary hover:underline">click here</a>.</p>
    </div>
  );
} 