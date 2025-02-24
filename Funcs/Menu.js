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
        console.log(`Selected element: ${window.selectedElement ? window.selectedElement.id : 'none'}`);
    });

    // Ensure locked elements can still trigger context menu
    element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        window.selectedElement = event.target.closest('.clickable'); // Ensure the element is selected on right-click
        console.log(`Context menu for element: ${window.selectedElement ? window.selectedElement.id : 'none'}`);
        showContextMenu(event);
    });

    // Prevent dragging of locked elements
    element.addEventListener('mousedown', (event) => {
        if (element.classList.contains('locked')) {
            event.preventDefault();
        }
    });
});

// Define the showContextMenu function
function showContextMenu(event) {
    event.preventDefault(); // Prevent default right-click behavior

    const contextMenu = document.getElementById("contextMenu");
    if (!contextMenu) {
        console.error("Context menu element not found.");
        return;
    }

    if (!window.selectedElement) {
        console.error("No element selected.");
        return;
    }

    // Show context menu at cursor position
    contextMenu.style.display = "block";
    contextMenu.style.left = event.pageX + "px";
    contextMenu.style.top = event.pageY + "px";

    // Store selected element ID
    contextMenu.dataset.targetId = window.selectedElement.id;
}

// OPTION 2:: TRACE

function traceElement() {
    if (!window.selectedElement) {
        alert("No element selected!");
        return;
    }

    // Remove previous highlights
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));

    let selectedGroup = window.selectedElement.closest('g'); // Find the parent <g>

    if (!selectedGroup) {
        alert("No group detected for this element!");
        return;
    }

    let tracedGroups = new Set();
    tracedGroups.add(selectedGroup); // Always highlight the selected group itself

    // Find the actual element within the group
    let selectedElement = selectedGroup.querySelector('ellipse, line');
    if (!selectedElement) {
        alert("No traceable element found within the group!");
        return;
    }

    let selectedTag = selectedElement.tagName.toLowerCase();
    console.log(`Selected tag: ${selectedTag}`);

    if (selectedTag === 'ellipse') {
        // If a node (ellipse) is selected, find connected arrow groups
        let cx = parseFloat(selectedElement.getAttribute("cx"));
        let cy = parseFloat(selectedElement.getAttribute("cy"));
        console.log(`Selected ellipse at (${cx}, ${cy})`);

        document.querySelectorAll('line').forEach(arrow => {
            let x1 = parseFloat(arrow.getAttribute("x1"));
            let y1 = parseFloat(arrow.getAttribute("y1"));
            let x2 = parseFloat(arrow.getAttribute("x2"));
            let y2 = parseFloat(arrow.getAttribute("y2"));
            console.log(`Checking line from (${x1}, ${y1}) to (${x2}, ${y2})`);

            if ((cx === x1 && Math.abs(cy - y1) <= 30) || (cx === x2 && Math.abs(cy - y2) <= 30)) {
                let arrowGroup = arrow.closest('g');
                if (arrowGroup) {
                    tracedGroups.add(arrowGroup);
                    console.log(`Traced edge group: ${arrowGroup.id}`);
                }

                // Check for connected nodes (ellipses)
                document.querySelectorAll('ellipse').forEach(node => {
                    let nodeCx = parseFloat(node.getAttribute("cx"));
                    let nodeCy = parseFloat(node.getAttribute("cy"));
                    console.log(`Checking ellipse at (${nodeCx}, ${nodeCy})`);

                    if ((nodeCx === x1 && Math.abs(nodeCy - y1) <= 30) || (nodeCx === x2 && Math.abs(nodeCy - y2) <= 30)) {
                        let nodeGroup = node.closest('g');
                        if (nodeGroup) {
                            tracedGroups.add(nodeGroup);
                            console.log(`Traced node group: ${nodeGroup.id}`);
                        }
                    }
                });
            }
        });

    } else {
        alert("Selected element is not traceable.");
        return;
    }

    // Apply highlighting effect to all connected groups
    tracedGroups.forEach(group => group.classList.add('highlight'));

    // Provide feedback
    if (tracedGroups.size > 0) {
        let tracedIds = Array.from(tracedGroups).map(group => group.id).join('\n ');
        alert(`Traced ${tracedGroups.size} connected elements: \n ${tracedIds}`);
    } else {
        alert("No connected elements found.");
    }
}