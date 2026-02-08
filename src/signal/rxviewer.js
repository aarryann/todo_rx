import { attemptSubscription, refresh, reload, renderTree, isPowerMode, jsonData, setState, isConnected } from './rxtools.js';

setState(window.parent.state);

const powerModeBtn = document.getElementById('powerModeBtn');
const dot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

document.getElementById('reloadBtn').onclick = () => reload(window.parent.state);

powerModeBtn.addEventListener('click', () => {
  isPowerMode = !isPowerMode;

  renderTree(jsonData, document.getElementById("editor")); 
  // Toggle the visual class
  powerModeBtn.classList.toggle('active', isPowerMode);
  
  // Optional: Notify the framework that we want "Power Mode" 
  // (e.g., logging every single micro-change vs just the final state)
  chrome.devtools.inspectedWindow.eval(`
      if (window.__MICRORX_DEVTOOLS__) {
          window.__MICRORX_DEVTOOLS__.setPowerMode(${isPowerMode});
      }
  `);

  console.log(`Power Mode: ${isPowerMode ? 'ENABLED' : 'DISABLED'}`);
});

window.addEventListener("message", (event) => {
  if (event.data.type === 'STATE_UPDATED') {
    if (!isConnected) {
      isConnected = true; // Stop polling
      dot.classList.add('connected');
      statusText.textContent = "Live";
    }
    reload(event.data.payload);
  }
});

attemptSubscription();
refresh();
