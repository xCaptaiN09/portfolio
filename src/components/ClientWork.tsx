import { ClientOrb } from "./ClientOrb"
import { clients } from '../data/clients'
export function ClientWork() {
  return (
    <section id="client" className="section freelance" data-header="light">
      <ClientOrb />
      <div className="section-label">[ CLIENT WORK ]</div>
      <h2 className="pull-words">Client<br />Work</h2>
      <div className="freelance-grid">
        {clients.map((client) => (
          <a className="client-card" key={client.index} href={client.url}>
            <div className="client-card__index">({client.index})</div>
            <div>
              <h3>{client.name}</h3>
              <div className="client-card__meta">{client.meta.map((item) => (<span key={item}>{item}</span>))}</div>
            </div>
            <div className="client-card__right">
              <p>{client.desc}</p>
              <span aria-hidden="true" className="client-card__arrow">↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}