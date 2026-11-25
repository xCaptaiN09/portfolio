import { useCallback, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export function useLenis() {
  const controller = useRef<Lenis | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.85,
      smoothWheel: true,
      anchors: true,
    })

    controller.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      controller.current = null
    }
  }, [])

  return useCallback((top: number) => {
    if (controller.current) {
      controller.current.scrollTo(top, {
        duration: 0.6,
        easing: (progress) => progress * progress * (3 - 2 * progress),
      })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])
}
