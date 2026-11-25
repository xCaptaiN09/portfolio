import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { GithubOrb } from './GithubOrb'
import { clamp } from '../utils/clamp'

const pinnedQuery = '(min-height: 620px) and (prefers-reduced-motion: no-preference)'
const entranceQuery = '(min-width: 901px) and (min-height: 680px) and (pointer: fine)'

export function ProjectsSection({ scrollTo }: { scrollTo: (top: number) => void }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = section.current
    const panel = stage.current
    const track = strip.current
    if (!el || !panel || !track) return
    const pinned = window.matchMedia(pinnedQuery)
    const entrance = window.matchMedia(entranceQuery)
    let frame = 0
    const update = () => {
      frame = 0
      if (!pinned.matches) {
        el.style.removeProperty('--arrival')
        return
      }
      const { top, height } = el.getBoundingClientRect()
      const viewport = panel.offsetHeight
      const entry = entrance.matches ? viewport / 2 : 0
      if (entry) {
        const arrival = clamp(-top / entry)
        const offset = Math.pow(1 - arrival, 2)
        el.style.setProperty('--arrival', `${offset * 108}%`)
      }

      const travel = Math.max(1, height - viewport - entry)
      const position = clamp((-top - entry) / travel) * (projects.length - 1)
      const index = Math.floor(position)
      const transition = clamp((position - index - 0.12) / 0.76)
      const eased = transition * transition * (3 - 2 * transition)
      track.scrollLeft = (index + eased) * track.clientWidth
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    pinned.addEventListener('change', schedule)
    entrance.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      pinned.removeEventListener('change', schedule)
      entrance.removeEventListener('change', schedule)
    }
  }, [])

  function select(index: number) {
    const el = section.current
    const panel = stage.current
    const track = strip.current
    if (!el || !panel || !track || index < 0 || index >= projects.length) return
    if (window.matchMedia(pinnedQuery).matches) {
      const top = window.scrollY + el.getBoundingClientRect().top
      const viewport = panel.offsetHeight
      const entry = window.matchMedia(entranceQuery).matches ? viewport / 2 : 0
      const travel = el.offsetHeight - viewport - entry
      scrollTo(top + entry + index / (projects.length - 1) * travel)
    } else {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollTo({ left: index * track.clientWidth, behavior: reduce ? 'instant' : 'smooth' })
    }
  }

  return (
    <section ref={section} id="projects" className="builds" aria-labelledby="builds-title">
      <div className="builds__stage" ref={stage}>
        <div className="builds__paper">
          <div className="builds__header">
            <h2 id="builds-title">Selected builds</h2>
            <div className="builds__orb" aria-hidden="true"><GithubOrb /></div>
          </div>
          <div className="builds__strip" ref={strip} onScroll={(event) => {
            const track = event.currentTarget
            setActive(Math.min(projects.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))))
          }}>
            {projects.map((project, index) => (
              <article key={project.name} className="builds__slide" aria-hidden={index !== active}>
                <h3>{project.name}</h3>
                <div className="builds__details">
                  <p>{project.desc}</p>
                  <ul>{project.meta.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  <a href={project.url} tabIndex={index === active ? 0 : -1}>
                    {project.linkLabel || 'View repository'}<span aria-hidden="true"> ↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="builds__controls">
            <div className="builds__progress">
              <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              <span className="builds__hint">Scroll to browse</span>
            </div>
            <div className="builds__buttons">
              <button type="button" aria-label="Previous project" aria-disabled={active === 0} onClick={() => select(active - 1)}>←</button>
              <button type="button" aria-label="Next project" aria-disabled={active === projects.length - 1} onClick={() => select(active + 1)}>→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
