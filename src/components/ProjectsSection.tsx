import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { clamp } from '../utils/clamp'

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      const track = trackRef.current
      if (!el || !track) return

      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      const progress = clamp(-rect.top / scrollable)
      const maxMove = Math.max(0, track.scrollWidth - window.innerWidth)

      setX(-progress * maxMove)
      setIndex(Math.max(0, Math.min(projects.length - 1, Math.round(progress * (projects.length - 1)))))
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
        <div className="projects__head">
          <div>
            <div className="section-label">[ FEATURED WORK ]</div>
            <h2 className="pull-words">Selected<br />Builds</h2>
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

        <div className="project-track" ref={trackRef} style={{ transform: `translate3d(${x}px, 0, 0)` }}>
          {projects.map((project, idx) => (
            <article className="project-panel" key={project.name}>
              <span className="project-panel__num">({String(idx + 1).padStart(2, '0')})</span>
              <h3>{project.name}</h3>
              <div className="project-panel__tags">
                {project.meta.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
