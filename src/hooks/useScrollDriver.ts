import { useEffect } from 'react'
import { clamp } from '../utils/clamp'
import { setScrollProgress } from '../utils/scrollProgress'

export function useScrollDriver() {
  useEffect(() => {
    let headerEl: HTMLElement | null = null
    let mediaEls: HTMLElement[] = []
    let creamSections: HTMLElement[] = []
    let ticking = false

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? clamp(window.scrollY / max) : 0)

      if (mediaEls.length === 0) {
        mediaEls = Array.from(document.querySelectorAll<HTMLElement>('.bg-video video, .bg-video img'))
      }
      if (mediaEls.length > 0) {
        const opacity = mediaOpacity(window.scrollY)
        mediaEls.forEach((el) => {
          el.style.opacity = opacity
        })
      }

      if (!headerEl) {
        headerEl = document.querySelector<HTMLElement>('.site-header')
      }
      if (creamSections.length === 0) {
        creamSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header="light"]'))
      }
      if (headerEl) {
        const probe = 48
        const overLight = creamSections.some((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= probe && rect.bottom >= probe
        })
        headerEl.classList.toggle('site-header--light', overLight)
      }
    }

    const mediaOpacity = (y: number): string => {
      const vh = window.innerHeight
      const about = document.getElementById('about')
      const projects = document.getElementById('projects')
      const contact = document.getElementById('contact')
      const a = about ? about.offsetTop : vh
      const p = projects ? projects.offsetTop : vh * 3
      const c = contact ? contact.offsetTop : vh * 5
      const stops: Array<[number, number]> = [
        [0, 0.5],
        [Math.max(0, a - vh * 0.85), 0.5],
        [Math.max(0, a - vh * 0.25), 0.2],
        [Math.max(0, p - vh * 0.85), 0.2],
        [Math.max(0, p - vh * 0.3), 0.38],
        [Math.max(0, c - vh * 0.85), 0.38],
        [Math.max(0, c - vh * 0.3), 0.68],
        [Number.POSITIVE_INFINITY, 0.68],
      ]
      for (let i = 0; i < stops.length - 1; i++) {
        const [x0, v0] = stops[i]
        const [x1, v1] = stops[i + 1]
        if (y <= x1) {
          if (x1 <= x0) return v1.toFixed(3)
          const t = clamp((y - x0) / (x1 - x0))
          return (v0 + (v1 - v0) * t).toFixed(3)
        }
      }
      return stops[stops.length - 1][1].toFixed(3)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    const rebuild = () => {
      creamSections = []
      mediaEls = []
      update()
    }

    rebuild()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', rebuild)
    window.addEventListener('load', rebuild)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', rebuild)
      window.removeEventListener('load', rebuild)
    }
  }, [])
}
