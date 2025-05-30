let postButton = document.getElementById("postButton");
let title = document.getElementById("posttitle");
let content = document.getElementById("postcontent");

let confirmBox = document.getElementById("confirmBox");
let confirmY = document.getElementById("confirmY");
let confirmN = document.getElementById("confirmN");
let overlay = document.getElementById("overlay");

postButton.addEventListener("click", openConf); 

// Function to open the confirmation box
function openConf(event) {
    event.preventDefault(); 
    console.log("openConf() called");
    console.log("Title: " + title.value + ": " + title.value.length);
    console.log("Content: " + content.value + ": " + content.value.length);
    
    if (title.value === "" || content.value === "") {
        window.alert("Please do not leave title and content empty");
    } 
    else if(title.value.length > 50) { 
        window.alert("Title is too long. Please keep it under 100 characters.");
    }
    else if(content.value.length > 5000) { 
        window.alert("Content is too long. Please keep it under 5000 characters.");
    }
    else {
        confirmBox.style.display = "block"; 
        overlay.style.display = "block"; 
    }
}

// SUBMIT FORM - CONFIRM YES
confirmY.addEventListener("click", function () {
    console.log("Confirm Yes clicked");
    overlay.style.display = "none"; 
    confirmBox.style.display = "none"; 
    document.getElementById("blogpost").submit(); 
});


// CANCEL FORM - CONFIRM NO
confirmN.addEventListener("click", function () {
    console.log("Confirm No clicked");
    overlay.style.display = "none"; 
    confirmBox.style.display = "none"; 
});