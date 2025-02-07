// Edit Text with Textarea
function editText(event) {
    let textElement = event.target;

    // Ensure it's an SVG text element
    if (textElement.tagName !== "text") return;

    let svg = document.querySelector("svg");
    let rect = textElement.getBoundingClientRect();

    // Create an input field
    let input = document.createElement("input");
    input.type = "text";
    input.value = textElement.textContent;
    input.style.position = "absolute";
    input.style.left = `${rect.left + window.scrollX}px`;
    input.style.top = `${rect.top + window.scrollY}px`;
    input.style.width = `${rect.width + 10}px`;
    input.style.height = `${rect.height}px`;
    input.style.fontSize = "12px";
    input.style.border = "1px solid black";
    input.style.padding = "2px";
    input.style.zIndex = "1000"; // Ensure it's above the SVG
    document.body.appendChild(input);
    input.focus();

    // Save changes on Enter or when losing focus
    function saveChanges() {
        textElement.textContent = input.value.trim() === "" ? "NULL" : input.value.trim();
        document.body.removeChild(input);
    }

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            saveChanges();
            e.preventDefault(); // Prevent form submission
        }
    });

    input.addEventListener("blur", saveChanges);
}
