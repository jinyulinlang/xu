import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

type Todo = {
  id: number
  title: string
  description?: string | null
  completed: boolean
}

export default function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<'all'|'active'|'completed'>('all')

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos(){
    const res = await fetch(`${API_BASE}/todos`)
    const data = await res.json()
    setTodos(data)
  }

  async function addTodo(){
    if(!text.trim()) return
    const res = await fetch(`${API_BASE}/todos`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: text.trim() }) })
    const t = await res.json()
    setTodos([t, ...todos])
    setText('')
  }

  async function toggleComplete(t: Todo){
    const res = await fetch(`${API_BASE}/todos/${t.id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ completed: !t.completed }) })
    const updated = await res.json()
    setTodos(todos.map(x=> x.id===updated.id ? updated : x))
  }

  async function deleteTodo(id: number){
    await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t=>t.id!==id))
  }

  async function clearCompleted(){
    await fetch(`${API_BASE}/clear_completed`, { method: 'POST' })
    setTodos(todos.filter(t=>!t.completed))
  }

  async function clearAll(){
    await fetch(`${API_BASE}/clear_all`, { method: 'POST' })
    setTodos([])
  }

  const visible = todos.filter(t=>{
    if(filter==='active') return !t.completed
    if(filter==='completed') return t.completed
    return true
  })

  return (
    <div className="container">
      <h1 className="title">待办事项</h1>

      <div className="inputRow">
        <input className="input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter' && addTodo()} placeholder="添加新任务..." />
        <button className="btn primary" onClick={addTodo}>添加</button>
      </div>

      <ol className="todoList">
        {visible.map(t=> (
          <li key={t.id} className={`todoItem ${t.completed ? 'completed' : ''}`}>
            <span className="todoText">{t.title}</span>
            <div className="actions">
              <button className="btn" onClick={()=>toggleComplete(t)}>{t.completed ? '取消' : '完成'}</button>
              <button className="btn danger" onClick={()=>deleteTodo(t.id)}>删除</button>
            </div>
          </li>
        ))}
      </ol>

      <div className="footer">
        <div className="filters">
          <button className={`filterBtn ${filter==='all' ? 'active' : ''}`} onClick={()=>setFilter('all')}>全部</button>
          <button className={`filterBtn ${filter==='active' ? 'active' : ''}`} onClick={()=>setFilter('active')}>未完成</button>
          <button className={`filterBtn ${filter==='completed' ? 'active' : ''}`} onClick={()=>setFilter('completed')}>已完成</button>
        </div>

        <div className="controls">
          <button className="btn" onClick={clearCompleted}>清除已完成</button>
          <button className="btn danger" onClick={clearAll}>清除全部</button>
        </div>
      </div>
    </div>
  )
}
