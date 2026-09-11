import { useState, type MouseEvent as ReactMouseEvent } from 'react'
export function NavLinks() {
  const [indicator, setIndicator] = useState({ x: 0, w: 0, on: false })
  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth, on: true })
  }
  return (
    <nav className="nav-links" aria-label="Primary" onMouseLeave={() => setIndicator((prev) => ({ ...prev, on: false }))}>
      <span className="nav-indicator" style={{ transform: `translate3d(${indicator.x}px, -50%, 0)`, width: indicator.w, opacity: indicator.on ? 1 : 0 }} />
      <a href="#about" onMouseEnter={move}>About</a>
      <a href="#skills" onMouseEnter={move}>Skills</a>
      <a href="#projects" onMouseEnter={move}>Projects</a>
      <a href="#client" onMouseEnter={move}>Client</a>
      <a href="#contact" onMouseEnter={move}>Contact</a>
    </nav>
  )
}