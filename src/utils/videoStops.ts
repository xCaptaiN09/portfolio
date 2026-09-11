import { clamp } from './clamp'
const stops: Array<[number, number]> = []
export function buildVideoStops() {
  const vh = window.innerHeight
  const about = document.getElementById('about')
  const projects = document.getElementById('projects')
  const contact = document.getElementById('contact')
  const a = about ? about.offsetTop : vh
  const p = projects ? projects.offsetTop : vh * 3
  const c = contact ? contact.offsetTop : vh * 5
  stops.length = 0
  stops.push([0, 0.85], [Math.max(0, a - vh * 0.85), 0.85], [Math.max(0, a - vh * 0.25), 0.2], [Math.max(0, p - vh * 0.85), 0.2], [Math.max(0, p - vh * 0.3), 0.38], [Math.max(0, c - vh * 0.85), 0.38], [Math.max(0, c - vh * 0.3), 0.68], [Number.POSITIVE_INFINITY, 0.68])
}
export function videoOpacityAt(y: number): number {
  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, v0] = stops[i]
    const [x1, v1] = stops[i + 1]
    if (y <= x1) {
      if (x1 <= x0) return v1
      const t = clamp((y - x0) / (x1 - x0))
      return v0 + (v1 - v0) * t
    }
  }
  return stops[stops.length - 1][1]
}