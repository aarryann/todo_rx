export const jsonData = {
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

const subscribers = []; // Our "Queue" of windows to notify

/**
 * Register a new subscriber (Reviewer calls this via message)
 */
export function subscribe(sourceWindow, currentState) {
    if (!subscribers.includes(sourceWindow)) {
        subscribers.push(sourceWindow);
        // Use the actual signalized state passed from index.js
        notify(sourceWindow, currentState);
    }
}

/**
 * Notify everyone in the queue
 */
export function notifyAll(currentState) {
    subscribers.forEach(sub => notify(sub, currentState));
}

export function notify(targetWindow, data) {
    targetWindow.postMessage({
        type: 'STATE_UPDATED',
        payload: JSON.parse(JSON.stringify(data)) // Deep copy to prevent mutations
    }, "*");
}

// Listen for the "SUBSCRIBE" request from the Reviewer
window.addEventListener("message", (event) => {
    if (event.data.type === 'SUBSCRIBE_ME') {
        // We pass window.state (the signalized one)
        subscribe(event.source, window.state);
    }
});

// Example: Whenever your framework state changes
export function setState(updateFn, currentState) {
    updateFn(currentState);
    notifyAll(currentState);
}