document.addEventListener("DOMContentLoaded", function () {
    console.log("Health Monitor Page Loaded");
});

// if login/signup model using 
const modal = document.getElementById("loginModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");

openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
