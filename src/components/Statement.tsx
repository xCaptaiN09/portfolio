import { STATEMENT_WORDS } from '../data/statement'
export function Statement() {
  return (
    <section id="about" className="section statement">
      <div>
        <div className="section-label">[ WHO I AM ]</div>
        <div className="statement__copy">
          {STATEMENT_WORDS.map((word, index) => (<span className="st-word" key={`${word}-${index}`}>{word}{' '}</span>))}
          <span className="st-word accent">invisible.</span>
        </div>
        <div className="stats">
          <div className="stat"><strong>300+</strong><span>combined GitHub stars</span></div>
          <div className="stat"><strong>17</strong><span>pixie-sddm forks</span></div>
          <div className="stat"><strong>4</strong><span>active kernel branches</span></div>
          <div className="stat"><strong>2</strong><span>upstream contribution tracks</span></div>
        </div>
      </div>
    </section>
  )
}