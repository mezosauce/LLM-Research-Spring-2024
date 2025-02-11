let contextMenu = document.getElementById("contextMenu");
let selectedElement = null;

// Function to highlight a new element and deselect the previous one
function highlightElement(element) {
    // Deselect previous selection if it exists and is different from the new selection
    if (selectedElement && selectedElement !== element) {
        console.log("Deselecting previous:", selectedElement);
        selectedElement.classList.remove("selected");
    }

    // Toggle selection for the clicked element
    if (selectedElement === element) {
        console.log("Deselecting:", element);
        element.classList.remove("selected");
        selectedElement = null;
    } else {
        console.log("Selecting:", element);
        element.classList.add("selected");
        selectedElement = element;
    }
}
// Left-click: Toggle highlight
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent event bubbling issues
        console.log("Clicked element:", event.target);

        const targetElement = getTargetGroup(event);
        if (targetElement) {
            console.log("Target group found:", targetElement.id);
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

    console.log("getTargetGroup detected:", target ? target.id : "No group found");

    return target.tagName === "g" ? target : null;
}

