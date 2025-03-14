'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { useEffect, useState } from "react"
import { AvocadoFallback } from "@/components/ui/avocado-fallback"
import { ThreeJSFallback } from "@/components/ui/threejs-fallback"

// Using the simplest possible scenes for maximum compatibility
const SIMPLE_SCENES = [
  "https://prod.spline.design/Kh6XbQkzS7x84UnF/scene.splinecode", // Basic shape
  "https://prod.spline.design/DEwHoYXLrVrRDgbw/scene.splinecode", // Simple cube
  "https://prod.spline.design/KZ5giYQZRoKdMCUq/scene.splinecode", // Minimal scene
];

type DisplayMode = 'spline' | 'threejs' | '2d';
 
export function SplineSceneBasic() {
  // Always start with ThreeJS by default - it's the most reliable option
  const [displayMode, setDisplayMode] = useState<DisplayMode>('threejs');
  const [isSplineLoading, setIsSplineLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [splineError, setSplineError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Get the current scene based on retry count
  const getSplineScene = () => {
    return SIMPLE_SCENES[retryCount % SIMPLE_SCENES.length];
  };
  
  // Handle initial load to show a message only the first time
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set up error handling for Spline
  useEffect(() => {
    if (displayMode !== 'spline') return;
    
    // Auto-fallback if Spline errors persist
    const fallbackTimer = setTimeout(() => {
      if (isSplineLoading) {
        console.log("Auto-falling back to ThreeJS after timeout");
        setSplineError(true);
        setDisplayMode('threejs');
        setIsSplineLoading(false);
      }
    }, 4000);
    
    return () => clearTimeout(fallbackTimer);
  }, [displayMode, isSplineLoading]);
  
  const handleSplineError = () => {
    console.log('Spline error occurred, reverting to ThreeJS');
    setIsSplineLoading(false);
    setSplineError(true);
    setDisplayMode('threejs');
  };

  const toggleDisplayMode = (mode: DisplayMode) => {
    if (mode === displayMode) return;
    
    // Reset states when switching modes
    if (mode === 'spline') {
      setIsSplineLoading(true);
      // Only try Spline if we haven't hit an error before
      if (splineError) {
        // Show a notification that Spline isn't supported
        console.log('Spline mode is not supported in this browser');
        return;
      }
      // Reset retry count when explicitly choosing Spline
      setRetryCount(0);
    } else {
      setIsSplineLoading(false);
    }
    
    setDisplayMode(mode);
  };

  return (
    <Card className="w-full h-[500px] sm:h-[550px] md:h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive Avocado
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-lg">
            Meet our cute avocado friend who follows your cursor! This adorable character 
            adds personality to your interface while demonstrating interactive capabilities.
          </p>
          
          {initialLoad && displayMode === 'threejs' && (
            <div className="mt-2 text-xs text-teal-400 bg-teal-950/30 p-2 rounded-md border border-teal-800/50 animate-pulse">
              <p className="font-medium">Using optimized 3D rendering</p>
              <p className="mt-0.5">Move your cursor to interact with the avocado!</p>
            </div>
          )}
          
          {splineError && (
            <div className="mt-2 text-xs text-amber-400 bg-amber-950/30 p-2 rounded-md border border-amber-800/50">
              <p className="font-medium">Advanced 3D not supported in your browser.</p>
              <p className="mt-0.5">Using our optimized 3D rendering instead!</p>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={() => toggleDisplayMode('spline')}
              className={`text-xs px-3 py-1.5 rounded-md 
                ${displayMode === 'spline' 
                  ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"} 
                transition-colors ${splineError ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={splineError}
              title={splineError ? "Not supported in your browser" : "Try advanced 3D (experimental)"}
            >
              {isSplineLoading ? "Loading 3D..." : "Advanced 3D"}
            </button>
            
            <button 
              onClick={() => toggleDisplayMode('threejs')}
              className={`text-xs px-3 py-1.5 rounded-md 
                ${displayMode === 'threejs' 
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"} 
                transition-colors`}
              title="Optimized 3D version"
            >
              Simple 3D
            </button>
            
            <button 
              onClick={() => toggleDisplayMode('2d')}
              className={`text-xs px-3 py-1.5 rounded-md 
                ${displayMode === '2d' 
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"} 
                transition-colors`}
              title="Compatible with all browsers"
            >
              2D Version
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[250px] md:min-h-0">
          {displayMode === '2d' && <AvocadoFallback />}
          {displayMode === 'threejs' && <ThreeJSFallback />}
          {displayMode === 'spline' && (
            <SplineScene 
              scene={getSplineScene()}
              className="w-full h-full"
              onError={handleSplineError}
            />
          )}
        </div>
      </div>
    </Card>
  )
} 