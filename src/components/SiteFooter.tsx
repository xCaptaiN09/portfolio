import { useEffect, useRef } from 'react'
import { IstClock } from './IstClock'

export function SiteFooter() {
  const logoRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const box = logoRef.current
    const img = imgRef.current
    if (!box || !img) return

    const measure = (image: HTMLImageElement) => {
      const w = image.naturalWidth
      const h = image.naturalHeight
      if (!w || !h) return
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(image, 0, 0)
      const data = ctx.getImageData(0, 0, w, h).data
      let x0 = w
      let x1 = -1
      let y0 = h
      let y1 = -1
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 10) {
            if (x < x0) x0 = x
            if (x > x1) x1 = x
            if (y < y0) y0 = y
            if (y > y1) y1 = y
          }
        }
      }
      if (x1 < 0 || y1 < 0) return
      const bw = x1 - x0 + 1
      const bh = y1 - y0 + 1
      const boxW = box.clientWidth || 140
      const scale = boxW / bw
      box.style.aspectRatio = `${bw} / ${bh}`
      img.style.width = `${w * scale}px`
      img.style.left = `${-x0 * scale}px`
      img.style.top = `${-y0 * scale}px`
    }

    const image = new Image()
    image.onload = () => measure(image)
    image.src = `${import.meta.env.BASE_URL}xCaptain-logo.png`
  }, [])

  return (
    <footer className="site-footer">
      <div className="footer-socials">
        <a href="https://github.com/xCaptaiN09" target="_blank" rel="noreferrer">{'{GitHub'}</a>
        <a href="https://linkedin.com/in/muhammed-dilshad-a-809311326" target="_blank" rel="noreferrer">{'{LinkedIn'}</a>
        <a href="mailto:hello.dilshad.in@gmail.com">{'{Mail'}</a>
      </div>

      <div className="footer-right">
        <div className="footer-cols">
          <span><strong>Contact us:</strong></span>
          <a href="mailto:hello.dilshad.in@gmail.com">hello.dilshad.in@gmail.com</a>
          <a href="tel:+919995709955">+91 9995709955</a>
          <span>Kozhikode, Kerala, India</span>
          <span>GitHub / xCaptaiN09</span>
        </div>

        <div className="footer-logo" ref={logoRef}>
          <img ref={imgRef} src={`${import.meta.env.BASE_URL}xCaptain-logo.png`} alt="xCaptaiN09" />
        </div>
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
