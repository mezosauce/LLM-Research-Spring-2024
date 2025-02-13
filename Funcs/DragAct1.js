document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };
    let currentTransform = { x: 0, y: 0 };

    document.querySelectorAll(".clickable").forEach((group) => {
        group.addEventListener("mousedown", startDrag);
    });

    function startDrag(event) {
        let targetGroup = event.target.closest("g");
        if (!targetGroup) return;

        selectedElement = targetGroup;
        let svg = selectedElement.closest("svg");

        let pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        let transformedPt = pt.matrixTransform(svg.getScreenCTM().inverse());

        let transform = selectedElement.transform.baseVal.consolidate();
        let matrix = transform ? transform.matrix : svg.createSVGMatrix();
        
        // Store the original position
        currentTransform.x = matrix.e;
        currentTransform.y = matrix.f;
        
        offset.x = transformedPt.x - currentTransform.x;
        offset.y = transformedPt.y - currentTransform.y;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
    }

    function drag(event) {
        if (!selectedElement) return;

        let svg = selectedElement.closest("svg");
        let pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        let transformedPt = pt.matrixTransform(svg.getScreenCTM().inverse());

        let newX = transformedPt.x - offset.x;
        let newY = transformedPt.y - offset.y;

        selectedElement.setAttribute("transform", `translate(${newX}, ${newY})`);

        updateArrows(selectedElement, newX, newY);
    }

    function endDrag() {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        selectedElement = null;
    }

    function updateArrows(element, newX, newY) {
        // Implement arrow updates (you might need to adjust based on connections)
        let elementId = element.id;

        document.querySelectorAll("line, path").forEach((arrow) => {
            if (arrow.id.includes(elementId)) {
                // Example: Update the arrow position dynamically (simplified)
                let x1 = parseFloat(arrow.getAttribute("x1"));
                let y1 = parseFloat(arrow.getAttribute("y1"));
                let x2 = parseFloat(arrow.getAttribute("x2"));
                let y2 = parseFloat(arrow.getAttribute("y2"));

                let dx = newX - currentTransform.x;
                let dy = newY - currentTransform.y;

                arrow.setAttribute("x1", x1 + dx);
                arrow.setAttribute("y1", y1 + dy);
                arrow.setAttribute("x2", x2 + dx);
                arrow.setAttribute("y2", y2 + dy);
            }
        });
    }
});
