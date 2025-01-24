// List features here!
const featuresConfig = [
    {
      key: "feature_expression_bad_practice_warning",
      cssFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.css",
      jsFile: "features/expression-bad-practice-warning/expression-bad-practice-warning.js"
    },
    {
      key: "feature_style_row_hover",
      cssFile: "features/style-row-hover/style-row-hover.css"
    },
    {
      key: "feature_canvas_left_align_canvas",
      cssFile: "features/canvas-left-align-canvas/canvas-left-align-canvas.css"
    },
    {
      key: "feature_data_optionsets_expand_inputs",
      cssFile: "features/data-optionsets-expand-inputs/data-optionsets-expand-inputs.css"
    },
    {
      key: "feature_data_optionsets_move_gaps",
      cssFile: "features/data-optionsets-move-gaps/data-optionsets-move-gaps.css"
    },
    {
      key: "feature_property_editor_expression_composer_hitboxes",
      cssFile: "features/property-editor-expression-composer-hitboxes/property-editor-expression-composer-hitboxes.css"
    },
    {
      key: "feature_property_editor_expression_composer_multiline",
      cssFile: "features/property-editor-expression-composer-multiline/property-editor-expression-composer-multiline.css"
    },
    {
      key: "feature_property_editor_expression_composers_full_width",
      cssFile: "features/property-editor-expression-composers-full-width/property-editor-expression-composers-full-width.css"
    },
    {
      key: "feature_workflow_editor_folder_pop",
      cssFile: "features/workflow-editor-folder-pop/workflow-editor-folder-pop.css"
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
