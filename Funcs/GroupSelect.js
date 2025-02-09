document.addEventListener("DOMContentLoaded", function () {
    let contextMenu = document.getElementById("contextMenu");
    let selectedElements = new Set(); // Store multiple selected elements
    let selectionBox = null;
    let startX = 0, startY = 0;
    let isDragging = false;

    // Function to toggle selection for a single element
    function highlightElement(element) {
        if (selectedElements.has(element)) {
            // If already selected, remove it
            element.classList.remove("selected");
            selectedElements.delete(element);
        } else {
            // Add new selection
            element.classList.add("selected");
            selectedElements.add(element);
        }
    }

    // Function to start a group selection box
    function startSelection(event) {
        if (event.target.tagName !== "svg") return; // Start selection only on empty space

        let svg = event.target;
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        startX = transformedPoint.x;
        startY = transformedPoint.y;
        isDragging = true;

        // Create selection box
        selectionBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        selectionBox.setAttribute("x", startX);
        selectionBox.setAttribute("y", startY);
        selectionBox.setAttribute("width", 0);
        selectionBox.setAttribute("height", 0);
        selectionBox.setAttribute("fill", "rgba(0, 0, 255, 0.3)"); // Transparent blue
        selectionBox.setAttribute("stroke", "blue");
        selectionBox.setAttribute("stroke-dasharray", "4");

        svg.appendChild(selectionBox);

        document.addEventListener("mousemove", updateSelectionBox);
        document.addEventListener("mouseup", endSelection);
    }

    function updateSelectionBox(event) {
        if (!isDragging || !selectionBox) return;

        let svg = selectionBox.ownerSVGElement;
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        let x = Math.min(startX, transformedPoint.x);
        let y = Math.min(startY, transformedPoint.y);
        let width = Math.abs(startX - transformedPoint.x);
        let height = Math.abs(startY - transformedPoint.y);

        selectionBox.setAttribute("x", x);
        selectionBox.setAttribute("y", y);
        selectionBox.setAttribute("width", width);
        selectionBox.setAttribute("height", height);
    }

    function endSelection() {
        if (!selectionBox) return;
        isDragging = false;

        let x = parseFloat(selectionBox.getAttribute("x"));
        let y = parseFloat(selectionBox.getAttribute("y"));
        let width = parseFloat(selectionBox.getAttribute("width"));
        let height = parseFloat(selectionBox.getAttribute("height"));

        let svg = selectionBox.ownerSVGElement;
        let elements = svg.querySelectorAll(".clickable"); // Selectable elements

        selectedElements.clear(); // Reset selection
        elements.forEach(el => {
            let bbox = el.getBBox();
            let elX = bbox.x + bbox.width / 2;
            let elY = bbox.y + bbox.height / 2;

            // Check if element is inside the selection box
            if (elX >= x && elX <= x + width && elY >= y && elY <= y + height) {
                selectedElements.add(el);
                el.classList.add("selected");
            } else {
                el.classList.remove("selected");
            }
        });

        selectionBox.remove();
        selectionBox = null;

        document.removeEventListener("mousemove", updateSelectionBox);
        document.removeEventListener("mouseup", endSelection);
    }

    // Single element selection (left-click)
    document.querySelectorAll(".clickable").forEach(element => {
        element.addEventListener("click", function (event) {
            if (!isDragging) { // Prevent interference with group selection
                const targetElement = getTargetGroup(event);
                if (targetElement) {
                    highlightElement(targetElement);
                }
            }
        });
    });

    // Right-click: Highlight & show context menu
    document.querySelectorAll(".clickable").forEach(element => {
        element.addEventListener("contextmenu", function (event) {
            event.preventDefault();

            let targetGroup = event.target.closest("g");
            if (!targetGroup) return;

            if (!selectedElements.has(targetGroup)) {
                highlightElement(targetGroup);
            }

            // Show context menu
            contextMenu.style.display = "block";
            contextMenu.style.left = event.pageX + "px";
            contextMenu.style.top = event.pageY + "px";

            contextMenu.dataset.targetId = targetGroup.id;
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
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

        return target.tagName === "g" ? target : null;
    }

    document.querySelector("svg").addEventListener("mousedown", startSelection);
});
