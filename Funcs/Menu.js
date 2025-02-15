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

    let tracedGroups = new Set();

    // Identify if the selected element is a node (ellipse) or an arrow (line)
    let selectedTag = window.selectedElement.tagName.toLowerCase();
    let selectedGroup = window.selectedElement.closest('g'); // Find the parent group

    if (selectedGroup) {
        tracedGroups.add(selectedGroup); // Always highlight the selected group itself
    }

        // Node selected: Find connected arrow groups
        let cx = parseFloat(window.selectedElement.getAttribute("cx"));
        let cy = parseFloat(window.selectedElement.getAttribute("cy"));

        document.querySelectorAll('line').forEach(arrow => {
            let x1 = parseFloat(arrow.getAttribute("x1"));
            let y1 = parseFloat(arrow.getAttribute("y1"));
            let x2 = parseFloat(arrow.getAttribute("x2"));
            let y2 = parseFloat(arrow.getAttribute("y2"));

            if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                let arrowGroup = arrow.closest('g');
                if (arrowGroup) tracedGroups.add(arrowGroup);
            }
        });

    } else if (selectedTag === 'line' || selectedTag === 'polygon') {
        // Arrow selected: Find connected node groups
        if (selectedGroup) {
            let arrow = selectedGroup.querySelector('line'); // Find the main line
            if (arrow) {
                let x1 = parseFloat(arrow.getAttribute("x1"));
                let y1 = parseFloat(arrow.getAttribute("y1"));
                let x2 = parseFloat(arrow.getAttribute("x2"));
                let y2 = parseFloat(arrow.getAttribute("y2"));

                document.querySelectorAll('ellipse').forEach(node => {
                    let cx = parseFloat(node.getAttribute("cx"));
                    let cy = parseFloat(node.getAttribute("cy"));

                    if ((cx === x1 && cy === y1) || (cx === x2 && cy === y2)) {
                        let nodeGroup = node.closest('g');
                        if (nodeGroup) tracedGroups.add(nodeGroup);
                    }
                });
            }
        }
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
