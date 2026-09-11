import { IstClock } from './IstClock'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-socials">
        <a href="https://github.com/xCaptaiN09" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/muhammed-dilshad-a-809311326" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="mailto:hello.dilshad.in@gmail.com">Mail</a>
      </div>

      <div className="footer-cols">
        <span><strong>Contact us:</strong></span>
        <a href="mailto:hello.dilshad.in@gmail.com">hello.dilshad.in@gmail.com</a>
        <a href="tel:+919995709955">+91 9995709955</a>
        <span>Kozhikode, Kerala, India</span>
        <span>GitHub / xCaptaiN09</span>
      </div>

      <div className="footer-meta">
        <span>xCaptaiN09 — Systems. Kernels. Internet.</span>
        <span>KL_IN • <IstClock /></span>
        <span>From Kozhikode to everywhere</span>
        <span>© 2026 Muhammed Dilshad A</span>
      </div>
    </footer>
  )
}
