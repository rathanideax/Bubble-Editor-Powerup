// Waits for a specific element to exist in the DOM
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

// Wait for the "Plugins" button to exist
waitForElement('button[data-tab-item="Plugins"]', (pluginsButton) => {
  console.log("Plugins button found:", pluginsButton);

  // Create a new button element
  const newButton = document.createElement('button');
  newButton.className = 'up8wd41'; // Add the same class for styling consistency
  newButton.ariaLabel = 'API Connector'; // Set a meaningful aria-label
  newButton.dataset.tabItem = 'apiconnector'; // Unique data-tab-item
  newButton.id = 'newButton'; // Add an ID for easier targeting
  newButton.innerHTML = `
    <span class="up8wd45">
      <span class="py18712 py1871m">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="py1871p">
          <path d="M16 3C9.27125 3 4 6.075 4 10V22C4 25.925 9.27125 29 16 29C22.7288 29 28 25.925 28 22V10C28 6.075 22.7288 3 16 3Z" fill="currentColor"></path>
        </svg>
      </span>
    </span>
    API Connector
  `;

  // Add a click event listener to the new button
  newButton.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    params.set('❤️plugin', 'apiconnector2'); // Add or update the parameter
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(null, '', newUrl); // Update the URL without reloading
    console.log("API Connector parameter added to URL.");
  });

  // Insert the new button after the "Plugins" button
  pluginsButton.parentElement.insertBefore(newButton, pluginsButton.nextSibling);
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
