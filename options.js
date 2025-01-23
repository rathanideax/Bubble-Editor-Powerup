document.addEventListener("DOMContentLoaded", async () => {
    // Default preferences in case nothing is saved yet
    const defaults = {
      feature_expression_bad_practice_warning_enabled: true,
      feature_style_row_hover_enabled: true,
      feature_canvas_left_align_canvas: true,
      feature_data_optionsets_expand_inputs: true,
      feature_data_optionsets_move_gaps: true,
      feature_property_editor_expression_composer_hitboxes: true,
      feature_property_editor_expression_composer_multiline: true,
      feature_property_editor_expression_composers_full_width: true,
      feature_workflow_editor_folder_pop: true
    };
    const refreshSection = document.getElementById("refreshSection");
    const refreshButton = document.getElementById("refresh-button");
    const refreshAllButton = document.getElementById("refresh-all-button");

    // close popup
    const closePopup = (delay = 0) => {
      setTimeout(() => {
        if (refreshSection) {
          refreshSection.style.display = "none";
        }
        window.close();
      }, delay);
    };

    // Retrieve existing preferences or use defaults
    const prefs = await new Promise(resolve => {
      chrome.storage.sync.get(defaults, resolve);
    });

    // Set the checkboxes according to the stored or default preferences
    document.getElementById("expression-bad-practice-warning").checked = prefs.feature_expression_bad_practice_warning_enabled;
    document.getElementById("style-row-hover").checked = prefs.feature_style_row_hover_enabled;
    document.getElementById("expression-bad-practice-warning").checked = prefs.feature_expression_bad_practice_warning_enabled;
    document.getElementById("style-row-hover").checked = prefs.feature_style_row_hover_enabled;
    document.getElementById("canvas-left-align-canvas").checked = prefs.feature_canvas_left_align_canvas;
    document.getElementById("data-optionsets-expand-inputs").checked = prefs.feature_data_optionsets_expand_inputs;
    document.getElementById("data-optionsets-move-gaps").checked = prefs.feature_data_optionsets_move_gaps;
    document.getElementById("property-editor-expression-composer-hitboxes").checked = prefs.feature_property_editor_expression_composer_hitboxes;
    document.getElementById("property-editor-expression-composer-multiline").checked = prefs.feature_property_editor_expression_composer_multiline;
    document.getElementById("property-editor-expression-composers-full-width").checked = prefs.feature_property_editor_expression_composers_full_width;
    document.getElementById("workflow-editor-folder-pop").checked = prefs.feature_workflow_editor_folder_pop;

    // Save button updates preferences in chrome.storage.sync
    document.getElementById("save-button").addEventListener("click", async () => {
      const newPrefs = {
        feature_expression_bad_practice_warning_enabled: document.getElementById("expression-bad-practice-warning").checked,
        feature_style_row_hover_enabled: document.getElementById("style-row-hover").checked,
        feature_canvas_left_align_canvas: document.getElementById("canvas-left-align-canvas").checked,
        feature_data_optionsets_expand_inputs: document.getElementById("data-optionsets-expand-inputs").checked,
        feature_data_optionsets_move_gaps: document.getElementById("data-optionsets-move-gaps").checked,
        feature_property_editor_expression_composer_hitboxes: document.getElementById("property-editor-expression-composer-hitboxes").checked,
        feature_property_editor_expression_composer_multiline: document.getElementById("property-editor-expression-composer-multiline").checked,
        feature_property_editor_expression_composers_full_width: document.getElementById("property-editor-expression-composers-full-width").checked,
        feature_workflow_editor_folder_pop: document.getElementById("workflow-editor-folder-pop").checked
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
    refreshButton.addEventListener("click", async () => {
      chrome.tabs.reload();
      closePopup(500);
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
      closePopup(500);
    });

    // click close button
    document.getElementById("close-button").addEventListener("click", async () => {
      closePopup();
    });
  });
