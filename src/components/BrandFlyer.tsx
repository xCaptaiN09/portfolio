import { useEffect, useRef } from 'react'

export function BrandFlyer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flyer = ref.current
    if (!flyer) return

    let raf = 0
    let tries = 0
    let ready = false
    let lastKey = ''
    let heroEl: HTMLElement | null = null
    let nav: HTMLElement | null = null
    let restX = 0
    let restY = 0
    let restH = 1
    let navX = 0
    let navY = 0
    let navH = 1
    let sections: HTMLElement[] = []

    const measure = () => {
      if (!heroEl || !nav) return
      const hr = heroEl.getBoundingClientRect()
      restX = hr.x
      restY = hr.y + window.scrollY
      restH = hr.height || 1
      const nr = nav.getBoundingClientRect()
      navX = nr.x
      navY = nr.y
      navH = nr.height || 1
      ready = true
    }

    const loop = () => {
      if (ready && heroEl && nav) {
        const y = window.scrollY
        const p = Math.min(1, Math.max(0, y / (window.innerHeight * 0.55)))
        const e = p * p * (3 - 2 * p)
        const s = 1 + (navH / restH - 1) * e
        const x = restX + (navX - restX) * e
        const fy = restY + (navY - restY) * e

        let theme = 'dark'
        for (const sec of sections) {
          const r = sec.getBoundingClientRect()
          if (r.top <= 90 && r.bottom > 90) {
            theme = sec.dataset.header || 'dark'
            break
          }
        }

        const key = `${x.toFixed(2)}|${fy.toFixed(2)}|${s.toFixed(4)}|${p > 0 ? 1 : 0}|${theme}`
        if (key !== lastKey) {
          lastKey = key
          flyer.style.transform = `translate3d(${x}px, ${fy}px, 0) scale(${s})`
          flyer.style.opacity = p > 0 ? '1' : '0'
          heroEl.style.opacity = p <= 0 ? '1' : '0'
          if (flyer.dataset.header !== theme) flyer.dataset.header = theme
        }
      }
      raf = requestAnimationFrame(loop)
    }

    const init = () => {
      heroEl = document.querySelector<HTMLElement>('.hero__brand')
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter((el) => {
        if (el.closest('.hero') || el.closest('.brand-flyer') || el.closest('.marks') || el.closest('footer')) return false
        const t = (el.textContent || '').trim()
        return t.includes('xCaptaiN09') && t.length < 24
      })
      const found = candidates[0] || null
      if (!heroEl || !found) {
        tries += 1
        if (tries < 60) raf = requestAnimationFrame(init)
        return
      }
      nav = found
      nav.style.opacity = '0'
      nav.style.pointerEvents = 'none'
      sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-header]'))
      measure()
      window.addEventListener('resize', measure)
      loop()
    }

    init()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      if (nav) {
        nav.style.opacity = ''
        nav.style.pointerEvents = ''
      }
    }
  }, [])

  return (
    <div className="brand-flyer" ref={ref} aria-hidden="true">
      <span className="dot" />
      <span>xCaptaiN09</span>
    </div>
  )
}
