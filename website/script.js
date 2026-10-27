function changeTheme() {
    document.querySelectorAll(".light").forEach((div) => {
        div.classList.toggle("dark-theme");
    });
    document.querySelector(".container").classList.toggle("dark-bg")
}
changeTheme();