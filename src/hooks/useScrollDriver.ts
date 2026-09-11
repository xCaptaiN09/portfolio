import { useEffect } from 'react'
import { clamp } from '../utils/clamp'
import { setScrollProgress } from '../utils/scrollProgress'
import { buildVideoStops, videoOpacityAt } from '../utils/videoStops'
export function useScrollDriver() {
  useEffect(() => {
    let videoEl: HTMLVideoElement | null = null
    let headerEl: HTMLElement | null = null
    let creamSections: HTMLElement[] = []
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? clamp(window.scrollY / max) : 0)
      if (!videoEl) videoEl = document.querySelector<HTMLVideoElement>('.bg-video video')
      if (videoEl) videoEl.style.opacity = videoOpacityAt(window.scrollY).toFixed(3)
      if (!headerEl) headerEl = document.querySelector<HTMLElement>('.site-header')
      if (creamSections.length === 0) creamSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header="light"]'))
      if (headerEl) {
        const probe = 48
        const overLight = creamSections.some((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= probe && rect.bottom >= probe
        })
        headerEl.classList.toggle('site-header--light', overLight)
      }
    }
    const rebuild = () => { creamSections = []; buildVideoStops(); update() }
    rebuild()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', rebuild)
    window.addEventListener('load', rebuild)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', rebuild)
      window.removeEventListener('load', rebuild)
    }
  }, [])
}