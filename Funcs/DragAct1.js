document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };
    let svg = document.querySelector("svg");
    let svgRect = svg.getBoundingClientRect();
    
    function getMousePosition(evt) {
        return {
            x: evt.clientX - svgRect.left,
            y: evt.clientY - svgRect.top
        };
    }

    function startDrag(evt) {
        if (evt.target.tagName === "ellipse") {
            selectedElement = evt.target;
            let position = getMousePosition(evt);
            let cx = parseFloat(selectedElement.getAttribute("cx"));
            let cy = parseFloat(selectedElement.getAttribute("cy"));
            offset.x = position.x - cx;
            offset.y = position.y - cy;
        }
    }

    function drag(evt) {
        if (selectedElement) {
            let position = getMousePosition(evt);
            let newX = position.x - offset.x;
            let newY = position.y - offset.y;
            
            // Ensure the element stays within bounds
            let rx = parseFloat(selectedElement.getAttribute("rx"));
            let ry = parseFloat(selectedElement.getAttribute("ry"));
            let minX = rx;
            let maxX = 600 - rx;
            let minY = ry;
            let maxY = 300 - ry;
            
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));
            
            selectedElement.setAttribute("cx", newX);
            selectedElement.setAttribute("cy", newY);
            updateConnections(selectedElement.id, newX, newY);
        }
    }

    function endDrag() {
        selectedElement = null;
    }

    function updateConnections(id, x, y) {
        let arrows = document.querySelectorAll("line, path");
        arrows.forEach(arrow => {
            if (arrow.id.includes(id)) {
                let points = arrow.getAttribute("points");
                if (points) {
                    let coords = points.split(" ").map(p => p.split(",").map(Number));
                    arrow.setAttribute("points", `${x},${y} ${coords[1][0]},${coords[1][1]}`);
                } else {
                    arrow.setAttribute("x1", x);
                    arrow.setAttribute("y1", y);
                }
            }
        });
    }

    svg.addEventListener("mousedown", startDrag);
    svg.addEventListener("mousemove", drag);
    svg.addEventListener("mouseup", endDrag);
    svg.addEventListener("mouseleave", endDrag);
});
