let contextMenu = document.getElementById("contextMenu");
let selectedElement = null;

// Function to highlight a new element and deselect the previous one
function highlightElement(element) {
    if (selectedElement === element && selectedElement !== element) {
        // If clicking the same element, unhighlight it
        element.classList.remove("selected");
        selectedElement = null;
    } else {
        // Deselect previous element (if any)
        if (selectedElement ) {
            selectedElement.classList.remove("selected");
        }

        // Highlight the new element
        element.classList.add("selected");
        selectedElement = element;
    }
}
// Left-click: Toggle highlight
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent event bubbling issues

        const targetElement = getTargetGroup(event);
        if (targetElement) {
            highlightElement(targetElement);
        } else {
            console.log("No target group found.");
        }
    });
});

// Right-click: Always highlight and show context menu
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("contextmenu", function(event) {
        event.preventDefault(); // Prevent default right-click behavior

        const targetGroup = getTargetGroup(event);
        if (!targetGroup) return;

        if (selectedElement !== targetGroup) {
            highlightElement(targetGroup);
        }

        // Show context menu at cursor position
        contextMenu.style.display = "block";
        contextMenu.style.left = event.pageX + "px";
        contextMenu.style.top = event.pageY + "px";

        // Store selected element ID
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

    // Traverse up to find a parent <g> element
    while (target && target.tagName !== "g" && target.tagName !== "svg") {
        target = target.parentNode;
    }


    return target.tagName === "g" ? target : null;
}

