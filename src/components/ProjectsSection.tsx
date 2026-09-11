import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { clamp } from '../utils/clamp'
export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [x, setX] = useState(0)
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
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return (
    <section ref={sectionRef} id="projects" className="projects">
      <div className="projects__sticky">
        <div className="section-label">[ FEATURED WORK ]</div>
        <h2 className="pull-words">Selected<br />Builds</h2>
        <div className="project-track" style={{ transform: `translate3d(${x}px, 0, 0)` }}>
          {projects.map((project, index) => (
            <article className="project-card" key={project.name} data-num={String(index + 1).padStart(2, '0')}>
              <div className="project-card__top">
                <div className="project-card__index">({String(index + 1).padStart(2, '0')})</div>
                <span className="project-card__arrow">↗</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <div className="project-card__meta">{project.meta.map((item) => (<span key={item}>{item}</span>))}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}