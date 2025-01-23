document.addEventListener("DOMContentLoaded", async () => {
    // Default preferences in case nothing is saved yet
    const defaults = {
      feature_expression_bad_practice_warning_enabled: true,
      feature_style_row_hover_enabled: true
    };
    const refreshSection = document.getElementById("refreshSection");
    const refreshButton = document.getElementById("refresh-button");
    const refreshAllButton = document.getElementById("refresh-all-button");

    // close popup
    const closePopup = () => {
      setTimeout(() => {
        if (refreshSection) {
          refreshSection.style.display = "none";
        }
        window.close();
      }, 500);
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
        feature_expression_bad_practice_warning_enabled: document.getElementById("opt-expression-bad-practice-warning").checked,
        feature_style_row_hover_enabled: document.getElementById("opt-style-row-hover").checked
      };

      // Store updated preferences
      await new Promise(resolve => {
        chrome.storage.sync.set(newPrefs, resolve);
      });

      // Display a temporary status message
      const statusEl = document.getElementById("status");
      statusEl.textContent = "Options saved! Please reload all Bubble editor tabs for changes to take effect.";
      if (refreshSection) {
        refreshSection.style.display = "flex";
      }
    });
    // Reload tab
    refreshAllButton.addEventListener("click", async () => {
      chrome.tabs.reload();
      closePopup();
    });
    // Reload all Bubble.io tabs
    refreshAllButton.addEventListener("click", async () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.url && tab.url.includes("bubble.io")) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
      closePopup();
    });

    // click close button
    document.getElementById("close-button").addEventListener("click", async () => {
      closePopup();
    });
  });
