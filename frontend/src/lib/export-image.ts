export async function toPng(
  element: HTMLElement,
  options?: { backgroundColor?: string; scale?: number }
): Promise<HTMLCanvasElement> {
  const { backgroundColor = '#003366', scale = 2 } = options || {}
  const rect = element.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = rect.width * scale
  canvas.height = rect.height * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')

  ctx.scale(scale, scale)
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, rect.width, rect.height)

  const svgEl = element.querySelector('svg')
  if (svgEl) {
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
    ctx.drawImage(img, 0, 0, rect.width, rect.height)
    URL.revokeObjectURL(url)
  }

  return canvas
}
