import { useEffect, useRef } from 'react'

const GITHUB_PATH =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const TAU = Math.PI * 2
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

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
    const v = clamp01(d.v)
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

let cachedPts: Array<[number, number]> | null = null

function githubPts(): Array<[number, number]> {
  if (cachedPts) return cachedPts
  const px = 200
  const c = document.createElement('canvas')
  c.width = c.height = px
  const g = c.getContext('2d')
  if (!g) return []
  g.setTransform(px / 24, 0, 0, px / 24, 0, 0)
  g.fillStyle = '#fff'
  g.fill(new Path2D(GITHUB_PATH))
  const img = g.getImageData(0, 0, px, px).data
  let x0 = px
  let x1 = -1
  let y0 = px
  let y1 = -1
  for (let j = 0; j < px; j++) {
    for (let i = 0; i < px; i++) {
      if (img[(j * px + i) * 4 + 3] > 128) {
        if (i < x0) x0 = i
        if (i > x1) x1 = i
        if (j < y0) y0 = j
        if (j > y1) y1 = j
      }
    }
  }
  const mx = (x0 + x1) / 2
  const my = (y0 + y1) / 2
  const m = Math.max(x1 - x0, y1 - y0)
  const N = 30
  const step = m / N
  const pts: Array<[number, number]> = []
  for (let y = y0; y <= y1; y += step) {
    for (let x = x0; x <= x1; x += step) {
      const ix = Math.round(x)
      const iy = Math.round(y)
      if (ix < 0 || iy < 0 || ix >= px || iy >= px) continue
      if (img[(iy * px + ix) * 4 + 3] > 128) pts.push([(x - mx) / (m / 2), (y - my) / (m / 2)])
    }
  }
  cachedPts = pts
  return pts
}

export function GithubOrb() {
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

    const pts = githubPts()
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
      const rs = Math.pow(size / 300, 0.6)
      const p = proj(0.15 * Math.sin(t * 0.4), 0.13 * Math.sin(t * 0.31), size / 2, size / 2, (size / 2) * 0.88)
      const wave = ((((t * 0.4) % 1) + 1) % 1) * 2.4 - 1.2
      const dots: Dot[] = pts.map(([gx, gy]) => {
        const crest = Math.exp(-Math.pow((gx - gy) * 0.5 - wave, 2) / 0.05)
        const [x, y, z] = p(gx, -gy, 0)
        const dep = (z + 1) / 2
        return { x, y, z, r: (0.78 + 0.72 * dep + 0.45 * crest) * rs, v: 0.62 + 0.15 * dep + 0.3 * crest }
      })
      paint(ctx, dots, [11, 11, 12], 0.9, 0.3)
    }

    if (reduce) {
      frame(1.1)
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

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}
