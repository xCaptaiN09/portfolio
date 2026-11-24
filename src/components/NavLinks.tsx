import { useEffect, useRef } from 'react'

const links = [
  ['#about', 'About'], ['#skills', 'Skills'], ['#projects', 'Projects'],
  ['#client', 'Client work'], ['#contact', 'Contact'],
]

export function NavLinks() {
  const menu = useRef<HTMLDetailsElement>(null)
  const toggle = useRef<HTMLElement>(null)

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.open = false
        toggle.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <>
      <nav className="nav-links" aria-label="Primary">
        {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <details className="mobile-menu" ref={menu}>
        <summary ref={toggle}>Menu</summary>
        <nav aria-label="Primary">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => { if (menu.current) menu.current.open = false }}>{label}</a>
          ))}
        </nav>
      </details>
    </>
  )
}
