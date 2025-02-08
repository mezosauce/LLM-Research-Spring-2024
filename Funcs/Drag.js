document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offsetX = 0, offsetY = 0;

    function startDrag(event) {
        if (event.target.tagName === "ellipse" || event.target.tagName === "text") {
            selectedElement = event.target.closest("g").querySelector("ellipse");
            if (!selectedElement) return;

            let cx = parseFloat(selectedElement.getAttribute("cx"));
            let cy = parseFloat(selectedElement.getAttribute("cy"));

            offsetX = event.clientX - cx;
            offsetY = event.clientY - cy;

            document.addEventListener("mousemove", drag);
            document.addEventListener("mouseup", endDrag);
        }
    }

   function drag(event) {
    if (!selectedElement) return;

    let newCx = event.clientX - offsetX;
    let newCy = event.clientY - offsetY;

    // Move the ellipse
    selectedElement.setAttribute("cx", newCx);
    selectedElement.setAttribute("cy", newCy);

    // Move the text inside the group
    let textElement = selectedElement.parentNode.querySelector("text");
    if (textElement) {
        let textWidth = textElement.getBBox().width;
        let textHeight = textElement.getBBox().height;

        // Center the text properly inside the ellipse
        textElement.setAttribute("x", newCx - textWidth / 2);
        textElement.setAttribute("y", newCy + textHeight / 4);
    }

    updateArrows(); // Ensure arrows stay connected properly
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

        if (!idle || !happy || !tada) return;

        let idleX = parseFloat(idle.getAttribute("cx"));
        let idleY = parseFloat(idle.getAttribute("cy")) + parseFloat(idle.getAttribute("ry"));

        let happyX = parseFloat(happy.getAttribute("cx"));
        let happyY = parseFloat(happy.getAttribute("cy")) - parseFloat(happy.getAttribute("ry"));

        let tadaX = parseFloat(tada.getAttribute("cx"));
        let tadaY = parseFloat(tada.getAttribute("cy")) - parseFloat(tada.getAttribute("ry"));

        // Update first arrow (Idle -> Happy Anniversary Detected)
        arrow1.setAttribute("x1", idleX);
        arrow1.setAttribute("y1", idleY);
        arrow1.setAttribute("x2", happyX);
        arrow1.setAttribute("y2", happyY);
        arrowhead1.setAttribute("points", `${happyX - 5},${happyY - 10} ${happyX + 5},${happyY - 10} ${happyX},${happyY}`);

        // Update second arrow (Happy Anniversary Detected -> Tada Raining)
        arrow2.setAttribute("x1", happyX);
        arrow2.setAttribute("y1", happyY + 60);
        arrow2.setAttribute("x2", tadaX);
        arrow2.setAttribute("y2", tadaY - 5);
        arrowhead2.setAttribute("points", `${tadaX - 5},${tadaY - 10} ${tadaX + 5},${tadaY - 10} ${tadaX},${tadaY}`);
    }

    document.querySelectorAll(".clickable").forEach(element => {
        element.addEventListener("mousedown", startDrag);
    });

    updateArrows(); // Ensure arrows are initially positioned correctly
});
