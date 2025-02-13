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

    function updateArrows() {
        function getEllipseEdge(cx1, cy1, cx2, cy2, rx, ry) {
            let angle = Math.atan2(cy2 - cy1, cx2 - cx1);
            return {
                x: cx1 + rx * Math.cos(angle),
                y: cy1 + ry * Math.sin(angle)
            };
        }
    
        function updateArrow(arrowId, arrowheadId, startEllipseId, endEllipseId, textId) {
            let startEllipse = document.getElementById(startEllipseId);
            let endEllipse = document.getElementById(endEllipseId);
            let arrow = document.getElementById(arrowId);
            let arrowhead = document.getElementById(arrowheadId);
            let text = document.getElementById(textId);
    
            if (!startEllipse || !endEllipse || !arrow) return;
    
            let startX = parseFloat(startEllipse.getAttribute("cx"));
            let startY = parseFloat(startEllipse.getAttribute("cy"));
            let endX = parseFloat(endEllipse.getAttribute("cx"));
            let endY = parseFloat(endEllipse.getAttribute("cy"));
    
            let startPoint = getEllipseEdge(startX, startY, endX, endY, 
                                            parseFloat(startEllipse.getAttribute("rx")), 
                                            parseFloat(startEllipse.getAttribute("ry")));
    
            let endPoint = getEllipseEdge(endX, endY, startX, startY, 
                                          parseFloat(endEllipse.getAttribute("rx")), 
                                          parseFloat(endEllipse.getAttribute("ry")));
    
            arrow.setAttribute("x1", startPoint.x);
            arrow.setAttribute("y1", startPoint.y);
            arrow.setAttribute("x2", endPoint.x);
            arrow.setAttribute("y2", endPoint.y);
    
            if (arrowhead) {
                updateArrowhead(arrowhead, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            }
    
            if (text) {
                text.setAttribute("x", (startPoint.x + endPoint.x) / 2 + 10);
                text.setAttribute("y", (startPoint.y + endPoint.y) / 2);
            }
        }
    
        function updateArrowhead(arrowhead, startX, startY, endX, endY) {
            let angle = Math.atan2(endY - startY, endX - startX);
            let arrowLength = 10;
    
            let x1 = endX - arrowLength * Math.cos(angle - Math.PI / 6);
            let y1 = endY - arrowLength * Math.sin(angle - Math.PI / 6);
    
            let x2 = endX - arrowLength * Math.cos(angle + Math.PI / 6);
            let y2 = endY - arrowLength * Math.sin(angle + Math.PI / 6);
    
            arrowhead.setAttribute("points", `${endX},${endY} ${x1},${y1} ${x2},${y2}`);
        }
    
        // Updating all arrows with their respective start and end states
        updateArrow("arrow1", "arrowhead1", "idle", "memberJoined", "text1");
        updateArrow("arrow2", "arrowhead2", "memberJoined", "reactionAdded", "text2");
        updateArrow("arrow3", "arrowhead3", "memberJoined", "userTagged", "text3");
        updateArrow("arrow4", "arrowhead4", "memberJoined", "responseAdded", "text4");
        updateArrow("arrow5", null, "reactionAdded", "idle", null); // No arrowhead or text
        updateArrow("arrow6", "arrowhead6", "responseAdded", "idle", "text6");
    
        // Special handling for the curved arrow (Tag Removed)
        let path = document.getElementById("arrow7");
        let arrowhead7 = document.getElementById("arrowhead7");
        let text7 = document.getElementById("text7");
    
        if (path) {
            let userTagged = document.getElementById("userTagged");
            let idle = document.getElementById("idle");
            if (!userTagged || !idle) return;
    
            let startX = parseFloat(userTagged.getAttribute("cx"));
            let startY = parseFloat(userTagged.getAttribute("cy"));
            let endX = parseFloat(idle.getAttribute("cx"));
            let endY = parseFloat(idle.getAttribute("cy"));
    
            let controlX = (startX + endX) / 2 + 200; // Adjust control point for curve
            let controlY = (startY + endY) / 2 - 100;
    
            let newPath = `M ${startX} ${startY} C ${controlX} ${controlY}, ${endX - 20} ${endY - 10}, ${endX} ${endY}`;
            path.setAttribute("d", newPath);
    
            if (arrowhead7) {
                updateArrowhead(arrowhead7, controlX, controlY, endX, endY);
            }
    
            if (text7) {
                text7.setAttribute("x", controlX);
                text7.setAttribute("y", controlY - 10);
            }
        }
    }
});
