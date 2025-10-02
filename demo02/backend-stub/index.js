const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Simple in-memory mock data
const projects = [
  { id: 1, name: '移动App重构', dept: '产品', owner: '李经理', planStart: '2025-09-01', planEnd: '2025-12-01' },
  { id: 2, name: '后台监控平台', dept: '研发', owner: '张主管', planStart: '2025-08-10', planEnd: '2025-11-30' }
]

const tasks = [
  { id: 1, projectId:1, title: '需求梳理', status: '进行中', owner: '王小明', percent: 60 },
  { id: 2, projectId:1, title: '原型设计', status: '待开始', owner: '刘艳', percent: 0 },
  { id: 3, projectId:1, title: '接口定义', status: '阻塞', owner: '赵强', percent: 30 },
  { id: 4, projectId:2, title: '监控采集', status: '进行中', owner: '陈工', percent: 45 }
]

const taskUpdates = []

app.post('/api/v1/auth/login', (req, res) => {
  const { username } = req.body
  return res.json({ code:0, data: { accessToken: 'stub-token', user: { id: 1, name: username || 'demo', role: 'member' } } })
})

app.get('/api/v1/projects', (req, res) => {
  res.json({ code:0, data: projects })
})

app.get('/api/v1/projects/:id', (req, res) => {
  const id = Number(req.params.id)
  const p = projects.find(x => x.id === id)
  if(!p) return res.status(404).json({ code:2001, error: 'PROJECT_NOT_FOUND' })
  res.json({ code:0, data: p })
})

app.get('/api/v1/projects/:projectId/tasks', (req, res) => {
  const projectId = Number(req.params.projectId)
  const list = tasks.filter(t => t.projectId === projectId)
  res.json({ code:0, data: list })
})

app.get('/api/v1/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const t = tasks.find(x => x.id === id)
  if(!t) return res.status(404).json({ code:2002, error:'TASK_NOT_FOUND' })
  res.json({ code:0, data: t })
})

app.post('/api/v1/tasks/:id/updates', (req, res) => {
  const id = Number(req.params.id)
  const t = tasks.find(x => x.id === id)
  if(!t) return res.status(404).json({ code:2002, error:'TASK_NOT_FOUND' })
  const upd = { id: taskUpdates.length+1, taskId: id, ...req.body, timestamp: new Date().toISOString() }
  taskUpdates.push(upd)
  // apply some changes
  if(req.body.status !== undefined) t.status = req.body.status
  if(req.body.percentComplete !== undefined) t.percent = req.body.percentComplete
  res.status(201).json({ code:0, data: upd })
})

// Create a new task under a project
app.post('/api/v1/projects/:projectId/tasks', (req, res) => {
  const projectId = Number(req.params.projectId)
  const project = projects.find(p => p.id === projectId)
  if(!project) return res.status(404).json({ code:2001, error: 'PROJECT_NOT_FOUND' })
  const newId = tasks.reduce((m, x) => Math.max(m, x.id), 0) + 1
  const t = {
    id: newId,
    projectId,
    title: req.body.title || '新任务',
    description: req.body.description || '',
    status: req.body.status || '待开始',
    owner: req.body.owner || '未分配',
    percent: req.body.percent || 0,
    planStart: req.body.planStart || null,
    planEnd: req.body.planEnd || null,
    estimateHours: req.body.estimateHours || null
  }
  tasks.push(t)
  res.status(201).json({ code:0, data: t })
})

// Update task (partial)
app.patch('/api/v1/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const t = tasks.find(x => x.id === id)
  if(!t) return res.status(404).json({ code:2002, error:'TASK_NOT_FOUND' })
  const allowed = ['title','description','owner','status','percent','planStart','planEnd','estimateHours']
  Object.keys(req.body).forEach(k => { if(allowed.includes(k)) t[k] = req.body[k] })
  res.json({ code:0, data: t })
})

// Delete task
app.delete('/api/v1/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = tasks.findIndex(x => x.id === id)
  if(idx === -1) return res.status(404).json({ code:2002, error:'TASK_NOT_FOUND' })
  const removed = tasks.splice(idx,1)[0]
  res.json({ code:0, data: removed })
})

app.listen(8000, () => console.log('Backend stub listening on http://localhost:8000'))
