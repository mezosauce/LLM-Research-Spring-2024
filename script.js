let contextMenu = document.getElementById("contextMenu");
let selectedElement = null;
let offsetX = 0, offsetY = 0;

// Function to highlight a new element and deselect the previous one
function highlightElement(element) {
    if (selectedElement) {
        selectedElement.classList.toggle("selected");
    }

    // Select the new element only if it's different from the previous one
    if (selectedElement !== element) {
        selectedElement = element;
        selectedElement.classList.toggle("selected");
        element = null;
    } else {
        // If clicking the same element, deselect it
        selectedElement = null;
    }
}

// Left-click: Toggle highlight
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", function(event) {
        const targetElement = event.target.closest("g"); // Ensure we highlight the group
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

// Edit Text with Textarea
function editText(event) {
    let textElement = event.target;
    let input = document.createElement("textarea");
    input.value = textElement.textContent;
    input.style.position = "absolute";
    input.style.left = event.pageX + "px";
    input.style.top = event.pageY - 10 + "px";
    input.style.fontSize = textElement.getAttribute("font-size") + "px";
    input.style.width = "200px";
    input.style.height = "20px";

    input.addEventListener("blur", function () {
        textElement.textContent = input.value;
        document.body.removeChild(input);
    });

    document.body.appendChild(input);
    input.focus();
}

// Dragging Functionality

let offset = { x: 0, y: 0 };

function getMousePosition(event) {
    let svg = document.querySelector("svg");
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    let svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    return svgPoint;
}

function startDrag(event) {
    let targetGroup = event.target.closest("g");
    if (!targetGroup || event.target.tagName === "text") return;

    selectedElement = targetGroup;
    
    let mousePos = getMousePosition(event);
    
    let transform = selectedElement.getAttribute("transform");
    let match = transform ? transform.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/) : null;
    
    let currentX = match ? parseFloat(match[1]) : 0;
    let currentY = match ? parseFloat(match[2]) : 0;

    offset.x = mousePos.x - currentX;
    offset.y = mousePos.y - currentY;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
}

function drag(event) {
    if (!selectedElement) return;

    let mousePos = getMousePosition(event);
    
    let newX = mousePos.x - offset.x;
    let newY = mousePos.y - offset.y;

    selectedElement.setAttribute("transform", `translate(${newX}, ${newY})`);
}

function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
    selectedElement = null;
}

// Attach dragging events to the groups
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("mousedown", startDrag);
});

// Close context menu on clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".menu") && !event.target.closest(".clickable")) {
        closeMenu();
    }
});

function closeMenu() {
    document.getElementById("contextMenu").style.display = "none";
}