document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };

    document.querySelectorAll(".clickable").forEach((group) => {
        group.addEventListener("mousedown", startDrag);
    });

    function startDrag(event) {
        let targetGroup = event.target.closest("g");
        if (!targetGroup) return;

        selectedElement = targetGroup;
        let svg = selectedElement.closest("svg");

        // Get the initial mouse position relative to the SVG
        let pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        let transformedPt = pt.matrixTransform(svg.getScreenCTM().inverse());

        // Extract the current transform or set a new one
        let transform = selectedElement.transform.baseVal.consolidate();
        let matrix = transform ? transform.matrix : svg.createSVGMatrix();
        offset.x = transformedPt.x - matrix.e;
        offset.y = transformedPt.y - matrix.f;

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

        updateArrows();
    }

    function endDrag() {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        selectedElement = null;
    }

     // Function to calculate the angle between two points
     function getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    function updateArrows() {
        let idle = document.getElementById("idle");
        let memberJoined = document.getElementsById("memberJoined");
        let reactionAdded = document.getElementById("reactionAdded");
        let 
    }