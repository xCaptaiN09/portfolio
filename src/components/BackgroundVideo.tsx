import { useEffect, useState } from 'react'

type BgMode = 'video' | 'anim' | 'seq' | 'still'

function getMode(): BgMode {
  const param = new URLSearchParams(window.location.search).get('bg')
  if (param === 'video' || param === 'anim' || param === 'seq' || param === 'still') return param
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still'
  return window.matchMedia('(pointer: coarse)').matches ? 'anim' : 'video'
}

export function BackgroundVideo() {
  const [mode] = useState<BgMode>(getMode)
  const [frames, setFrames] = useState<string[]>([])
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    if (mode !== 'seq') return
    let alive = true

    fetch(`${import.meta.env.BASE_URL}frames.json`)
      .then((response) => response.json())
      .then((list: string[]) => {
        if (!alive) return
        const urls = list.map((file) => `${import.meta.env.BASE_URL}frames/${file}`)
        return Promise.all(
          urls.map((url) => {
            const img = new Image()
            img.src = url
            return img.decode().catch(() => undefined)
          }),
        ).then(() => {
          if (alive) setFrames(urls)
        })
      })
      .catch(() => undefined)

    return () => {
      alive = false
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'seq' || frames.length === 0) return
    const id = window.setInterval(() => setFrameIndex((i) => (i + 1) % frames.length), 1000 / 6)
    return () => window.clearInterval(id)
  }, [mode, frames])

  return (
    <div className="bg-video" aria-hidden="true">
      {mode === 'video' && (
        <video autoPlay muted loop playsInline disablePictureInPicture preload="metadata">
          <source src={`${import.meta.env.BASE_URL}bg.mp4`} type="video/mp4" />
        </video>
      )}
      {mode === 'anim' && <img className="bg-still" src={`${import.meta.env.BASE_URL}bg-anim.webp`} alt="" />}
      {mode === 'still' && (
        <img className="bg-still bg-still--kenburns" src={`${import.meta.env.BASE_URL}bg-poster.webp`} alt="" />
      )}
      <div className="bg-vignette" />
    </div>
  )
}
