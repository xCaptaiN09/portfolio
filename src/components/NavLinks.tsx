import { useState, type MouseEvent as ReactMouseEvent } from 'react'

const LINKS = [
  { href: '#about', label: 'About', sup: '*' },
  { href: '#skills', label: 'Skills', sup: '//' },
  { href: '#projects', label: 'Projects', sup: '#' },
  { href: '#client', label: 'Client', sup: '+' },
  { href: '#contact', label: 'Contact', sup: '↗' },
]

export function NavLinks() {
  const [indicator, setIndicator] = useState({ x: 0, w: 0, on: false })

  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth, on: true })
  }

  return (
    <nav
      className="nav-links"
      aria-label="Primary"
      onMouseLeave={() => setIndicator((prev) => ({ ...prev, on: false }))}
    >
      <span
        className="nav-indicator"
        style={{
          transform: `translate3d(${indicator.x}px, -50%, 0)`,
          width: indicator.w,
          opacity: indicator.on ? 1 : 0,
        }}
      />
      {LINKS.map((link) => (
        <a key={link.href} href={link.href} onMouseEnter={move}>
          {link.label}
          <span className="nav-sup">{link.sup}</span>
        </a>
      ))}
    </nav>
  )
}
