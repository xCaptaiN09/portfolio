import { PortraitPlate } from './PortraitPlate'

const HERO_SPECS = [
  'RMX3031',
  'MT6893 / cupida',
  'Linux 4.19',
  'KernelSU-Next',
  'SuSFS',
  'AOSP / Lineage / ColorOS',
]

const HERO_MARQUEE = [
  'Muhammed Dilshad',
  'Android Kernel Developer',
  'MT6893 / cupida',
  'Linux 4.19',
  'KernelSU-Next',
  'SuSFS',
  'Open Source',
]

export function Hero() {
  return (
    <section className="section hero hero--dark">
      <div className="hero__mountain" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}mountain.webp`} alt="" />
      </div>

      <PortraitPlate />

      <div className="hero__core">
        <div className="hero__tag">( About me )</div>

        <h1 className="hero__title">
          <span className="mask-line"><span>Muhammed</span></span>
          <span className="mask-line"><span>Dilshad A</span></span>
        </h1>

        <div className="hero__topline">ANDROID KERNEL DEVELOPER / AI & DATA SCIENCE STUDENT</div>

        <div className="hero__role">
          Systems/kernel developer first. Web/AI developer second.<br />
          Kozhikode, IN — GitHub: xCaptaiN09
        </div>
      </div>

      <div className="hero__specs">
        {HERO_SPECS.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="marquee marquee--hero marquee--reverse" aria-hidden="true">
        <div className="marquee__track">
          <div className="marquee__group">
            {HERO_MARQUEE.map((item) => (
              <span key={item}>
                {item}
                <span className="marquee__sep">©</span>
              </span>
            ))}
          </div>
          <div className="marquee__group">
            {HERO_MARQUEE.map((item) => (
              <span key={`${item}-dup`}>
                {item}
                <span className="marquee__sep">©</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
