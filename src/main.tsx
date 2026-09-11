import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const FONTS: Array<[string, 'normal' | 'italic', string, string]> = [
  ['Archivo Black', 'normal', '400', 'archivo-black-latin-400-normal.woff2'],
  ['Geist', 'normal', '400', 'geist-latin-400-normal.woff2'],
  ['Geist', 'normal', '500', 'geist-latin-500-normal.woff2'],
  ['Geist', 'normal', '700', 'geist-latin-700-normal.woff2'],
  ['Geist Mono', 'normal', '400', 'geist-mono-latin-400-normal.woff2'],
  ['Geist Mono', 'normal', '500', 'geist-mono-latin-500-normal.woff2'],
  ['Geist Mono', 'normal', '700', 'geist-mono-latin-700-normal.woff2'],
  ['Instrument Serif', 'normal', '400', 'instrument-serif-latin-400-normal.woff2'],
  ['Instrument Serif', 'italic', '400', 'instrument-serif-latin-400-italic.woff2'],
]

for (const [family, style, weight, file] of FONTS) {
  const face = new FontFace(family, `url(${import.meta.env.BASE_URL}fonts/${file})`, {
    style,
    weight,
  })
  face.load().then((loaded) => document.fonts.add(loaded)).catch(() => undefined)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
