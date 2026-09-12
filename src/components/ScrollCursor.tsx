import { useEffect, useRef } from 'react'

export function ScrollCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const updateMode = () => {
      const marks = document.querySelector<HTMLElement>('.marks')
      const projects = document.querySelector<HTMLElement>('.projects')
      if (!marks || !projects) return
      const mid = window.innerHeight * 0.5
      const active =
        marks.getBoundingClientRect().top <= mid &&
        projects.getBoundingClientRect().bottom >= mid
      const mode = active ? 'scroll' : 'default'
      if (document.body.dataset.cursor !== mode) document.body.dataset.cursor = mode

      const panel = document.querySelector<HTMLElement>('.projects__panel')
      let invert = ''
      if (panel) {
        const r = panel.getBoundingClientRect()
        if (tx >= r.left && tx <= r.right && ty >= r.top && ty <= r.bottom) invert = 'invert'
      }
      if ((document.body.dataset.cursorBox || '') !== invert) {
        if (invert) document.body.dataset.cursorBox = invert
        else delete document.body.dataset.cursorBox
      }
    }

    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      updateMode()
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    updateMode()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
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
