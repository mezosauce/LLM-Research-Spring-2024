function updateArrow() {
    const idle = document.getElementById("idle");
    const happy = document.getElementById("happy");
    const arrow = document.getElementById("arrow1");
    const arrowhead = document.getElementById("arrowhead1");
    const text = document.getElementById("text1");

    const idleBox = idle.getBBox();
    const happyBox = happy.getBBox();

    const x1 = idleBox.x + idleBox.width / 2;
    const y1 = idleBox.y + idleBox.height;
    const x2 = happyBox.x + happyBox.width / 2;
    const y2 = happyBox.y;

    arrow.setAttribute("x1", x1);
    arrow.setAttribute("y1", y1);
    arrow.setAttribute("x2", x2);
    arrow.setAttribute("y2", y2);

    arrowhead.setAttribute("points", `${x2 - 5},${y2} ${x2 + 5},${y2} ${x2},${y2 + 10}`);

    text.setAttribute("x", x1 + 10);
    text.setAttribute("y", (y1 + y2) / 2);
}

// Update the arrow on page load
updateArrow();