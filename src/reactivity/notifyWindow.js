let notifiedState = null;

const subscribers = []; // Our "Queue" of windows to notify

export const stateToNotify = {
    get value() {
        return notifiedState;
    },
    set value(newState) {
        notifiedState = newState;
    }
}

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
    if (!currentState) return;

    subscribers.forEach(sub => notify(sub, currentState));
}

export function notify(targetWindow, currentState) {
    if (!currentState) return;

    targetWindow.postMessage({
        type: 'STATE_UPDATED',
        payload: JSON.parse(JSON.stringify(currentState)) // Deep copy to prevent mutations
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
