import { useState } from 'react'

type BgMode = 'video' | 'anim' | 'still'

function getMode(): BgMode {
  const param = new URLSearchParams(window.location.search).get('bg')
  if (param === 'video' || param === 'anim' || param === 'still') return param
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still'
  return window.matchMedia('(pointer: coarse)').matches ? 'anim' : 'video'
}

export function BackgroundVideo() {
  const [mode] = useState<BgMode>(getMode)

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
