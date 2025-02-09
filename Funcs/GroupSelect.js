document.addEventListener("DOMContentLoaded", function () {
    let selectionBox = null;
    let startX = 0, startY = 0;
    let selectedElements = new Set();
    let isDragging = false;

    function startSelection(event) {
        if (event.target.tagName !== "svg") return; // Only start on empty SVG space

        let svg = event.target;
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        startX = transformedPoint.x;
        startY = transformedPoint.y;
        isDragging = true;

        // Create the selection box
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
        let elements = svg.querySelectorAll("ellipse"); // Adjust for other elements if needed

        selectedElements.clear();
        elements.forEach(el => {
            let cx = parseFloat(el.getAttribute("cx"));
            let cy = parseFloat(el.getAttribute("cy"));
            let rx = parseFloat(el.getAttribute("rx"));
            let ry = parseFloat(el.getAttribute("ry"));

            // Check if the ellipse center is inside the selection box
            if (cx >= x && cx <= x + width && cy >= y && cy <= y + height) {
                selectedElements.add(el);
                el.setAttribute("stroke", "red");
                el.setAttribute("stroke-width", "2");
            } else {
                el.removeAttribute("stroke");
                el.removeAttribute("stroke-width");
            }
        });

        selectionBox.remove();
        selectionBox = null;

        document.removeEventListener("mousemove", updateSelectionBox);
        document.removeEventListener("mouseup", endSelection);
    }

    document.querySelector("svg").addEventListener("mousedown", startSelection);
});