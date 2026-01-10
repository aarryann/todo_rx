import { effect, printTrackedEffects, signalize, stateToNotify } from "../reactivity/signalize.js"

const jsonData = {
  user: "Jack",
  boards: {
    title: "Trello Duplicate",
    columns: [
      {
        id: "col-1",
        name: "Todo",
        cards: [
          { id: "card-1", text: "Buy milk", tag: "low" }
        ]
      }
    ]
  }
};

const state = signalize(jsonData);
stateToNotify.value = state;

effect(([value]) => {
  document.getElementById("title").textContent = value
}, {watches:[[state.boards, "title"]]})


effect(([value]) => {
  document.getElementById("tag").textContent = value
}, {watches:[[state.boards.columns.value[0].cards.value[0], "tag"]]})

// Mutations
document.getElementById("newTitle").onchange = () => {
  state.boards.title = document.getElementById("newTitle").value;
}

document.getElementById("newTag").onchange = () => {
  state.boards.columns.value[0].cards.value[0].tag = document.getElementById("newTag").value;
}

document.getElementById("addCard").onclick = () => {
  state.boards.columns.value[0].cards.value.push({
    id: "card-" + Date.now(),
    text: "New task",
    tag: "high"
  })
}
