import React from 'react'

export default function ProjectList({ projects, selected, onSelect }){
  return (
    <div className="project-list">
      <div className="list-title">项目</div>
      <ul>
        {projects.map(p => (
          <li key={p.id} className={selected.id === p.id ? 'active' : ''} onClick={() => onSelect(p)}>
            <div className="p-name">{p.name}</div>
            <div className="p-meta">{p.dept} · {p.owner}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
