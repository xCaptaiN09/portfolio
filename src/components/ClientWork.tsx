import { ClientOrb } from "./ClientOrb"
import { clients } from '../data/clients'
export function ClientWork() {
  return (
    <section id="client" className="section freelance" data-header="light">
      <ClientOrb />
      <ClientOrb />
      <div className="section-label">[ CLIENT WORK ]</div>
      <h2 className="pull-words">Client<br />Work</h2>
      <div className="freelance-grid">
        {clients.map((client) => (
          <article className="client-card" key={client.index}>
            <div className="client-card__index">({client.index})</div>
            <div>
              <h3>{client.name}</h3>
              <div className="client-card__meta">{client.meta.map((item) => (<span key={item}>{item}</span>))}</div>
            </div>
            <div className="client-card__right">
              <p>{client.desc}</p>
              <span className="client-card__arrow">↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}