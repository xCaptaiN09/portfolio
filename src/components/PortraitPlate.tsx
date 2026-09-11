import { useEffect, useRef } from 'react'

export function PortraitPlate() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (!ref.current) return
      ref.current.style.transform = `translate3d(0, ${window.scrollY * -0.06}px, 0)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="hero-portrait" ref={ref}>
      <div className="hero-portrait__plate">
        <img src={`${import.meta.env.BASE_URL}portrait.webp`} alt="Muhammed Dilshad A" />
      </div>
      <div className="hero-portrait__caption">// Muhammed Dilshad — Kozhikode, IN</div>
    </div>
  )
}
