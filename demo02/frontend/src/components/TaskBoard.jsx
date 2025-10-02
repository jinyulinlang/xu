import React, { useEffect, useState, useRef } from 'react'
import TaskModal from './TaskModal'

const statuses = ['待开始','进行中','阻塞','已完成']

export default function TaskBoard({ projectId }){
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [showGantt, setShowGantt] = useState(false)

  useEffect(()=>{
    if(!projectId) return
    fetch(`/api/v1/projects/${projectId}/tasks`).then(r=>r.json()).then(j=>setTasks(j.data || [])).catch(()=>setTasks([]))
  },[projectId])

  const refresh = () => fetch(`/api/v1/projects/${projectId}/tasks`).then(r=>r.json()).then(j=>setTasks(j.data || []))

  const onUpdateLocal = async (id, data) => {
    await fetch(`/api/v1/tasks/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    refresh()
  }

  const onCreate = () => { setEditTask(null); setShowModal(true) }

  const onEdit = (task) => { setEditTask(task); setShowModal(true) }

  const onDelete = async (taskId) => {
    if(!confirm('确认删除任务？')) return
    await fetch(`/api/v1/tasks/${taskId}`, { method:'DELETE' })
    refresh()
  }

  // touch swipe for mobile: swipe left to mark as next status
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (task) => {
    const dx = touchStartX.current - touchEndX.current
    if(Math.abs(dx) > 50){
      // swipe left -> advance status
      const idx = statuses.indexOf(task.status)
      const next = Math.min(statuses.length-1, idx+1)
      onUpdateLocal(task.id, { status: statuses[next] })
    }
  }

  const onTouchMove = (e) => { touchEndX.current = e.touches[0].clientX }

  return (
    <div className="task-area">
      <div className="task-actions">
        <button className="btn" onClick={onCreate}>新建任务</button>
        <button className="btn ghost" onClick={()=>setShowGantt(s=>!s)}>{showGantt? '隐藏甘特':'显示甘特'}</button>
      </div>

      <div className="board">
        {statuses.map(s => (
          <div className="lane" key={s}>
            <div className="lane-header">{s}</div>
            <div className="lane-list">
              {tasks.filter(t => t.status === s).map(t => (
                <div className="card" key={t.id} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={() => onTouchEnd(t)}>
                  <div className="card-title">{t.title}</div>
                  <div className="card-meta">负责人：{t.owner}</div>
                  <div className="progress">
                    <div className="bar" style={{width: (t.percent||0) + '%'}} />
                    <div className="percent">{t.percent||0}%</div>
                  </div>
                  <div className="card-actions">
                    <select value={t.status} onChange={e => onUpdateLocal(t.id, { status: e.target.value })}>
                      {statuses.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                    <input type="range" min="0" max="100" value={t.percent||0} onChange={e => onUpdateLocal(t.id, { percent: Number(e.target.value) })} />
                  </div>
                  <div className="card-foot">
                    <button className="btn" onClick={()=>onEdit(t)}>编辑</button>
                    <button className="btn ghost" onClick={()=>onDelete(t.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gantt" style={{display: showGantt ? 'block' : 'none'}}>
        <div className="gantt-title">甘特（简版）</div>
        <div className="gantt-placeholder">当前为简版甘特占位，后续可接入 d3 / react-gantt</div>
        <ul className="gantt-list">
          {tasks.map(t => (
            <li key={t.id}><strong>{t.title}</strong> · {t.planStart || '-'} → {t.planEnd || '-'} · {t.percent||0}%</li>
          ))}
        </ul>
      </div>

      <TaskModal visible={showModal} onClose={()=>setShowModal(false)} projectId={projectId} task={editTask} onSaved={(n)=>{setShowModal(false); refresh()}} />
    </div>
  )
}
