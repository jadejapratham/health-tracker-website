// not: only for login/signup button or default contact form submission. 

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        
        alert(`Thank you, ${name}! Your message has been sent.`);
        contactForm.reset();
    });
});

const modal = document.getElementById("loginModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");

openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
