// List features here!
const featuresConfig = [
    {
      key: "feature_expression_bad_practice_warning_enabled",
      cssFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.css",
      jsFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.js"
    },
    {
      key: "feature_style_row_hover_enabled",
      cssFile: "features/style-row-hover/style-row-hover.css"
    }
  ];
  
  // Injects any enabled features on the specified tab.
  async function injectFeatures(tabId) {
    // Retrieves all stored preferences; if a key doesn't exist, we'll treat it as ON.
    const prefs = await chrome.storage.sync.get(null);
  
    for (const feature of featuresConfig) {
      // If the stored value is strictly false, the feature is OFF -- otherwise it's ON.
      const isEnabled = prefs[feature.key] !== false;
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
  
  // Detects when a tab in Bubble’s editor has fully loaded, then injects features.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("bubble.io/page")) {
      injectFeatures(tabId);
    }
  });
  