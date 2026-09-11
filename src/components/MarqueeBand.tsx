import { MARQUEE_ITEMS } from '../data/marquee'
export function MarqueeBand() {
  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__group">{MARQUEE_ITEMS.map((item) => (<span key={item}>{item}<span className="marquee__sep">©</span></span>))}</div>
        <div className="marquee__group">{MARQUEE_ITEMS.map((item) => (<span key={`${item}-dup`}>{item}<span className="marquee__sep">©</span></span>))}</div>
      </div>
    </section>
  )
}