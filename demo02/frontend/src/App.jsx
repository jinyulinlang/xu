import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import ProjectList from './components/ProjectList'
import TaskBoard from './components/TaskBoard'

export default function App() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/api/v1/projects').then(r => r.json()).then(j => {
      const data = j.data || []
      setProjects(data)
      if(data.length) setSelected(data[0])
    }).catch(()=>{
      // fallback sample
      setProjects([{ id:1, name:'移动App重构', dept:'产品', owner:'李经理', planStart:'2025-09-01', planEnd:'2025-12-01' }])
      setSelected({ id:1, name:'移动App重构', dept:'产品', owner:'李经理', planStart:'2025-09-01', planEnd:'2025-12-01' })
    })
  }, [])

  return (
    <div className="app-root">
      <Header />
      <div className="container">
        <aside className="sidebar">
          <ProjectList projects={projects} selected={selected} onSelect={setSelected} />
        </aside>
        <main className="main">
          {selected ? (
            <>
              <div className="project-header">
                <h2>{selected.name}</h2>
                <div className="meta">{selected.dept} · 负责人：{selected.owner} · {selected.planStart} → {selected.planEnd}</div>
              </div>
              <TaskBoard projectId={selected.id} />
            </>
          ) : (
            <div>加载中...</div>
          )}
        </main>
      </div>
    </div>
  )
}
