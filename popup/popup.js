import { CONFIG } from '../config/config.js';

document.addEventListener('DOMContentLoaded', () => {
  const powerSwitch = document.getElementById('power-switch');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  const debugInfo = document.getElementById('debug-info');

  // Load debug panel if configured in .env / config
  if (CONFIG.DEBUG) {
    debugInfo.classList.remove('hidden');
    debugInfo.textContent = `Dev Mode (API Key: ${CONFIG.API_KEY ? 'Set' : 'None'})`;
    console.log('[PasswordViewer] Popup initialized in debug mode.');
  }

  // 1. Get initial state from storage (default off)
  chrome.storage.local.get(['enabled'], (result) => {
    const isEnabled = !!result.enabled;
    powerSwitch.checked = isEnabled;
    updateUIState(isEnabled);
  });

  // 2. Add change event listener to the switch
  powerSwitch.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    
    // Save to local storage
    chrome.storage.local.set({ enabled: isEnabled }, () => {
      updateUIState(isEnabled);
      if (CONFIG.DEBUG) {
        console.log(`[PasswordViewer] State changed to: ${isEnabled ? 'ON' : 'OFF'}`);
      }
    });
  });

  // Helper to adjust classes and texts based on active state
  function updateUIState(isEnabled) {
    if (isEnabled) {
      document.body.classList.add('enabled-active');
      statusBadge.className = 'badge badge-active';
      statusText.textContent = 'Active';
    } else {
      document.body.classList.remove('enabled-active');
      statusBadge.className = 'badge badge-inactive';
      statusText.textContent = 'Disabled';
    }
  }
});
