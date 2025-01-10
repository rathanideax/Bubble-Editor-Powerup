// Defines which features to potentially inject, referencing their JS and CSS files
const featuresConfig = [
    {
      key: "feature_expression_bad_practice_warning_enabled",
      cssFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.css",
      jsFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.js"
    },
    {
      key: "feature_style_row_hover_enabled",
      cssFile: "features/style-row-hover/style-row-hover.css",
      jsFile: "features/style-row-hover/style-row-hover.js"
    }
  ];
  
  // Injects any enabled features on the specified tab
  async function injectFeatures(tabId) {
    const defaults = {
      feature_expression_bad_practice_warning_enabled: true,
      feature_style_row_hover_enabled: true
    };
    const prefs = await chrome.storage.sync.get(defaults);
  
    for (const feature of featuresConfig) {
      if (prefs[feature.key]) {
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
  
  // Detects when a tab in Bubble’s editor has fully loaded, then injects features
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("bubble.io/page")) {
      injectFeatures(tabId);
    }
  });
  