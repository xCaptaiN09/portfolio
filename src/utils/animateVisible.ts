// Decorative canvases only need frames while visitors can see them.
export function animateVisible(canvas: HTMLCanvasElement, draw: (seconds: number) => void, stillTime: number) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const touch = window.matchMedia('(pointer: coarse)')
  let inView = false
  let frame = 0
  let lastDraw = -Infinity

  function tick(now: number) {
    frame = 0
    if (!inView || document.hidden) return
    // Allow for fractional timestamps on 60 Hz displays.
    if (!touch.matches || now - lastDraw >= 32) {
      draw(reduced.matches ? stillTime : now / 1000)
      lastDraw = now
    }
    if (!reduced.matches) frame = requestAnimationFrame(tick)
  }

  function refresh() {
    cancelAnimationFrame(frame)
    lastDraw = -Infinity
    if (inView && !document.hidden) frame = requestAnimationFrame(tick)
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    refresh()
  })
  const size = new ResizeObserver(refresh)
  size.observe(canvas)
  observer.observe(canvas)
  reduced.addEventListener('change', refresh)
  document.addEventListener('visibilitychange', refresh)
  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    size.disconnect()
    reduced.removeEventListener('change', refresh)
    document.removeEventListener('visibilitychange', refresh)
  }
}
