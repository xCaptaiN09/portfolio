import { PortraitPlate } from './PortraitPlate'
import { ScrollRing } from './ScrollRing'

export function Hero() {
  return (
    <section className="section hero">
      <PortraitPlate />

      <div>
        <div className="hero__topline">ANDROID KERNEL DEVELOPER / AI & DATA SCIENCE STUDENT</div>

        <h1 className="hero__title">
          <span className="mask-line"><span>Muhammed</span></span>
          <span className="mask-line"><span>Dilshad A</span></span>
        </h1>

        <div className="hero__meta">
          <div>
            Kozhikode, Kerala, India<br />
            GitHub: xCaptaiN09
          </div>

          <ScrollRing />

          <div className="hero__role">
            Systems/kernel developer first.<br />
            Web/AI developer second.
          </div>
        </div>
      </div>
    </section>
  )
}
