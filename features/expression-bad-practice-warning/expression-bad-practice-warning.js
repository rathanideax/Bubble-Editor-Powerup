console.log("Codeless Love plugin running.");
let debounceTimeout;
let isProcessing = false; // Flag to prevent redundant processing


// Outline and add a warning to detected bad practices
function addWarning(nodes, warningTagNode, practiceName, practiceURL, warningText) {
  if (!Array.isArray(nodes) || nodes.length === 0) return;

  // Iterate through the list of nodes to add dashed outline classes
  nodes.forEach((node, index) => {
    if (!node) return; // Skip null or undefined nodes

    // Add the general warning class to all
    node.classList.add('❤️expression-warning');

    // Add specific classes for the first/last nodes. if there's only one node, add both classes
    if (index === 0) {
      node.classList.add('❤️expression-warning-left');
    }
    if (index === nodes.length - 1) {
      node.classList.add('❤️expression-warning-right');
    }
  });

  // Add the warning tag to the specified node
  if (!warningTagNode.querySelector('.❤️expression-warning-tag')) {
    const warningDiv = document.createElement('div');
    warningDiv.textContent = warningText;
    warningDiv.className = '❤️expression-warning-tag';
    if(practiceURL){
      warningDiv.dataset.codelessLovePractice = practiceURL;
      warningDiv.setAttribute(
        'onpointerdown',
        `event.preventDefault(); window.open("${practiceURL}", "_blank");`
      );
    }
    warningTagNode.appendChild(warningDiv);
  }
}

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
    for (let i = 0; i < dynamicSpans.length; i++) {
      const url = new URL(window.location.href);
      const firstItem  = dynamicSpans[i];
      const secondItem = dynamicSpans[i + 1] ?? null;//if we're near the end of the list, these may not exist, so avoid an error by passing null if it isn't there.
      const thirdItem  = dynamicSpans[i + 2] ?? null;
      const fourthItem = dynamicSpans[i + 3] ?? null;
      //console.log(firstItem.textContent);

      // BAD PRACTICE: :count is 0
      const searchItem = firstItem;
      const countItem = secondItem;
      const comparisonItem = thirdItem;
      const zeroItem = fourthItem;
      const validOperators = ['is', 'is not', '>', '<', '≤', '≥'];

      if (
        searchItem?.textContent.match("Search for") &&
        countItem?.textContent.trim() === ':count' &&
        validOperators?.includes(comparisonItem.textContent.trim()) &&
        zeroItem?.textContent.trim() === '0'
      ) {
        console.log('Bad practice detected: ":count is 0"');
        addWarning(
          [searchItem, countItem, comparisonItem, zeroItem],
          zeroItem,
          ":count is 0",
          "https://codeless.love/practice?practice=determine-if-a-list-is-empty",
          "Bad Practice"
        );
      }

      //WARNING PRACTICE: Current User in BackendWorkflows
      if (
        firstItem.textContent.includes("Current User") &&
        url.searchParams.get('tab') === 'BackendWorkflows'
      ) {
        console.log('Warning: "Current user in Backend workflows tab"');
        addWarning([firstItem],
          firstItem,
          "Current User used in Backend",
          null,
          "Warning"
        );
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
  if (element && !element.querySelector('.❤️collapser')) {
    const nestedAncestors = element.closestAll('.nested');  // Custom helper function to get all ancestors with '.nested'
    console.log(nestedAncestors);
    if (nestedAncestors.length >= 2) {//dont show the first one
      const collapser = document.createElement('div');
      collapser.className = '❤️collapser';
      collapser.textContent = '⏷'; // Icon to represent collapse/expand
      element.insertBefore(collapser, element.firstChild);

      // Attach event listener to toggle the collapse
      collapser.addEventListener('click', function() {
        const parent = element.closest('.nested');
        if (parent) {
          parent.classList.toggle('❤️collapsed');
        }
        // Toggle the arrow icon between down and sideways
        if (parent.classList.contains('❤️collapsed')) {
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
        // Check if the node's class list contains a class with ❤️
        if (Array.from(node.classList).some(className => className.includes('❤️'))) {
          // If a class with ❤️ is found, it is something we just inserted. If we insert again, it will cause an infinite loop.
          return;
        }

        // Because: .nested is not mutated directly, but .long-text-composer-wrapper is, so we have to catch that mutating and then get .nested out of it.
        // When exiting expression editor focus, only the <div style=display:inline> element is mutated, so we get it this way to re-draw the triangles.
        // In element condition expressions, it's .expression-composer that mutates
        if (node.matches('.long-text-composer-wrapper') || node.matches('.expression-composer > div:first-child') || node.matches('.expression-composer')) {
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
