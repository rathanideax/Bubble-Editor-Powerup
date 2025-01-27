document.addEventListener("DOMContentLoaded", async () => {
  // Default preferences in case nothing is saved yet
  const response = await fetch(chrome.runtime.getURL("features.json"));
  const features = await response.json();

  const defaults = features.reduce((acc, feature) => {
    acc[feature.key] = feature.default;
    return acc;
  }, {});
  // Retrieve existing preferences or use defaults
  const prefs = await new Promise(resolve => {
    chrome.storage.sync.get(defaults, resolve);
  });

  const container = document.getElementById("features-list");

  const categories = ["Expressions", "Expression Composers", "Sidebar", "Style Tab", "Design Canvas", "Option Set Tab", "Workflow View"];

  // Group features by categories
  const featuresByCategory = features.reduce((acc, feature) => {
    const category = feature.category || "Uncategorized"; // Default to "Uncategorized" if no category is specified
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {});

  // Display features by category in the defined order
  categories.forEach((category) => {
    if (featuresByCategory[category]) {
      // Create category header
      const categoryHeader = document.createElement("h2");
      categoryHeader.textContent = category;
      container.appendChild(categoryHeader);

      // Iterate through features in the category
      featuresByCategory[category].forEach((feature) => {
        const div = document.createElement("div");
        div.className = "feature";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = prefs[feature.key];
        checkbox.id = feature.key;

        const label = document.createElement("label");
        label.append(checkbox, feature.name);

        div.appendChild(label);

        const description = document.createElement("p");
        description.textContent = feature.description;
        div.appendChild(description);

        container.appendChild(div);
      });
    }
  });

  // Log any undefined categories to the console for debugging
  Object.keys(featuresByCategory).forEach((category) => {
    if (!categories.includes(category)) {
      console.warn(`Category "${category}" is not in the defined categories array.`);
    }
  });

  const notificationStatus = document.getElementById("status");
  const refreshSection = document.getElementById("refreshSection");
  const refreshButton = document.getElementById("refresh-button");
  const refreshAllButton = document.getElementById("refresh-all-button");

  // close popup
  const closePopup = (delay = 0) => {
    setTimeout(() => {
      if (notificationStatus) {
        notificationStatus.style.display = "none";
      }
      if (refreshSection) {
        refreshSection.style.display = "none";
      }
      window.close();
    }, delay);
  };

  // Save button updates preferences in chrome.storage.sync
  document.getElementById("save-button").addEventListener("click", async () => {
    console.log("Save clicked.")
    // Dynamically construct newPrefs object
    const newPrefs = {};
    features.forEach(feature => {
      const checkbox = document.getElementById(feature.key);
      if (checkbox) {
        newPrefs[feature.key] = checkbox.checked;
      }
    });

    // Store updated preferences
    await new Promise(resolve => {
      chrome.storage.sync.set(newPrefs, resolve);
    });
    if (notificationStatus) {
      notificationStatus.textContent = "Options saved! Please reload all Bubble editor tabs for changes to take effect.";
      notificationStatus.style.display = "block";
    }
    if (refreshSection) {
      refreshSection.style.display = "flex";
    }
  });

  // Reload tab
  refreshButton.addEventListener("click", async () => {
    chrome.tabs.reload();
    closePopup(1500);
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
    closePopup(1500);
  });

  // click close button
  document.getElementById("close-button").addEventListener("click", async () => {
    closePopup();
  });
});
