document.addEventListener("DOMContentLoaded", function () {
    const svg = document.querySelector("svg");
    let selectedElement = null;
    let offset = { x: 0, y: 0 };

    function getMousePosition(evt) {
        const CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function startDrag(evt) {
        if (evt.target.tagName === "ellipse") {
            selectedElement = evt.target;
            const mousePos = getMousePosition(evt);
            offset.x = mousePos.x - selectedElement.cx.baseVal.value;
            offset.y = mousePos.y - selectedElement.cy.baseVal.value;
        }
    }

    function drag(evt) {
        if (selectedElement) {
            const mousePos = getMousePosition(evt);
            selectedElement.cx.baseVal.value = mousePos.x - offset.x;
            selectedElement.cy.baseVal.value = mousePos.y - offset.y;
            updateArrows();
        }
    }

    function endDrag() {
        selectedElement = null;
    }

    function updateArrows() {
        const connections = [
            { from: "idle", to: "memberJoined", arrow: "arrowGroup1" },
            { from: "memberJoined", to: "reactionAdded", arrow: "arrowGroup2" },
            { from: "memberJoined", to: "userTagged", arrow: "arrowGroup3" },
            { from: "memberJoined", to: "responseAdded", arrow: "arrowGroup4" },
            { from: "reactionAdded", to: "idle", arrow: "arrowGroup5" },
            { from: "responseAdded", to: "idle", arrow: "arrowGroup6" }
        ];

        connections.forEach(({ from, to, arrow }) => {
            const fromEl = document.getElementById(from);
            const toEl = document.getElementById(to);
            const line = document.querySelector(`#${arrow} line`);
            const polygon = document.querySelector(`#${arrow} polygon`);
            
            if (fromEl && toEl && line && polygon) {
                line.setAttribute("x1", fromEl.cx.baseVal.value);
                line.setAttribute("y1", fromEl.cy.baseVal.value + 25);
                line.setAttribute("x2", toEl.cx.baseVal.value);
                line.setAttribute("y2", toEl.cy.baseVal.value - 25);
                
                polygon.setAttribute("points", `
                    ${toEl.cx.baseVal.value - 5},${toEl.cy.baseVal.value - 25} 
                    ${toEl.cx.baseVal.value + 5},${toEl.cy.baseVal.value - 25} 
                    ${toEl.cx.baseVal.value},${toEl.cy.baseVal.value - 15}
                `);
            }
        });
    }

    svg.addEventListener("mousedown", startDrag);
    svg.addEventListener("mousemove", drag);
    svg.addEventListener("mouseup", endDrag);
    svg.addEventListener("mouseleave", endDrag);
});
