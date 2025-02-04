let contextMenu = document.getElementById("contextMenu");
let selectedElement = null;

// Function to highlight the selected element
function highlightElement(element) {
    if (selectedElement) {
        selectedElement.classList.remove("selected");
    }
    selectedElement = element;
    selectedElement.classList.add("selected");
}
//Group Selecting
//Graph rendering
//Adjust activties in their own page
//Move nodes with edges attached
// Left-click: Highlight element
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", function(event) {
        highlightElement(event.target);
    });
});

// Right-click: Highlight and show context menu
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("contextmenu", function(event) {
        event.preventDefault(); // Prevent default browser menu
        
        highlightElement(event.target); // Ensure the element gets highlighted

        // Show the menu at the cursor position
        contextMenu.style.display = "block";
        contextMenu.style.left = event.pageX + "px";
        contextMenu.style.top = event.pageY + "px";

        // Store selected element
        contextMenu.dataset.targetId = event.target.id;
    });
});

// Close menu when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".menu") && !event.target.closest(".clickable")) {
        closeMenu();
    }
});

function closeMenu() {
    contextMenu.style.display = "none";
}