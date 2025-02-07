
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

