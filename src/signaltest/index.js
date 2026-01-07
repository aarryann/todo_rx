import { effect } from "../reactivity/effect.js"
import { jsonData, notifyAll } from "../reactivity/state.js"
import { signalize } from "../reactivity/signalize.js"

const state = signalize(jsonData);
window.state = state;


// Track board title
effect(() => {
  document.getElementById("title").textContent =
    state.boards.title
})

// Track first card tag
effect(() => {
  document.getElementById("tag").textContent = state.boards.columns.value[0].cards.value[0].tag
})

// Mutations
document.getElementById("changeTag").onclick = () => {
  state.boards.columns.value[0].cards.value[0].tag = "medium-priority"
  notifyAll(state);
}

document.getElementById("addCard").onclick = () => {
  state.boards.columns.value[0].cards.value.push({
    id: "card-" + Date.now(),
    text: "New task",
    tag: "high"
  })
  notifyAll(state);
}
