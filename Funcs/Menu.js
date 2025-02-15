// OPTION 1:: PERSERVE
function preserveElement() {
    if (window.selectedElement) { 
        // Toggle the preserved state
        if (window.selectedElement.classList.contains('locked')) {
            window.selectedElement.classList.remove('locked'); // Unlock it
            window.selectedElement.setAttribute("draggable", "true"); // Allow dragging again
            alert("Element is now movable.");
        } else {
            window.selectedElement.classList.add('locked'); // Lock it
            window.selectedElement.setAttribute("draggable", "false"); // Prevent dragging
            alert("Element preserved (locked in place).");
        }
    } else {
        alert("No element selected!");
    }
}
document.querySelectorAll('.clickable').forEach(element => {
    element.addEventListener('click', (event) => {
        window.selectedElement = event.target.closest('.clickable'); // Select the group
    });

    // Ensure locked elements can still trigger context menu
    element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showContextMenu(event);
    });
});

// OPTION 2:: TRACE
function traceElement() {
    if (!window.selectedElement) {
        alert("No element selected!");
        return;
    }

    // Remove previous highlights
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));

    let tracedElements = [];

    // If an arrow (line or polygon) is selected
    if (window.selectedElement.tagName === 'line' || window.selectedElement.tagName === 'polygon') {
        let parentGroup = window.selectedElement.closest('g'); // Get arrow's group

        if (parentGroup) {
            let arrow = parentGroup.querySelector('line'); // Find the line inside group
            if (arrow) {
                let x1 = parseFloat(arrow.getAttribute("x1"));
                let y1 = parseFloat(arrow.getAttribute("y1"));
                let x2 = parseFloat(arrow.getAttribute("x2"));
                let y2 = parseFloat(arrow.getAttribute("y2"));

                document.querySelectorAll('ellipse').forEach(node => {
                    let cx = parseFloat(node.getAttribute("cx"));
                    let cy = parseFloat(node.getAttribute("cy"));

                    if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                        tracedElements.push(node);
                    }
                });

                tracedElements.push(arrow); // Highlight the arrow itself
            }
        }
    }

    // If a node (ellipse) is selected
    if (window.selectedElement.tagName === 'ellipse') {
        let cx = parseFloat(window.selectedElement.getAttribute("cx"));
        let cy = parseFloat(window.selectedElement.getAttribute("cy"));

        document.querySelectorAll('line').forEach(arrow => {
            let x1 = parseFloat(arrow.getAttribute("x1"));
            let y1 = parseFloat(arrow.getAttribute("y1"));
            let x2 = parseFloat(arrow.getAttribute("x2"));
            let y2 = parseFloat(arrow.getAttribute("y2"));

            if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                tracedElements.push(arrow);
                let arrowGroup = arrow.closest('g'); // Find the group
                if (arrowGroup) {
                    let arrowhead = arrowGroup.querySelector('polygon'); // Get arrowhead
                    if (arrowhead) tracedElements.push(arrowhead);
                }
            }
        });

        tracedElements.push(window.selectedElement); // Highlight the node itself
    }

    // Apply highlighting effect
    tracedElements.forEach(el => el.classList.add('highlight'));

    // Provide feedback
    if (tracedElements.length > 0) {
        alert(`Traced ${tracedElements.length} connected elements.`);
    } else {
        alert("No connected elements found.");
    }
}

