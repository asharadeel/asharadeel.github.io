// Get references to the elements
const postFromPreviewButton = document.getElementById("postFromPreview");
const blogForm = document.getElementById("blogpost");
const previewButton = document.getElementById("preview");
const postTitleInput = document.getElementById("posttitle");
const postContentInput = document.getElementById("postcontent");
const prevoverlay = document.getElementById("prevoverlay"); 
const previewBox = document.getElementById("previewBox");
const closePreviewButton = document.getElementById("closePreview");

// Function to validate the input fields
function validateFields() {
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    // Validation checks
    if (title.length > 50) {
        window.alert("Title is too long. Please keep it under 50 characters.");
        return false; 
    }
    if (content.length > 5000) {
        window.alert("Content is too long. Please keep it under 5000 characters.");
        return false; 
    }
    if (title.length === 0 || content.length === 0) {
        window.alert("Please do not leave title and content empty");
        return false; 
    }

    return true; 
}

// Function to show the preview
function showPreview() {
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    const now = new Date();
    const formattedDate = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC", 
    }) + " UTC";

    const previewContent = document.getElementById("previewContent");
    while (previewContent.firstChild) {
        previewContent.removeChild(previewContent.firstChild);
    }

    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const postTitleDiv = document.createElement("div");
    postTitleDiv.classList.add("posttitle");

    const stylePostTitleDiv = document.createElement("div");
    stylePostTitleDiv.classList.add("styleposttitle");

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;

    const dateElement = document.createElement("p");
    dateElement.classList.add("postdate");
    dateElement.textContent = formattedDate;

    stylePostTitleDiv.appendChild(titleElement);
    stylePostTitleDiv.appendChild(dateElement);

    postTitleDiv.appendChild(stylePostTitleDiv);

    const authorElement = document.createElement("h5");
    authorElement.textContent = `By: ${sessionStorage.getItem('fname')} ${sessionStorage.getItem('lname')}`;

    postTitleDiv.appendChild(authorElement);

    const postContentDiv = document.createElement("div");
    postContentDiv.classList.add("postcontent");

    const contentParagraph = document.createElement("p");
    contentParagraph.classList.add("postcontenttext");
    contentParagraph.textContent = content;

    postContentDiv.appendChild(contentParagraph);

    postDiv.appendChild(postTitleDiv);
    postDiv.appendChild(postContentDiv);

    previewContent.appendChild(postDiv);

    prevoverlay.style.display = "block";
    previewBox.style.display = "block";
}

// Event listener for the "Preview" button
previewButton.addEventListener("click", function (event) {
    event.preventDefault(); 

    if (validateFields()) {
        showPreview();
    }
});

// Event listener for the "Close" button
closePreviewButton.addEventListener("click", function () {
    prevoverlay.style.display = "none";
    previewBox.style.display = "none";
});



// Event listener for the "Post" button in the preview section
postFromPreviewButton.addEventListener("click", function () {
    blogForm.submit();
});