import { useState, useEffect, useRef, RefObject } from 'react';

interface SizeOptions {
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

/**
 * Custom hook to manage responsive sizing for visualizations
 */
export function useResponsiveVisualizationSize({
  defaultWidth = 600,
  defaultHeight = 400,
  minWidth = 300,
  minHeight = 200,
  maxWidth,
  maxHeight,
  aspectRatio,
}: SizeOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  
  // Debounce function to prevent excessive resize calculations
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function(...args: Parameters<T>): void {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      let containerHeight = container.clientHeight;
      
      // Ensure minimum dimensions
      let newWidth = Math.max(minWidth, containerWidth);
      let newHeight = containerHeight;
      
      // Apply aspect ratio if specified
      if (aspectRatio) {
        newHeight = newWidth / aspectRatio;
        // Ensure minimum height
        if (newHeight < minHeight) {
          newHeight = minHeight;
          newWidth = newHeight * aspectRatio;
        }
      } else {
        newHeight = Math.max(minHeight, containerHeight);
      }
      
      // Apply maximum constraints if specified
      if (maxWidth && newWidth > maxWidth) {
        newWidth = maxWidth;
        if (aspectRatio) {
          newHeight = newWidth / aspectRatio;
        }
      }
      
      if (maxHeight && newHeight > maxHeight) {
        newHeight = maxHeight;
        if (aspectRatio) {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      setWidth(Math.floor(newWidth));
      setHeight(Math.floor(newHeight));
    };
    
    // Initial update
    updateDimensions();
    
    // Debounced resize handler
    const debouncedUpdateDimensions = debounce(updateDimensions, 200);
    window.addEventListener('resize', debouncedUpdateDimensions);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions);
    };
  }, [minWidth, minHeight, maxWidth, maxHeight, aspectRatio]);
  
  return { containerRef, width, height };
} 