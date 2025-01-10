document.addEventListener("DOMContentLoaded", async () => {
    // Default preferences in case nothing is saved yet
    const defaults = {
      feature_expression_bad_practice_warning_enabled: true,
      feature_style_row_hover_enabled: true
    };
  
    // Retrieve existing preferences or use defaults
    const prefs = await new Promise(resolve => {
      chrome.storage.sync.get(defaults, resolve);
    });
  
    // Set the checkboxes according to the stored or default preferences
    document.getElementById("opt-expression-bad-practice-warning").checked =
      prefs.feature_expression_bad_practice_warning_enabled;
    document.getElementById("opt-style-row-hover").checked =
      prefs.feature_style_row_hover_enabled;
  
    // Save button updates preferences in chrome.storage.sync
    document.getElementById("save-button").addEventListener("click", async () => {
      const newPrefs = {
        feature_expression_bad_practice_warning_enabled:
          document.getElementById("opt-expression-bad-practice-warning").checked,
        feature_style_row_hover_enabled:
          document.getElementById("opt-style-row-hover").checked
      };
  
      // Store updated preferences
      await new Promise(resolve => {
        chrome.storage.sync.set(newPrefs, resolve);
      });
  
      // Display a temporary status message
      const statusEl = document.getElementById("status");
      statusEl.textContent = "Options saved! Please RELOAD all Editor tabs.";
      setTimeout(() => {
        statusEl.textContent = "";
      }, 4000);
    });
  });
  