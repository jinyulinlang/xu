import React, { useEffect, useState } from 'react'

export default function TaskModal({ visible, onClose, projectId, task, onSaved }){
  const [form, setForm] = useState({ title:'', description:'', owner:'', percent:0 })

  useEffect(()=>{
    if(task) setForm({ title:task.title||'', description:task.description||'', owner:task.owner||'', percent:task.percent||0 })
  },[task])

  if(!visible) return null

  const save = async () => {
    try{
      if(task && task.id){
        const res = await fetch('/api/v1/tasks/' + task.id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
        const j = await res.json()
        onSaved && onSaved(j.data)
      }else{
        const res = await fetch('/api/v1/projects/' + projectId + '/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
        const j = await res.json()
        onSaved && onSaved(j.data)
      }
    }catch(e){
      console.error(e)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{task && task.id ? '编辑任务' : '新建任务'}</h3>
        <label>标题<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></label>
        <label>负责人<input value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})} /></label>
        <label>完成度<input type="number" value={form.percent} onChange={e=>setForm({...form,percent: Number(e.target.value)})} /></label>
        <label>描述<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></label>
        <div className="modal-actions">
          <button className="btn" onClick={save}>保存</button>
          <button className="btn ghost" onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  )
}
