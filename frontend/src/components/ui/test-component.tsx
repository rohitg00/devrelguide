import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TestComponent() {
  return (
    <div className="p-4 space-y-4">
      <Alert>
        <AlertDescription>
          This is a test component to verify shadcn/ui setup.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    </div>
  )
}
