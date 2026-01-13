import { signalize } from "/microrx.js"

export const state = {
  user: "Jack",
  boards: {
    title: "Trello Copying",
    columns: [
      {
        id: "col-1",
        name: "Todo",
        cards: [
          { id: "card-1", text: "Buy milk", tag: "low" }
        ]
      },
      {
        id: "col-2",
        name: "In Progress",
        cards: [
          { id: "card-2", text: "Write documentation", tag: "medium" }
        ]
      }
    ]
  }
};

export const jsonData = signalize(state);