let contextMenu = document.getElementById("contextMenu");
let selectedElement = null;

// Function to highlight a new element and deselect the previous one
function highlightElement(element) {
    if (selectedElement === element) {
        // If clicking the same element, unhighlight it
        console.log("DEEEEHighlighting (removing from):", element);
        element.classList.remove("selected");
        selectedElement = null;
    } else {
        // Deselect previous element (if any)
        if (selectedElement && selectedElement !== element) {
            console.log("DEEEEHighlighting (removing from):", selectedElement);
            selectedElement.classList.remove("selected");
        }

        // Highlight the new element
        console.log("Highlighting:", element);
        element.classList.add("selected");
        selectedElement = element;
    }
}
// Left-click: Toggle highlight
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", function(event) {
        const targetElement = getTargetGroup(event); // Ensure we highlight the group
        if (targetElement) {
            highlightElement(targetElement);
        }
    });
});

// Right-click: Always highlight and show context menu
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("contextmenu", function(event) {
        event.preventDefault();

        let targetGroup = event.target.closest("g");
        if (!targetGroup) return;

        if (selectedElement !== targetGroup) {
            highlightElement(targetGroup);
        }

        // Show the menu at the cursor position
        contextMenu.style.display = "block";
        contextMenu.style.left = event.pageX + "px";
        contextMenu.style.top = event.pageY + "px";

        // Store selected element
        contextMenu.dataset.targetId = targetGroup.id;
    });
});

// Close menu when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".menu") && !event.target.closest(".clickable")) {
        closeMenu();
    }
});

function closeMenu() {
    contextMenu.style.display = "none";
}

function getTargetGroup(event) {
    let target = event.target;

    // Traverse up until we find a <g> element
    while (target && target.tagName !== "g" && target.tagName !== "svg") {
        target = target.parentNode;
    }

    // Return null if we reach the SVG root without finding a <g>
    return target.tagName === "g" ? target : null;
}
