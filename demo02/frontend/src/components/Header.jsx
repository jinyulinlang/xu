import React from 'react'

export default function Header(){
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">PT</div>
        <div className="title">项目任务管理 原型</div>
      </div>
      <div className="header-actions">
        <button className="btn">新建项目</button>
        <button className="btn ghost">通知</button>
      </div>
    </header>
  )
}
