// example-app/src/user-actions.js
import { runtimeAPI } from './microrx/runtime.js';

// helper to re-render the todo-list container from runtimeAPI.state.todos
function renderTodos() {
  const list = document.getElementById('todo-list');
  if (!list) return;
  list.innerHTML = '';
  const todos = runtimeAPI.state.todos || [];
  for (const t of todos) {
    const div = document.createElement('div');
    div.className = 'todo-item';
    const span = document.createElement('span');
    span.textContent = t;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.addEventListener('click', () => {
      const idx = runtimeAPI.state.todos.indexOf(t);
      if (idx >= 0) {
        runtimeAPI.state.todos.splice(idx,1);
        renderTodos();
      }
    });
    div.appendChild(span);
    div.appendChild(btn);
    list.appendChild(div);
  }
}

// actions
export function addTodo(el) {
  const input = document.getElementById('newTodo');
  const v = input && input.value.trim();
  if (!v) return;
  runtimeAPI.state.todos = runtimeAPI.state.todos || [];
  runtimeAPI.state.todos.push(v);
  input.value = '';
  renderTodos();
}

export function deleteItem(el) {
  const item = el.closest('.todo-item');
  if (!item) return;
  const text = item.querySelector('span')?.textContent;
  if (!text) return;
  const idx = (runtimeAPI.state.todos || []).indexOf(text);
  console.log(idx); 
  if (idx>=0) runtimeAPI.state.todos.splice(idx,1);
  renderTodos();
}

export function searchTodos(el) {
  const q = document.getElementById('search')?.value.trim().toLowerCase();
  if (!q) { renderTodos(); return; }
  const filtered = (runtimeAPI.state.todos || []).filter(t => t.toLowerCase().includes(q));
  // quick rendering of filtered results
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  for (const t of filtered) {
    const div = document.createElement('div');
    div.className = 'todo-item';
    const span = document.createElement('span');
    span.textContent = t;
    div.appendChild(span);
    list.appendChild(div);
  }
}
