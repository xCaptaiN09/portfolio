import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { clamp } from '../utils/clamp'

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [x, setX] = useState(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      const progress = clamp(-rect.top / scrollable)
      const cardWidth = Math.min(620, window.innerWidth * 0.82)
      const maxMove = Math.max(0, projects.length * cardWidth + 22 * projects.length - window.innerWidth + 160)

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

  return (
    <section ref={sectionRef} id="projects" className="projects">
      <div className="projects__sticky">
        <div className="section-label">[ FEATURED WORK ]</div>
        <div className="projects__count">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </div>
        <h2 className="pull-words">Selected<br />Builds</h2>

        <div className="project-track" style={{ transform: `translate3d(${x}px, 0, 0)` }}>
          {projects.map((project, idx) => (
            <article className="project-card" key={project.name} data-num={String(idx + 1).padStart(2, '0')}>
              <div className="project-card__top">
                <div className="project-card__index">({String(idx + 1).padStart(2, '0')})</div>
                <span className="project-card__arrow">↗</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <div className="project-card__meta">
                {project.meta.map((item) => (
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
