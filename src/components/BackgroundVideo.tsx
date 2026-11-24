import { useEffect, useRef } from 'react'

type BgMode = 'video' | 'anim' | 'still'

function getMode(): BgMode {
  const param = new URLSearchParams(window.location.search).get('bg')
  if (param === 'video' || param === 'anim' || param === 'still') return param
  return window.matchMedia('(pointer: coarse)').matches ? 'anim' : 'video'
}

export function BackgroundVideo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const mode = reduced ? 'still' : getMode()
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = video.current
    if (!el) return
    if (active) void el.play().catch(() => {})
    else el.pause()
  }, [active, mode])

  return (
    <div className="bg-video" hidden={!active} aria-hidden="true">
      {mode === 'video' && (
        <video ref={video} muted loop playsInline disablePictureInPicture preload="none" poster={`${import.meta.env.BASE_URL}bg-poster.webp`}>
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
