console.log("Sidebar Link");

function waitForElement(selector, callback, timeout = 5000) {
  const startTime = Date.now();
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect(); // Stop observing once the element is found
      callback(element);
    } else if (Date.now() - startTime > timeout) {
      console.error(`Element ${selector} not found within ${timeout}ms`);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Wait for the Plugins button to exist and then create the new element
waitForElement('button[data-tab-item="Plugins"]', (pluginsButton) => {
  console.log("Plugins button found:", pluginsButton);

  // Create a new <span> element
  const newSpan = document.createElement('span');
  newSpan.className = '_1ox6jxm6';

  // Create the new button
  const newButton = document.createElement('button');
  newButton.className = 'up8wd41'; // Use the same class for styling
  newButton.ariaLabel = 'API Connector'; // Accessible label
  newButton.dataset.tabItem = 'API Connector';

  // Add inner content, including the custom SVG for "API"
  newButton.innerHTML = `
    <span class="up8wd45">
      <span class="py18712 py1871m">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="py1871p">
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="14" fill="currentColor" font-family="Arial, sans-serif">
            API
          </text>
        </svg>
      </span>
    </span>
  `;

  // Go to API Connector when it's clicked
  // -------------------------------------
  // Preserve the following parameters with whatever they currently have:
  //  * id
  //  * name
  //
  // Update or add the following parameters to match this
  //  * tab=Plugins
  //  * type=custom
  //  * ❤️plugin=apiconnector2
  //
  // Remove all other parameters.
  //
  newSpan.addEventListener('click', () => {
    const currentParams = new URLSearchParams(window.location.search);

    // Preserve the 'id' and 'name' parameters
    const preservedParams = {};
    if (currentParams.has('id')) {
      preservedParams.id = currentParams.get('id');
    }
    if (currentParams.has('name')) {
      preservedParams.name = currentParams.get('name');
    }

    // Update or add the specified parameters
    const updatedParams = {
      ...preservedParams, // Include preserved parameters
      tab: 'Plugins',
      type: 'custom',
      '❤️plugin': 'apiconnector2', // Add the custom plugin parameter
    };

    // Build the new URLSearchParams with only the required parameters
    const newParams = new URLSearchParams(updatedParams);

    // Construct the new URL and update the history
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    history.pushState(null, '', newUrl); // Update the URL without reloading
    // Trigger a popstate event so Bubble actually sees this happens
    window.dispatchEvent(new PopStateEvent('popstate'));
    console.log("Updated URL:", newUrl);
  });

  // Append the button to the new span
  newSpan.appendChild(newButton);

  // Insert the new span element after the "Plugins" button's parent
  pluginsButton.parentElement.parentElement.insertBefore(newSpan, pluginsButton.parentElement.nextSibling);
});

// Parse the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Check if the parameter matches the expected value
if (urlParams.get('❤️plugin') === 'apiconnector2') {
  // Find the element with data-id="apiconnector2"
  const element = document.querySelector('[data-id="apiconnector2"]');

  // Trigger a click on the element if it exists
  if (element) {
    console.log('Triggering click on API Connector element.');
    element.click();
  }
}
