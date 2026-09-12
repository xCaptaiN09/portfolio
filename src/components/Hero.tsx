import { PortraitPlate } from './PortraitPlate'

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
        <img className="hero__mountain__base" src={`${import.meta.env.BASE_URL}mountain.webp`} alt="" />
        <img className="hero__mountain__edge" src={`${import.meta.env.BASE_URL}mountain.webp`} alt="" />
      </div>

      <PortraitPlate />

      <div className="hero__core">
        <div className="hero__tag">( About me )</div>

        <h1 className="hero__title">
          <span className="mask-line"><span>Muhammed</span></span>
          <span className="mask-line"><span className="name-outline">Dilshad A</span></span>
        </h1>

        <div className="hero__role">
          Android kernel developer — AI & Data Science student, Kozhikode IN
        </div>
      </div>

      <div className="hero__foot">
        <span>/ 2026 /</span>
        <span>Scroll down</span>
        <a className="hero__cta" href="mailto:hello.dilshad.in@gmail.com">
          LET'S TALK <span>↗</span>
        </a>
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
