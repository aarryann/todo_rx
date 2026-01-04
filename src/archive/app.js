import { compile } from "microrx/compiler";
import { signals, hydrate } from "microrx/runtime";
import { components } from "./src/components/registry.js";

const state = signals({
  todos: ["Buy milk", "Read book"]
});

const listEl = document.getElementById("todo-list");

function render() {
  listEl.innerHTML = state.todos.map(t =>
    compile(`<TodoItem rx-prop:text="${t}" />`, { components })
  ).join("");

  hydrate(document.body, state);
}

document.getElementById("addBtn").onclick = () => {
  const input = document.getElementById("newTodo");
  if (input.value.trim()) {
    state.todos.push(input.value.trim());
    input.value = "";
    render();
  }
};

document.body.addEventListener("click", ev => {
  const id = ev.target.closest("[data-mrx-id]")?.dataset?.mrxId;
  if (!id) return;
  console.log("Microrx pipeline fired for:", id);
});

render();
