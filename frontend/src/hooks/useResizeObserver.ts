import { useEffect, useState, useCallback, RefObject } from 'react'

interface Dimensions {
  width: number
  height: number
}

// Simple debounce function
function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export const useResizeObserver = <T extends Element>(ref: RefObject<T>) => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight
      })
    }
  }, [ref])

  useEffect(() => {
    // Set initial dimensions immediately
    updateDimensions()
    
    // Then set up observer for changes
    if (!ref.current) return

    const observeTarget = ref.current
    const debouncedSetDimensions = debounce((entries: ResizeObserverEntry[]) => {
      entries.forEach(entry => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      })
    }, 100)

    const resizeObserver = new ResizeObserver(debouncedSetDimensions)
    resizeObserver.observe(observeTarget)

    // Also handle window resize as a fallback
    window.addEventListener('resize', updateDimensions)

    return () => {
      resizeObserver.unobserve(observeTarget)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [ref, updateDimensions])

  return dimensions
}
