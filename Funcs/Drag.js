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
        let idle = document.getElementById("idle");
        let happy = document.getElementById("happy");
        let tada = document.getElementById("tada");
    
        let arrow1 = document.getElementById("arrow1");
        let arrowhead1 = document.getElementById("arrowhead1");
        let arrow2 = document.getElementById("arrow2");
        let arrowhead2 = document.getElementById("arrowhead2");
    
        let text1 = document.getElementById("text1");
        let text2 = document.getElementById("text2");
    
        if (!idle || !happy || !tada) return;
    
        let idleX = parseFloat(idle.getAttribute("cx"));
        let idleY = parseFloat(idle.getAttribute("cy")) + parseFloat(idle.getAttribute("ry"));
    
        let happyX = parseFloat(happy.getAttribute("cx"));
        let happyY = parseFloat(happy.getAttribute("cy")) - parseFloat(happy.getAttribute("ry"));
    
        let tadaX = parseFloat(tada.getAttribute("cx"));
        let tadaY = parseFloat(tada.getAttribute("cy")) - parseFloat(tada.getAttribute("ry"));
    
        // Update first arrow (Idle -> Happy)
        arrow1.setAttribute("x1", idleX);
        arrow1.setAttribute("y1", idleY);
        arrow1.setAttribute("x2", happyX);
        arrow1.setAttribute("y2", happyY);
        arrowhead1.setAttribute("points", `${happyX - 5},${happyY - 10} ${happyX + 5},${happyY - 10} ${happyX},${happyY}`);
    
        // Position the text for arrow 1 at the midpoint
        let midX1 = ((idleX + happyX) / 2) + 10;
        let midY1 = (idleY + happyY) / 2;
        text1.setAttribute("x", midX1);
        text1.setAttribute("y", midY1);
    
        // Update second arrow (Happy -> Tada)
        arrow2.setAttribute("x1", happyX);
        arrow2.setAttribute("y1", happyY + 60); // Adjusted for better visual alignment
        arrow2.setAttribute("x2", tadaX);
        arrow2.setAttribute("y2", tadaY - 5);
        arrowhead2.setAttribute("points", `${tadaX - 5},${tadaY - 10} ${tadaX + 5},${tadaY - 10} ${tadaX},${tadaY}`);
    
        // Position the text for arrow 2 at the midpoint
        let midX2 = ((happyX + tadaX) / 2) + 10;
        let midY2 = ((happyY + tadaY) / 2) + 30;
        text2.setAttribute("x", midX2);
        text2.setAttribute("y", midY2);
    }
    

    document.querySelectorAll(".clickable").forEach(element => {
        element.addEventListener("mousedown", startDrag);
    });

    updateArrows(); // Ensure initial arrow positions are set correctly
});

