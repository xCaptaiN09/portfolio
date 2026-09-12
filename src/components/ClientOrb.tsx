import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2

interface Dot {
  x: number
  y: number
  z: number
  r: number
  v: number
  a?: number
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

const rscale = (S: number) => Math.pow(S / 300, 0.6)

function paint(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  accent: [number, number, number] | null,
  sat: number,
  rMin: number,
) {
  dots.sort((a, b) => a.z - b.z)
  for (const d of dots) {
    const al = d.a ?? 1
    if (al < 0.02) continue
    const v = Math.max(0, Math.min(1, d.v))
    const g = v * 255
    let r = g
    let gg = g
    let b = g
    if (accent && sat) {
      const lift = Math.min(1, v * 1.12)
      r = g * (1 - sat) + accent[0] * lift * sat
      gg = g * (1 - sat) + accent[1] * lift * sat
      b = g * (1 - sat) + accent[2] * lift * sat
    }
    if (v > 0.85) {
      const w = ((v - 0.85) / 0.15) * 0.45
      r += (255 - r) * w
      gg += (255 - gg) * w
      b += (255 - b) * w
    }
    ctx.fillStyle = `rgba(${r | 0},${gg | 0},${b | 0},${al})`
    ctx.beginPath()
    ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, TAU)
    ctx.fill()
  }
}

function drawReact(ctx: CanvasRenderingContext2D, S: number, t: number, accent: [number, number, number]) {
  const cx = S / 2
  const cy = S / 2
  const R = (S / 2) * 0.92
  const rs = rscale(S)
  const p = proj(0.1 * Math.sin(t * 0.4), 0.12 * Math.sin(t * 0.33), cx, cy, R)
  const spin = t * 0.26
  const rx = 0.94
  const ry = 0.345
  const per = 56
  const dots: Dot[] = []
  for (let k = 0; k < 3; k++) {
    const a0 = spin + (k * Math.PI) / 3
    const ca = Math.cos(a0)
    const sa = Math.sin(a0)
    const ring = (th: number): [number, number] => {
      const ex = Math.cos(th) * rx
      const ey = Math.sin(th) * ry
      return [ex * ca - ey * sa, ex * sa + ey * ca]
    }
    for (let i = 0; i < per; i++) {
      const th = (i / per) * TAU
      const [gx, gy] = ring(th)
      const [x, y, z] = p(gx, gy, 0)
      const ph = (((th / TAU - t * 0.19 - k * 0.33) % 1) + 1) % 1
      const crest = Math.exp(-Math.pow(ph - 0.5, 2) / 0.022)
      dots.push({ x, y, z: z + crest * 0.01, r: (0.95 + 0.6 * crest) * rs, v: 0.66 + 0.3 * crest, a: 0.85 + 0.15 * crest })
    }
    const eth = t * (k % 2 ? -1.15 : 1.3) + k * 2.1
    const [ex2, ey2] = ring(eth)
    const [x2, y2, z2] = p(ex2, ey2, 0.04)
    dots.push({ x: x2, y: y2, z: z2 + 0.02, r: 1.9 * rs, v: 0.95 })
  }
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU
    const rr = i ? 0.085 : 0
    const [x, y, z] = p(Math.cos(a) * rr, Math.sin(a) * rr, 0.05)
    dots.push({ x, y, z: z + 0.03, r: 1.5 * rs, v: 0.9 })
  }
  paint(ctx, dots, accent, 0.88, 0.3)
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      drawReact(ctx, size, t, [11, 11, 12])
    }

    if (reduce) {
      frame(1.2)
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
