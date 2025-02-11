document.addEventListener("DOMContentLoaded", function () {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };
    const svg = document.querySelector("svg");

    function onMouseDown(event) {
        if (event.target.tagName === "ellipse") {
            selectedElement = event.target;
            let bbox = selectedElement.getBBox();
            offset.x = event.clientX - bbox.x - bbox.width / 2;
            offset.y = event.clientY - bbox.y - bbox.height / 2;
        }
    }

    function onMouseMove(event) {
        if (selectedElement) {
            let newX = event.clientX - offset.x;
            let newY = event.clientY - offset.y;
            let bbox = svg.viewBox.baseVal;
            
            // Restrict movement within SVG boundaries
            newX = Math.max(bbox.x + 50, Math.min(newX, bbox.x + bbox.width - 50));
            newY = Math.max(bbox.y + 25, Math.min(newY, bbox.y + bbox.height - 25));
            
            selectedElement.setAttribute("cx", newX);
            selectedElement.setAttribute("cy", newY);
            updateArrows();
        }
    }

    function onMouseUp() {
        selectedElement = null;
    }

    function updateArrows() {
        const arrows = document.querySelectorAll("line, polygon, path");
        arrows.forEach((arrow) => {
            let fromId = arrow.dataset.from;
            let toId = arrow.dataset.to;
            if (fromId && toId) {
                let from = document.getElementById(fromId);
                let to = document.getElementById(toId);
                if (from && to) {
                    let fromX = from.getAttribute("cx");
                    let fromY = from.getAttribute("cy");
                    let toX = to.getAttribute("cx");
                    let toY = to.getAttribute("cy");
                    
                    arrow.setAttribute("x1", fromX);
                    arrow.setAttribute("y1", fromY);
                    arrow.setAttribute("x2", toX);
                    arrow.setAttribute("y2", toY);
                }
            }
        });
    }

    svg.addEventListener("mousedown", onMouseDown);
    svg.addEventListener("mousemove", onMouseMove);
    svg.addEventListener("mouseup", onMouseUp);
});
