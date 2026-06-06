import { CONFIG } from '../config/config.js';

// Initialize default state upon extension install
chrome.runtime.onInstalled.addListener(() => {
  if (CONFIG.DEBUG) {
    console.log('[PasswordViewer] Extension installed. Initializing configuration.');
    console.log('[PasswordViewer] API key configured:', CONFIG.API_KEY ? 'Yes' : 'No');
  }

  // Set default password viewer state to false (disabled)
  chrome.storage.local.set({ enabled: false }, () => {
    if (CONFIG.DEBUG) {
      console.log('[PasswordViewer] Default state initialized to: OFF (disabled)');
    }
  });
});

if (CONFIG.DEBUG) {
  console.log('[PasswordViewer] Background Service Worker Loaded.');
}
