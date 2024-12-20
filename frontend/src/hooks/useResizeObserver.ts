import { useEffect, useState, RefObject } from 'react'

interface Dimensions {
  width: number
  height: number
}

export const useResizeObserver = <T extends Element>(ref: RefObject<T>) => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      })
    })

    resizeObserver.observe(observeTarget)

    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])

  return dimensions
}
