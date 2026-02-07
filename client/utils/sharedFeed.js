const profile_array = document.querySelectorAll(".profile");
const profileInfo = document.querySelectorAll(".profile_info");

profile_array.forEach((e) => {
    e.addEventListener("click", () => {
        profileInfo.forEach((event) => {
            // Check computed style (from CSS) or inline style
            const computedDisplay = window.getComputedStyle(event).display;
            const inlineDisplay = event.style.display;
            const isHidden = inlineDisplay === "none" || (inlineDisplay === "" && computedDisplay === "none");
            
            if (isHidden) {
                event.style.display = "block";
            } else {
                event.style.display = "none";
            }
        });
    });
});
function SignOut() {
    localStorage.clear();
    window.location.href = "../auth/login.html";
    history.replaceState(null, "", "../auth/login.html");
}
