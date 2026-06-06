(function() {
  const EYE_OPEN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const EYE_CLOSED_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  let isEnabled = false;
  let observer = null;

  // Initialize script
  function init() {
    chrome.storage.local.get(['enabled'], (result) => {
      isEnabled = !!result.enabled;
      handleStateChange();
    });

    // Listen for real-time config updates from popup/background
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled !== undefined) {
        isEnabled = !!changes.enabled.newValue;
        handleStateChange();
      }
    });
  }

  // Act on state changes
  function handleStateChange() {
    if (isEnabled) {
      scanAndSetupInputs();
      startMutationObserver();
    } else {
      stopMutationObserver();
      cleanUpAll();
    }
  }

  // Scan document for password inputs and inject visibility buttons
  function scanAndSetupInputs() {
    // Find all password inputs, or inputs that we have already modified but might be toggled to text right now
    const inputs = document.querySelectorAll('input[type="password"], input[data-reveal-pass-target="true"]');
    
    inputs.forEach((input) => {
      // Mark as target
      if (!input.hasAttribute('data-reveal-pass-target')) {
        input.setAttribute('data-reveal-pass-target', 'true');
        input.setAttribute('data-original-type', 'password');
      }

      // Check if button is already injected
      const parent = input.parentElement;
      if (!parent) return;

      // Ensure parent has relative positioning for correct absolute button layout
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.position === 'static') {
        parent.classList.add('reveal-pass-parent');
      }

      // Add extra padding to input so characters don't overlap the eye icon
      input.classList.add('reveal-pass-input-padding');

      const existingBtn = parent.querySelector('.reveal-pass-btn[data-input-ref]');
      if (!existingBtn) {
        createToggleButton(input, parent);
      }
    });
  }

  // Generate and inject a custom toggle button
  function createToggleButton(input, parent) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reveal-pass-btn';
    // Generate a unique ID to tie button to input
    const refId = 'rp_' + Math.random().toString(36).substr(2, 9);
    input.setAttribute('data-reveal-pass-id', refId);
    btn.setAttribute('data-input-ref', refId);
    btn.setAttribute('title', 'Toggle password visibility');
    
    // Set default icon to "eye open" (since default input type is password)
    btn.innerHTML = EYE_OPEN_SVG;

    // Toggle password type on click
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const currentType = input.getAttribute('type');
      if (currentType === 'password') {
        input.setAttribute('type', 'text');
        btn.innerHTML = EYE_CLOSED_SVG;
        btn.setAttribute('title', 'Hide password');
      } else {
        input.setAttribute('type', 'password');
        btn.innerHTML = EYE_OPEN_SVG;
        btn.setAttribute('title', 'Show password');
      }
    });

    // Append button inside parent right after the input field
    input.after(btn);
  }

  // Watch for dynamic additions to the page (Ajax/SPA loads)
  function startMutationObserver() {
    if (observer) return;

    observer = new MutationObserver(() => {
      scanAndSetupInputs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function stopMutationObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Clean up all DOM alterations and restore inputs to default password state
  function cleanUpAll() {
    // 1. Remove all injected buttons
    const buttons = document.querySelectorAll('.reveal-pass-btn');
    buttons.forEach(btn => btn.remove());

    // 2. Reset password inputs back to original state
    const inputs = document.querySelectorAll('input[data-reveal-pass-target="true"]');
    inputs.forEach((input) => {
      input.setAttribute('type', 'password');
      input.classList.remove('reveal-pass-input-padding');
      
      // Clean attributes
      input.removeAttribute('data-reveal-pass-target');
      input.removeAttribute('data-original-type');
      input.removeAttribute('data-reveal-pass-id');
    });

    // 3. Remove relative classes from parents if they were added
    const parents = document.querySelectorAll('.reveal-pass-parent');
    parents.forEach((parent) => {
      parent.classList.remove('reveal-pass-parent');
    });
  }

  // Run on load
  init();
})();
