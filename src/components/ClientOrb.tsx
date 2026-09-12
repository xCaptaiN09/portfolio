import { useEffect, useRef } from 'react'

const CHEV: Array<[number, number]> = [[-0.3, -0.34], [0.07, 0], [-0.3, 0.34]]
const BAR: Array<[number, number]> = [[0.11, 0.3], [0.43, 0.3]]

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const l2 = dx * dx + dy * dy
  let u = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0
  u = u < 0 ? 0 : u > 1 ? 1 : u
  return Math.hypot(px - (ax + dx * u), py - (ay + dy * u))
}

function proj(yaw: number, tilt: number, cx: number, cy: number, s: number) {
  const st = Math.sin(tilt)
  const ct = Math.cos(tilt)
  const sy = Math.sin(yaw)
  const cyw = Math.cos(yaw)
  return (x: number, y: number, z: number): [number, number, number] => {
    const px = x * cyw + z * sy
    const pz = -x * sy + z * cyw
    const py = y * ct - pz * st
    const z2 = y * st + pz * ct
    return [cx + px * s, cy - py * s, z2]
  }
}

export function ClientOrb() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const parent = canvas.parentElement
    const size = parent ? parent.clientWidth : 140
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(size * dpr)
    canvas.height = Math.round(size * dpr)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = true
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    })
    io.observe(canvas)

    const frame = (t: number) => {
      const S = size
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, S, S)
      const cx = S / 2
      const cy = S / 2
      const R = (S / 2) * 0.92
      const rs = Math.pow(S / 300, 0.6) * 1.7
      const p = proj(0.13 * Math.sin(t * 0.42), 0.13 * Math.sin(t * 0.31), cx, cy, R)
      const spin = t * 0.2
      const amp = 0.1 + 0.03 * Math.sin(t * 1.15)
      const rad = (th: number) => 0.76 * (1 + amp * Math.cos(6 * (th - spin)))
      const gap = 0.112
      const clr = 0.108
      const chevD = (x: number, y: number) =>
        Math.min(
          segDist(x, y, CHEV[0][0], CHEV[0][1], CHEV[1][0], CHEV[1][1]),
          segDist(x, y, CHEV[1][0], CHEV[1][1], CHEV[2][0], CHEV[2][1]),
        )
      const barD = (x: number, y: number) => segDist(x, y, BAR[0][0], BAR[0][1], BAR[1][0], BAR[1][1])

      for (let gy = -1; gy <= 1; gy += gap) {
        for (let gx = -1; gx <= 1; gx += gap) {
          const d = Math.hypot(gx, gy)
          if (!d || d > rad(Math.atan2(gy, gx))) continue
          if (chevD(gx, gy) < clr || barD(gx, gy) < clr * 0.92) continue
          const [x, y, z] = p(gx, -gy, 0)
          const dep = (z + 1) / 2
          ctx.fillStyle = `rgba(11, 11, 12, ${0.16 + 0.24 * dep})`
          ctx.beginPath()
          ctx.arc(x, y, Math.max(0.4, (0.9 + 1.05 * dep) * rs), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const ph = (((t / 1.15) % 1) + 1) % 1
      const blink = ph < 0.58 ? 1 : ph < 0.68 ? 1 - (ph - 0.58) / 0.1 : ph < 0.9 ? 0 : (ph - 0.9) / 0.1
      const step = 0.052
      const glyph = (ax: number, ay: number, bx: number, by: number, alpha: number) => {
        if (alpha < 0.02) return
        const L = Math.hypot(bx - ax, by - ay)
        const n = Math.max(2, Math.round(L / step))
        for (let i = 0; i <= n; i++) {
          const f = i / n
          const gx = ax + (bx - ax) * f
          const gy = ay + (by - ay) * f
          const [x, y, z] = p(gx, -gy, 0.06)
          const dep = (z + 1) / 2
          ctx.fillStyle = `rgba(11, 11, 12, ${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, Math.max(0.6, (1.15 + 1.1 * dep) * rs), 0, Math.PI * 2)
          ctx.fill()
        }
      }
      glyph(CHEV[0][0], CHEV[0][1], CHEV[1][0], CHEV[1][1], 1)
      glyph(CHEV[1][0], CHEV[1][1], CHEV[2][0], CHEV[2][1], 1)
      glyph(BAR[0][0], BAR[0][1], BAR[1][0], BAR[1][1], blink)
    }

    if (reduce) {
      frame(0.4)
      return () => io.disconnect()
    }
    const loop = () => {
      if (visible) frame(performance.now() / 1000)
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div className="client-orb" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
