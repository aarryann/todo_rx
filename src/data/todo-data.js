import { runtimeAPI } from './microrx/runtime.js';

async function init() {
  // Load initial state
  const res = await fetch('/data/todos.json');
  const todos = await res.json();

  // You populate the state BEFORE hydration.
  runtimeAPI.state = (todos && Array.isArray(todos)) ? { todos } : { todos: [] };
}

init();
