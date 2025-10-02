import { load, save } from './store.js'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const form = document.getElementById('todo-form')
const input = document.getElementById('new-todo')
const listEl = document.getElementById('todo-list')
const addBtn = form.querySelector('button[type="submit"]')
const filterBtns = document.querySelectorAll('.filter-btn')
const clearCompletedBtn = document.getElementById('clear-completed')
const clearAllBtn = document.getElementById('clear-all')

let activeFilter = 'all'

function render() {
  const items = load()
  listEl.innerHTML = ''
  const visible = items.filter(t => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return !t.completed
    if (activeFilter === 'completed') return t.completed
    return true
  })
  for (const t of visible) {
    const li = document.createElement('li')
    li.dataset.id = t.id
    const span = document.createElement('span')
    span.className = 'todo-text' + (t.completed ? ' completed' : '')
    span.textContent = t.title

    const actions = document.createElement('div')
    actions.className = 'todo-actions'

    const done = document.createElement('button')
    done.className = 'action-btn complete'
    done.textContent = t.completed ? '未完成' : '完成'
    done.addEventListener('click', () => {
      toggle(t.id)
    })

    const del = document.createElement('button')
    del.className = 'action-btn delete'
    del.setAttribute('aria-label', '删除任务')
    // inline SVG icon (trash) + label for better affordance
    del.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="sr-only">删除</span>
    `
    del.addEventListener('click', () => {
      remove(t.id)
    })

    actions.appendChild(done)
    actions.appendChild(del)

    li.appendChild(span)
    li.appendChild(actions)
    listEl.appendChild(li)
  }
}

function add(title) {
  const items = load()
  const todo = { id: uid(), title, completed: false, createdAt: new Date().toISOString() }
  items.unshift(todo)
  save(items)
  render()
}

function toggle(id) {
  const items = load()
  const idx = items.findIndex(t => t.id === id)
  if (idx === -1) return
  items[idx].completed = !items[idx].completed
  save(items)
  render()
}

function remove(id) {
  let items = load()
  items = items.filter(t => t.id !== id)
  save(items)
  render()
}

function clearCompleted() {
  let items = load()
  items = items.filter(t => !t.completed)
  save(items)
  render()
}

function clearAll() {
  save([])
  render()
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const v = input.value.trim()
  if (!v) return
  add(v)
  input.value = ''
  input.focus()
})

// also handle click on the add button explicitly (keeps parity with submit)
if (addBtn) {
  addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const v = input.value.trim()
    if (!v) return
    add(v)
    input.value = ''
    input.focus()
  })
}

// filter buttons
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  activeFilter = btn.dataset.filter
  render()
}))

if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', clearCompleted)
if (clearAllBtn) clearAllBtn.addEventListener('click', () => {
  if (confirm('确认清除全部待办？')) clearAll()
})

// initial render
render()

export { }
