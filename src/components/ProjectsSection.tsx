import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { clamp } from '../utils/clamp'
import { GithubOrb } from './GithubOrb'

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [panelX, setPanelX] = useState(-100)
  const [trackX, setTrackX] = useState(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      const track = trackRef.current
      if (!el || !track) return

      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / scrollable)

      const enter = Math.min(1, p / 0.3)
      const eased = enter < 0.5 ? 4 * enter * enter * enter : 1 - Math.pow(-2 * enter + 2, 3) / 2
      setPanelX((1 - eased) * 110)
      document.documentElement.style.setProperty('--projects-enter', String(eased))

      const tp = clamp((p - 0.30) / 0.70)
      const maxMove = Math.max(0, track.scrollWidth - window.innerWidth)
      setTrackX(-tp * maxMove)
      setIndex(Math.max(0, Math.min(projects.length - 1, Math.round(tp * (projects.length - 1)))))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const current = projects[index]

  return (
    <section ref={sectionRef} id="projects" className="projects">
      <div className="projects__sticky">
        <div className="projects__panel" style={{ transform: `translate3d(${panelX}%, 0, 0)` }}>
          <div className="projects__orb">
            <GithubOrb />
          </div>

          <div className="projects__head">
            <div>
              <div className="section-label projects__label">[ FEATURED WORK ]</div>
              <h2>Selected Builds</h2>
            </div>

            <div className="projects__info">
              <div className="projects__count">
                {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </div>
              <p className="projects__desc" key={current.name}>{current.desc}</p>
              <div className="projects__meta">
                {current.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="project-track" ref={trackRef} style={{ transform: `translate3d(${trackX}px, 0, 0)` }}>
            {projects.map((project, idx) => (
              <article className="project-panel" key={project.name}>
                <span className="project-panel__num">({String(idx + 1).padStart(2, '0')})</span>
                <h3>{project.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
