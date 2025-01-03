console.log("Codeless Love plugin running.");
let debounceTimeout;
let isProcessing = false; // Flag to prevent redundant processing

// Function to detect bad practices
function detectBadPractices() {
  if (isProcessing) return; // If already processing, do nothing
  isProcessing = true; // Set flag to indicate processing

  // Find all `.nested` elements that may contain the pattern
  const nestedContainers = document.querySelectorAll('div.nested');

  nestedContainers.forEach(container => {
    // Get all `span.dynamic` elements within this container
    const dynamicSpans = container.querySelectorAll('span.dynamic');

    // Iterate through the spans to check for the specific pattern
    for (let i = 0; i < dynamicSpans.length - 3; i++) {
      const searchItem = dynamicSpans[i];
      const countItem = dynamicSpans[i+1];
      const comparisonItem = dynamicSpans[i + 2];
      const zeroItem = dynamicSpans[i + 3];
      const practiceURL = "https://codeless.love/practice?practice=determine-if-a-list-is-empty";
      const validOperators = ['is', 'is not', '>', '<', '≤', '≥'];

      if (searchItem.textContent.match("Search for") && countItem.textContent.trim() === ':count' && validOperators.includes(comparisonItem.textContent.trim()) && zeroItem.textContent.trim() === '0') {
        console.log('Bad practice detected: ":count is 0"');

        // Add custom classes to highlight the issue
        searchItem.classList.add('❤️expression-warning', '❤️expression-warning-left');
        countItem.classList.add('❤️expression-warning');
        comparisonItem.classList.add('❤️expression-warning');
        zeroItem.classList.add('❤️expression-warning', '❤️expression-warning-right');

        // Check if the added node already has an expression-warning-tag
        if (!zeroItem.querySelector('.❤️expression-warning-tag')) {
          // Create warning DIV
          const warningDiv = document.createElement('div');
          warningDiv.textContent = "Bad practice";
          warningDiv.className = '❤️expression-warning-tag';
          warningDiv.dataset.codelessLovePractice = practiceURL;
          warningDiv.setAttribute(
            'onpointerdown',
            `event.preventDefault(); window.open("${practiceURL}", "_blank");`
          );
          zeroItem.appendChild(warningDiv);
        }
      }
    }
  });
  isProcessing = false; // Reset flag after processing
}

// Initial detection on page load
detectBadPractices();


// Insert collapser when .nested element is added
function insertCollapser(element) {
  // Ensure it's not already present
  if (element && !element.querySelector('.collapser')) {
    const nestedAncestors = element.closestAll('.nested');  // Custom helper function to get all ancestors with '.nested'
    console.log(nestedAncestors);
    if (nestedAncestors.length >= 2) {//dont show the first one
      const collapser = document.createElement('div');
      collapser.className = 'collapser';
      collapser.textContent = '⏷'; // Icon to represent collapse/expand
      element.insertBefore(collapser, element.firstChild);

      // Attach event listener to toggle the collapse
      collapser.addEventListener('click', function() {
        const parent = element.closest('.nested');
        if (parent) {
          parent.classList.toggle('collapsed');
        }
        // Toggle the arrow icon between down and sideways
        if (parent.classList.contains('collapsed')) {
          collapser.textContent = '⏵'; // Sideways arrow
        } else {
          collapser.textContent = '⏷'; // Down arrow
        }
      });
    }
  }
}

// Initial detection on page load
insertCollapser(document.querySelector(".nested"));

// Set up a MutationObserver to watch for DOM changes (with debounce)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // Check if the node is an element node (not text or comment node)
      if (node.nodeType === Node.ELEMENT_NODE) {
        // // Check if the node's class list contains a class with ❤️
        // if (Array.from(node.classList).some(className => className.includes('❤️'))) {
        //   // If a class with ❤️ is found, don't trigger bad practice detection
        //   debugger;
        //   return;
        // }

console.log(node);
        // Because: .nested is not mutated directly, but .long-text-composer-wrapper is, so we have to catch that mutating and then get .nested out of it.
        // When exiting expression editor focus, only the <div style=display:inline> element is mutated, so we get it this way to re-draw the triangles.
        if (node.matches('.long-text-composer-wrapper') || node.matches('.expression-composer > div:first-child')) {
          // Look for .nested inside this node
          const nestedElements = node.querySelectorAll('.nested');
          nestedElements.forEach(nested => {
            insertCollapser(nested);
          });
        }

        // Because: When clicking on a part of the expression, .nested is mutated while .long-text-composer-wrapper is not.
        if (node.matches('.nested')) {
          insertCollapser(node);
        }

        // Check if nodes were added or modified
        if (!isProcessing && mutation.type === 'childList' || mutation.type === 'subtree') {
          // Clear the previous timeout if there is one
          clearTimeout(debounceTimeout);
          // Set a new timeout to run the function after a short delay
          debounceTimeout = setTimeout(() => {
            detectBadPractices(); // Run the function to check for bad practices
          }, 300);
        }
      }
    });
  });
});

// Start observing the body or a specific parent element
observer.observe(document.body, {
  childList: true, // Watch for child nodes being added/removed
  subtree: true,   // Watch within all descendant nodes
  characterData: true // Watch for text content changes
});


// Polyfill for closestAll to get all ancestors with a specific class
Element.prototype.closestAll = function(selector) {
  let ancestors = [];
  let currentElement = this;
  while (currentElement) {
    if (currentElement.matches(selector)) {
      ancestors.push(currentElement);
    }
    currentElement = currentElement.parentElement;
  }
  return ancestors;
};
