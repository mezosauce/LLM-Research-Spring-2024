document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offsetX = 0, offsetY = 0;

    function startDrag(event) {
        let targetGroup = event.target.closest("g");
        if (!targetGroup) return;

        selectedElement = targetGroup.querySelector("ellipse");
        if (!selectedElement) return;

        let svg = selectedElement.ownerSVGElement;
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        let cx = parseFloat(selectedElement.getAttribute("cx"));
        let cy = parseFloat(selectedElement.getAttribute("cy"));

        // Calculate offset from where the user clicked
        offsetX = transformedPoint.x - cx;
        offsetY = transformedPoint.y - cy;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
    }

    function drag(event) {
        if (!selectedElement) return;

        let svg = selectedElement.ownerSVGElement;
        let point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        let newCx = transformedPoint.x - offsetX;
        let newCy = transformedPoint.y - offsetY;

        // Move the ellipse
        selectedElement.setAttribute("cx", newCx);
        selectedElement.setAttribute("cy", newCy);

        // Move the text inside the group
        let textElement = selectedElement.parentNode.querySelector("text");
        if (textElement) {
            textElement.setAttribute("x", newCx);
            textElement.setAttribute("y", newCy);
            textElement.setAttribute("dominant-baseline", "middle");
            textElement.setAttribute("text-anchor", "middle");
        }

        updateArrows();
    }

    function endDrag() {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        selectedElement = null;
    }

    function updateArrows() {
        const svg = document.querySelector("svg");
        if (!svg) return;
    
        const arrows = [
            // Configurations for Activity1.html
            { arrowId: "arrow1", arrowheadId: "arrowhead1", startId: "idle", endId: "memberJoined", textId: "text1" },
            { arrowId: "arrow2", arrowheadId: "arrowhead2", startId: "memberJoined", endId: "reactionAdded", textId: "text2" },
            { arrowId: "arrow3", arrowheadId: "arrowhead3", startId: "memberJoined", endId: "userTagged", textId: "text3" },
            { arrowId: "arrow4", arrowheadId: "arrowhead4", startId: "memberJoined", endId: "responseAdded", textId: "text4" },
            { arrowId: "arrow5", arrowheadId: "arrowhead5", startId: "reactionAdded", endId: "idle", textId: "text5" },
            { arrowId: "arrow6", arrowheadId: "arrowhead6", startId: "responseAdded", endId: "idle", textId: "text6" },
            { arrowId: "arrow7", arrowheadId: "arrowhead7", startId: "userTagged", endId: "idle", textId: "text7" },
            
            // Configurations for Actvity2.html
            { arrowId: "arrow1", arrowheadId: "arrowhead1", startId: "idle", endId: "happy", textId: "text1" },
            { arrowId: "arrow2", arrowheadId: "arrowhead2", startId: "happy", endId: "tada", textId: "text2" },
        ];
    
        arrows.forEach(({ arrowId, arrowheadId, startId, endId, textId }) => {
            const startElement = document.getElementById(startId);
            const endElement = document.getElementById(endId);
            const arrow = document.getElementById(arrowId);
            const arrowhead = document.getElementById(arrowheadId);
            const text = document.getElementById(textId);
    
            if (!startElement || !endElement || !arrow) return;
    
            const startX = parseFloat(startElement.getAttribute("cx"));
            const startY = parseFloat(startElement.getAttribute("cy")) + parseFloat(startElement.getAttribute("ry"));
            const endX = parseFloat(endElement.getAttribute("cx"));
            const endY = parseFloat(endElement.getAttribute("cy")) - parseFloat(endElement.getAttribute("ry"));
    
            if (arrow.tagName === "line") {
                // Update the arrow line
                arrow.setAttribute("x1", startX);
                arrow.setAttribute("y1", startY);
                arrow.setAttribute("x2", endX);
                arrow.setAttribute("y2", endY);
            } else if (arrow.tagName === "path") {
                // Update the arrow path
                const controlX1 = ((startX + endX) / 2) + 200;
                const controlY1 = startY + 50; // Adjust this value to control the curve
                const controlX2 = ((startX + endX) / 2) + 200;
                const controlY2 = endY - 50; // Adjust this value to control the curve
                const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY }`;
                arrow.setAttribute("d", pathData);
            }
    
            // Update the arrowhead
            if (arrowhead) {
                updateArrowhead(arrowhead, startX, startY, endX, endY);
            }
    
            // Update text position
            if (text) {
                text.setAttribute("x", (startX + endX) / 2);
                text.setAttribute("y", (startY + endY) / 2);
            }
        });
    
        function updateArrowhead(arrowhead, startX, startY, endX, endY) {
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowLength = 10;
    
            const x1 = endX - arrowLength * Math.cos(angle - Math.PI / 6);
            const y1 = endY - arrowLength * Math.sin(angle - Math.PI / 6);
    
            const x2 = endX - arrowLength * Math.cos(angle + Math.PI / 6);
            const y2 = endY - arrowLength * Math.sin(angle + Math.PI / 6);
    
            arrowhead.setAttribute("points", `${endX},${endY} ${x1},${y1} ${x2},${y2}`);
        }
    }

    document.querySelectorAll(".clickable").forEach(element => {
        element.addEventListener("mousedown", startDrag);
    });

    updateArrows(); // Ensure initial arrow positions are set correctly
});

