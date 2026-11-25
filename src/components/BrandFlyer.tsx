import { useLayoutEffect, useRef } from 'react'
import { clamp } from '../utils/clamp'

const portraitScale = 1.28

export function BrandFlyer() {
  const slot = useRef<HTMLSpanElement>(null)
  const badge = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const home = slot.current
    const link = badge.current
    const origin = document.querySelector<HTMLElement>('.intro__brand-origin')
    if (!link || !home || !origin) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let travel = 1
    let x = 0
    let y = 0

    const render = () => {
      const scroll = Math.max(0, window.scrollY)
      const progress = clamp(scroll / travel)
      const remaining = reduced.matches ? (progress < 1 ? 1 : 0) : Math.pow(1 - progress, 2.4)
      if (remaining === 0) {
        link.style.removeProperty('transform')
        return
      }

      const offsetY = (y - scroll) * remaining
      const scale = 1 + (portraitScale - 1) * remaining
      link.style.transform = `translate3d(${x * remaining}px, ${offsetY}px, 0) scale(${scale})`
    }

    const measure = () => {
      const start = origin.getBoundingClientRect()
      const end = home.getBoundingClientRect()
      x = start.left - end.left
      y = start.top + window.scrollY + (start.height - end.height * portraitScale) / 2 - end.top
      travel = clamp(y * 0.72, 160, 500)
      render()
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        render()
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(origin.closest('.intro__layout') ?? origin)
    observer.observe(home)
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    reduced.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      reduced.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <span className="brand-slot" ref={slot}>
      <a className="logo" ref={badge} href="#top" aria-label="xCaptaiN09 home">
        <span className="logo__mark" />xCaptaiN09
      </a>
    </span>
  )
}
