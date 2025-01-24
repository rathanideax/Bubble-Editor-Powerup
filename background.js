// Load features dynamically
async function loadFeatures() {
  const response = await fetch(chrome.runtime.getURL("features.json"));
  return response.json();
}

// Store injected features by tabId
const injectedFeatures = new Map();

// Injects enabled features on the specified tab.
async function injectFeatures(tabId) {
  const featuresConfig = await loadFeatures();
  const prefs = await chrome.storage.sync.get(null);

  // Check if we already injected features for this tab
  if (!injectedFeatures.has(tabId)) {
    injectedFeatures.set(tabId, new Set());
  }
  const tabFeatures = injectedFeatures.get(tabId);
  for (const feature of featuresConfig) {
    const isEnabled = prefs[feature.key] !== false;

    if (isEnabled && !tabFeatures.has(feature.key)) {
      if (feature.cssFile) {
        await chrome.scripting.insertCSS({
          target: { tabId },
          files: [feature.cssFile]
        });
      }
      if (feature.jsFile) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: [feature.jsFile]
        });
      }
      // Mark this feature as injected
      tabFeatures.add(feature.key);
    }
  }
}

// When a tab in Bubble’s editor has fully loaded, inject features.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("bubble.io/page")) {
    injectFeatures(tabId);
  }
});
