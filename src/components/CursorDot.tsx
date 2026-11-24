import { useEffect, useRef } from 'react'

export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    el.style.opacity = '0'
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let raf = 0

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      el.style.opacity = '1'
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const loop = () => {
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      el.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0)`
      raf = Math.abs(targetX - x) + Math.abs(targetY - y) > .3 ? requestAnimationFrame(loop) : 0
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-dot" ref={ref} aria-hidden="true" />
}
