import { skills } from '../data/skills'
export function Skills() {
  return (
    <section id="skills" className="section skills" data-header="light">
      <div className="section-label">[ TECHNICAL STACK ]</div>
      <h2 className="pull-words">Tools of<br />the stack</h2>
      {skills.map((skill) => (
        <div className="skill-row" key={skill.index}>
          <div className="skill-row__index">({skill.index})</div>
          <div>
            <div className="skill-row__title">{skill.title}</div>
            <div className="skill-tags">{skill.tags.map((tag) => (<span key={tag}>{tag}</span>))}</div>
          </div>
        </div>
      ))}
    </section>
  )
}