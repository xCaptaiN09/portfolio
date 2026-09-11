import { record } from '../data/record'
export function RecordSection() {
  return (
    <section id="record" className="section record">
      <div className="section-label">[ RECORD ]</div>
      <h2 className="pull-words">Education<br />& Certs</h2>
      <div className="record-table">
        {record.map((row) => (
          <div className="record-row" key={row.main}>
            <div className="record-row__kind">{row.kind}</div>
            <div className="record-row__main">{row.main}<span>{row.sub}</span></div>
            <div className="record-row__status">{row.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}