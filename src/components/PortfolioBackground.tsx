import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'

import { BackgroundVideo } from './BackgroundVideo'

const Particles = lazy(() => import('./WebGLLayer'))

class ParticleFallback extends Component<{ children: ReactNode }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export function PortfolioBackground() {
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const visible = new Set<Element>()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const show = visible.size > 0 && !document.hidden
      setReduced(motion.matches)
      if (show) setLoaded(true)
      setActive(show)
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      update()
    }, { threshold: [0, 0.001] })
    document.querySelectorAll('#about, #contact').forEach(el => observer.observe(el))
    motion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return (
    <>
      {loaded && <BackgroundVideo active={active} reduced={reduced} />}
      {loaded && !reduced && (
        <ParticleFallback><Suspense fallback={null}>
          <div hidden={!active} aria-hidden="true"><Particles active={active} /></div>
        </Suspense></ParticleFallback>
      )}
    </>
  )
}
