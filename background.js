// Load features dynamically
async function loadFeatures() {
  const response = await fetch(chrome.runtime.getURL("features.json"));
  return response.json();
}

// Store injected features by tabId
const injectedFeatures = new Map();

// Track if a tab is currently loading features to avoid multiple injections during a page load
const loadingTabs = new Set();

// Injects enabled features on the specified tab.
async function injectFeatures(tabId) {
  // Ensure that features are injected only once per tab load
  if (loadingTabs.has(tabId)) {
    console.log(`Features for tab ${tabId} are already being injected. Skipping...`);
    return;
  }
  loadingTabs.add(tabId); // Mark tab as loading

  const featuresConfig = await loadFeatures();
  const prefs = await chrome.storage.sync.get(null);

  // Remove duplicates from featuresConfig
  const uniqueFeaturesConfig = Array.from(new Set(featuresConfig.map(f => f.key)))
    .map(key => featuresConfig.find(f => f.key === key));

  // Initialize a new tracking record for this tab (if we haven't already)
  if (!injectedFeatures.has(tabId)) {
    injectedFeatures.set(tabId, new Set());
  } else {
    console.error("Tried to inject features more than once on the same tab.");
  }

  const tabFeatures = injectedFeatures.get(tabId);
  for (const feature of uniqueFeaturesConfig) {
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
  loadingTabs.delete(tabId); // Mark tab as no longer loading
}

// When a tab in Bubble’s editor has fully loaded, inject features.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("bubble.io/page")) {
    injectFeatures(tabId);
  }
});
