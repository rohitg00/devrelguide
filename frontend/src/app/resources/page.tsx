'use client'

import { ResourceContainer } from '@/components/ui/resource-container'
import { DevRelGuide } from '@/components/ui/devrel-guide'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ResourcesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full">
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="guide">DevRel Guide</TabsTrigger>
          </TabsList>
          <TabsContent value="resources">
            <ResourceContainer />
          </TabsContent>
          <TabsContent value="guide">
            <DevRelGuide />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
