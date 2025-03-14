'use client'

import { Suspense, lazy, useRef, useState, useEffect } from 'react'
// We'll use dynamic import with error handling
const Spline = lazy(() => 
  import('@splinetool/react-spline')
    .catch(err => {
      console.error('Failed to load Spline module:', err);
      return { default: () => null }; // Return empty component on error
    })
);

interface SplineSceneProps {
  scene: string
  className?: string
  onError?: () => void
}

export function SplineScene({ scene, className, onError }: SplineSceneProps) {
  const splineRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInternalError, setHasInternalError] = useState(false);
  const [sceneKey, setSceneKey] = useState(Date.now()); // Force remount when scene changes

  // Update key when scene changes to force remount
  useEffect(() => {
    setSceneKey(Date.now());
    setIsLoading(true);
    setHasInternalError(false);
  }, [scene]);

  // Use useEffect to catch any runtime errors
  useEffect(() => {
    const handleGlobalErrors = (event: ErrorEvent) => {
      // More comprehensive check for Spline-related errors
      if (
        // Check message content
        event.message.includes('buffer') || 
        event.message.includes('Spline') || 
        event.message.includes('findObjectsByType') ||
        event.message.includes('deserialize') ||
        event.message.includes('end of buffer') ||
        // Check filename
        event.filename?.includes('spline') ||
        event.filename?.includes('runtime') ||
        // Check stack trace
        (event.error?.stack && (
          event.error.stack.includes('spline') ||
          event.error.stack.includes('buffer') ||
          event.error.stack.includes('deserialize') ||
          event.error.stack.includes('runtime')
        ))
      ) {
        console.error('Caught Spline-related error:', event.message);
        setHasInternalError(true);
        if (onError) onError();
      }
    };

    window.addEventListener('error', handleGlobalErrors);
    
    // Shorter timeout for faster fallback
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Spline loading timed out, triggering fallback');
        setHasInternalError(true);
        if (onError) onError();
      }
    }, 2500); // 2.5 second timeout
    
    return () => {
      window.removeEventListener('error', handleGlobalErrors);
      clearTimeout(fallbackTimer);
    };
  }, [onError, isLoading]);

  const onLoad = (splineApp: any) => {
    try {
      console.log('Spline scene loaded successfully!');
      setIsLoading(false);
      
      // Log the app instance for debugging
      console.log('Spline app loaded:', splineApp);
      
      // Check if the app is in a disposed state (which causes errors)
      if (splineApp.disposed === true) {
        console.error('Spline app is in disposed state, triggering fallback');
        setHasInternalError(true);
        if (onError) onError();
        return;
      }
      
      // Simple pointer tracking, but don't try to manipulate objects
      // since the API is unreliable across different Spline versions
      const handlePointerMove = (e: MouseEvent) => {
        try {
          // Just log that we're tracking the pointer, but don't try to 
          // manipulate anything which could cause errors
          console.log('Pointer tracking active');
        } catch (e) {
          // Silently ignore errors in pointer handling
        }
      };
      
      // Add event listener with passive option for better performance
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      
      // Return cleanup function
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
      };
    } catch (error) {
      console.error('Error in Spline onLoad:', error);
      setHasInternalError(true);
      if (onError) onError();
    }
  };

  const handleError = (err: any) => {
    console.error('Error loading Spline scene:', err);
    setHasInternalError(true);
    if (onError) onError();
  };

  // If we already know there's an error, don't render Spline
  if (hasInternalError) {
    return null;
  }

  return (
    <div className="w-full h-full">
      {isLoading && !hasInternalError && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 z-10">
          <span className="loader"></span>
        </div>
      )}
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <div className="w-full h-full spline-canvas">
          <Spline
            key={sceneKey}
            ref={splineRef}
            scene={scene}
            className={className}
            onLoad={onLoad}
            onError={handleError}
          />
        </div>
      </Suspense>
    </div>
  )
} 