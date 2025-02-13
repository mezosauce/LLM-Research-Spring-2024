document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };
    let connections = {}; // Store connections between elements and arrows

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

        let bbox = selectedElement.getBBox(); // Get current element position
        offset.x = transformedPt.x - bbox.x;
        offset.y = transformedPt.y - bbox.y;

        // Store connected arrows
        let elementId = selectedElement.id;
        connections = findConnections(elementId);

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

        updateArrows(connections, newX, newY);
    }

    function endDrag() {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        selectedElement = null;
    }

    function findConnections(elementId) {
        let connectedArrows = [];

        document.querySelectorAll("line").forEach((arrow) => {
            let x1 = parseFloat(arrow.getAttribute("x1"));
            let y1 = parseFloat(arrow.getAttribute("y1"));
            let x2 = parseFloat(arrow.getAttribute("x2"));
            let y2 = parseFloat(arrow.getAttribute("y2"));

            let sourceNode = document.getElementById(elementId);
            if (!sourceNode) return;

            let bbox = sourceNode.getBBox();
            let centerX = bbox.x + bbox.width / 2;
            let centerY = bbox.y + bbox.height / 2;

            if (Math.abs(x1 - centerX) < 10 && Math.abs(y1 - centerY) < 10) {
                connectedArrows.push({ arrow, isStart: true });
            } else if (Math.abs(x2 - centerX) < 10 && Math.abs(y2 - centerY) < 10) {
                connectedArrows.push({ arrow, isStart: false });
            }
        });

        return connectedArrows;
    }

    function updateArrows(connectedArrows, newX, newY) {
        connectedArrows.forEach(({ arrow, isStart }) => {
            let bbox = selectedElement.getBBox();
            let centerX = newX + bbox.width / 2;
            let centerY = newY + bbox.height / 2;

            if (isStart) {
                arrow.setAttribute("x1", centerX);
                arrow.setAttribute("y1", centerY);
            } else {
                arrow.setAttribute("x2", centerX);
                arrow.setAttribute("y2", centerY);
            }

            // Update the arrowhead position and rotation
            let arrowhead = document.getElementById(arrow.id.replace("arrow", "arrowhead"));
            if (arrowhead) {
                updateArrowhead(arrow, arrowhead);
            }
        });
    }

    function updateArrowhead(arrow, arrowhead) {
        let x1 = parseFloat(arrow.getAttribute("x1"));
        let y1 = parseFloat(arrow.getAttribute("y1"));
        let x2 = parseFloat(arrow.getAttribute("x2"));
        let y2 = parseFloat(arrow.getAttribute("y2"));

        let angle = Math.atan2(y2 - y1, x2 - x1);
        let arrowheadX = x2 - 10 * Math.cos(angle);
        let arrowheadY = y2 - 10 * Math.sin(angle);

        let points = `
            ${arrowheadX + 5 * Math.sin(angle)},${arrowheadY - 5 * Math.cos(angle)}
            ${x2},${y2}
            ${arrowheadX - 5 * Math.sin(angle)},${arrowheadY + 5 * Math.cos(angle)}
        `;
        arrowhead.setAttribute("points", points);
    }
});
