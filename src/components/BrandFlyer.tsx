import { useEffect, useRef } from 'react'

export function BrandFlyer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flyer = ref.current
    const handle = document.querySelector<HTMLElement>('.hero__brand')
    const home = document.querySelector<HTMLAnchorElement>('.site-header .logo')
    if (!flyer || !handle || !home) return
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.55))
      const flying = motion.matches && progress > 0 && progress < 1
      flyer.style.opacity = flying ? '1' : '0'
      handle.style.opacity = flying ? '0' : ''
      home.classList.toggle('logo--flying', flying)
      if (!flying) return

      const from = handle.getBoundingClientRect()
      const to = home.getBoundingClientRect()
      const p = progress * progress * (3 - 2 * progress)
      const x = from.left + (to.left - from.left) * p
      const y = from.top + (to.top - from.top) * p
      const scale = 1 + (to.height / from.height - 1) * p
      flyer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
      home.classList.remove('logo--flying')
      handle.style.opacity = ''
    }
  }, [])

  return <div className="brand-flyer" ref={ref} aria-hidden="true"><span className="dot" />xCaptaiN09</div>
}
