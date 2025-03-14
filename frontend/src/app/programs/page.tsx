'use client'

import React from 'react'
import { DevRelPrograms } from '@/components/programs/DevRelPrograms'
import { PageHeader } from '@/components/PageHeader'

export default function ProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader 
        title="Developer Relations Programs" 
        description="Explore popular DevRel programs and community initiatives from leading technology companies"
      />
      <DevRelPrograms />
    </div>
  )
} 