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

    function updateArrows() {
        let connections = [
            { from: "idle", to: "memberJoined", arrow: "arrowGroup1" },
            { from: "memberJoined", to: "reactionAdded", arrow: "arrowGroup2" },
            { from: "memberJoined", to: "userTagged", arrow: "arrowGroup3" },
            { from: "memberJoined", to: "responseAdded", arrow: "arrowGroup4" },
            { from: "reactionAdded", to: "idle", arrow: "arrowGroup5" },
            { from: "responseAdded", to: "idle", arrow: "arrowGroup6" },
            { from: "userTagged", to: "idle", arrow: "ArrowGroup7" },
        ];

        connections.forEach(({ from, to, arrow }) => {
            let fromEllipse = document.getElementById(from);
            let toEllipse = document.getElementById(to);
            let arrowElement = document.getElementById(arrow);

            if (fromEllipse && toEllipse && arrowElement) {
                let fromCenter = getEllipseCenter(fromEllipse);
                let toCenter = getEllipseCenter(toEllipse);

                let line = arrowElement.querySelector("line");
                if (line) {
                    line.setAttribute("x1", fromCenter.x);
                    line.setAttribute("y1", fromCenter.y);
                    line.setAttribute("x2", toCenter.x);
                    line.setAttribute("y2", toCenter.y);
                }

                let polygon = arrowElement.querySelector("polygon");
                if (polygon) {
                    let angle = Math.atan2(
                        toCenter.y - fromCenter.y,
                        toCenter.x - fromCenter.x
                    );
                    let arrowSize = 10;
                    let arrowX = toCenter.x - arrowSize * Math.cos(angle);
                    let arrowY = toCenter.y - arrowSize * Math.sin(angle);
                    polygon.setAttribute(
                        "points",
                        `${arrowX - 5},${arrowY - 5} ${arrowX + 5},${arrowY - 5} ${arrowX},${arrowY}`
                    );
                }
            }
        });
    }

    function getEllipseCenter(ellipse) {
        let bbox = ellipse.getBBox();
        let transform = ellipse.getCTM();
        return {
            x: bbox.x + bbox.width / 2 + transform.e,
            y: bbox.y + bbox.height / 2 + transform.f,
        };
    }
});
