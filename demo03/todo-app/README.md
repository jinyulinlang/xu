# Simple TODO App (原生 HTML/CSS/JS)

这是一个极简的待办事项应用骨架，使用原生前端技术、模块化 JS。主要文件：

- `index.html` - 入口页面
- `css/styles.css` - 基本样式
- `js/store.js` - localStorage 封装
- `js/todoModel.js` - 数据操作（增删改）
- `js/ui.js` - DOM 渲染
- `js/app.js` - 事件绑定与应用启动

运行方式：直接在浏览器打开 `index.html` 即可（推荐使用本地静态服务器以避免模块跨域问题）。例如在项目目录运行：

```
python3 -m http.server 8000
# 然后访问 http://localhost:8000/todo-app/
```

注意：该骨架使用 localStorage 存储，key 为 `TODO_APP_v1`。
