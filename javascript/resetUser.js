const logoutButton = document.getElementById("LogoutButton");

logoutButton.addEventListener("click", function () {
    sessionStorage.clear();
    console.log("Session cleared and user logged out.");
});