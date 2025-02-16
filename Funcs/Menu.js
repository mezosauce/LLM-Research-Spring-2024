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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// OPTION 2:: TRACE

function showContextMenu(event) {
    event.preventDefault(); // Prevent default right-click behavior

    const contextMenu = document.getElementById("contextMenu");
    if (!contextMenu) {
        console.error("Context menu element not found.");
        return;
    }

    // Show context menu at cursor position
    contextMenu.style.display = "block";
    contextMenu.style.left = event.pageX + "px";
    contextMenu.style.top = event.pageY + "px";

    // Store selected element ID
    contextMenu.dataset.targetId = window.selectedElement.id;
}

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

    let selectedTag = window.selectedElement.tagName.toLowerCase();

    if (selectedTag === 'ellipse') {
        // If a node (ellipse) is selected, find connected arrow groups
        let cx = parseFloat(window.selectedElement.getAttribute("cx"));
        let cy = parseFloat(window.selectedElement.getAttribute("cy"));
        console.log(`Selected ellipse at (${cx}, ${cy})`);

        document.querySelectorAll('line').forEach(arrow => {
            let x1 = parseFloat(arrow.getAttribute("x1"));
            let y1 = parseFloat(arrow.getAttribute("y1"));
            let x2 = parseFloat(arrow.getAttribute("x2"));
            let y2 = parseFloat(arrow.getAttribute("y2"));
            console.log(`Checking line from (${x1}, ${y1}) to (${x2}, ${y2})`);

            if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                let arrowGroup = arrow.closest('g');
                if (arrowGroup) tracedGroups.add(arrowGroup);
            }
        });

    } else if (selectedTag === 'line') {
        // If an arrow (line) is selected, find connected nodes (ellipses)
        let x1 = parseFloat(window.selectedElement.getAttribute("x1"));
        let y1 = parseFloat(window.selectedElement.getAttribute("y1"));
        let x2 = parseFloat(window.selectedElement.getAttribute("x2"));
        let y2 = parseFloat(window.selectedElement.getAttribute("y2"));
        console.log(`Selected line from (${x1}, ${y1}) to (${x2}, ${y2})`);

        document.querySelectorAll('ellipse').forEach(node => {
            let cx = parseFloat(node.getAttribute("cx"));
            let cy = parseFloat(node.getAttribute("cy"));
            console.log(`Checking ellipse at (${cx}, ${cy})`);

            if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                let nodeGroup = node.closest('g');
                if (nodeGroup) tracedGroups.add(nodeGroup);
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
        alert(`Traced ${tracedGroups.size} connected elements.`);
    } else {
        alert("No connected elements found.");
    }
}