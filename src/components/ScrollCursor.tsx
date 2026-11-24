import { useEffect, useRef } from 'react'

export function ScrollCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const marks = document.querySelector<HTMLElement>('.marks')
    if (!marks) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      schedule()
    }

    const updateMode = () => {
      const mid = window.innerHeight * 0.5
      const rect = marks.getBoundingClientRect()
      const active = rect.top <= mid && rect.bottom >= mid &&
        !document.elementFromPoint(tx, ty)?.closest('a, button, #projects')
      const mode = active ? 'scroll' : 'default'
      if (document.body.dataset.cursor !== mode) document.body.dataset.cursor = mode
    }

    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      updateMode()
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(loop) : 0
    }

    const schedule = () => { if (!raf) raf = requestAnimationFrame(loop) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    updateMode()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onMove)
      delete document.body.dataset.cursor
      delete document.body.dataset.cursorBox
    }
  }, [])

  return (
    <div className="scroll-cursor" ref={ref} aria-hidden="true">
      <span className="scroll-cursor__box">Scroll</span>
    </div>
  )
}
