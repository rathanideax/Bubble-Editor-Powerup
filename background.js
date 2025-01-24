// Load features dynamically
async function loadFeatures() {
  const response = await fetch(chrome.runtime.getURL("features.json"));
  return response.json();
}

// Injects enabled features on the specified tab.
async function injectFeatures(tabId) {
  const featuresConfig = await loadFeatures();
  // Retrieves all stored preferences; if a key doesn't exist, we'll treat it as ON.
  const prefs = await chrome.storage.sync.get(null);

  for (const feature of featuresConfig) {
    // If the stored value is strictly false, the feature is OFF -- otherwise it's ON.
    const isEnabled = prefs[feature.key] !== false;;
    console.log(feature.key, isEnabled);
    if (isEnabled) {
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
    }
  }
}
// When a tab in Bubble’s editor has fully loaded, inject features.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("bubble.io/page")) {
    injectFeatures(tabId);
  }
});
