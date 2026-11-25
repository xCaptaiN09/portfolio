import { PortraitPlate } from './PortraitPlate'

const topics = ['Android kernels', 'MT6893 / cupida', 'Linux 4.19', 'KernelSU-Next', 'SuSFS', 'Open source']

export function Hero() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="hero__mountain" aria-hidden="true">
        <img className="hero__mountain__base" src={`${import.meta.env.BASE_URL}mountain.webp`} alt="" />
      </div>
      <div className="intro__layout">
        <div className="intro__copy">
          <h1 id="intro-title">I'm Muhammed Dilshad<span className="intro__period">.</span></h1>
          <p>Student by day, maintainer by night.<br />Android kernels and Linux desktop tools.</p>
          <div className="intro__actions">
            <a className="intro__work" href="#projects">Explore my projects</a>
            <a className="intro__contact" href="mailto:hello.dilshad.in@gmail.com">Get in touch</a>
          </div>
        </div>
        <figure className="intro__portrait">
          <PortraitPlate />
          <figcaption>
            <span className="intro__brand-origin" aria-hidden="true" />
            <span>Kozhikode, India</span>
          </figcaption>
        </figure>
      </div>
      <div className="marquee intro__marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy}>
              {topics.map((topic) => <span key={topic}>{topic}<span className="intro__separator">/</span></span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
