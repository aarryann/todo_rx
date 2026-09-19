// card.data.js

export default {
  schema: {
    card: {
      id: "string",
      title: "string",
      completed: "string",
      dayspassed: "number",
      watching: "number",
      tags: [tag]
    },
    tag: {}
  }
};