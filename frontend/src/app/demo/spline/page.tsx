import { SplineSceneBasic } from "@/components/ui/spline-demo"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cute Avocado Demo | DevRel Guide",
  description: "Interactive 3D avocado that follows your cursor movement",
}

export default function SplineDemoPage() {
  return (
    <div className="container px-4 py-16 max-w-6xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
          Interactive 3D Avocado
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Meet our adorable avocado friend who follows your cursor! This cute character
          demonstrates the power of interactive 3D elements in web interfaces.
        </p>
      </div>

      <SplineSceneBasic />
      
      <div className="bg-card p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Fun Avocado Fact</h3>
        <p className="text-muted-foreground">
          Did you know? Avocados are technically berries! They contain a single seed and 
          come from the flowering part of the plant. They're also called "alligator pears" 
          due to their shape and the texture of their skin.
        </p>
      </div>
    </div>
  )
} 