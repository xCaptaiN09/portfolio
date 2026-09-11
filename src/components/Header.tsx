import { NavLinks } from './NavLinks'
export function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#top" aria-label="xCaptaiN09 home"><span className="logo__mark" /><span>xCaptaiN09</span></a>
      <NavLinks />
      <a className="header-cta" href="https://github.com/xCaptaiN09" target="_blank" rel="noreferrer">
        <span className="cta-roll"><span className="cta-roll__line">GitHub ↗</span><span className="cta-roll__line">xCaptaiN09 ↗</span></span>
      </a>
    </header>
  )
}