// document.addEventListener("DOMContentLoaded", function () {
//     const contactForm = document.getElementById("contactForm");

//     contactForm.addEventListener("submit", function (e) {
//         e.preventDefault();
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const message = document.getElementById("message").value;

        
//         alert(`Thank you, ${name}! Your message has been sent.`);
//         contactForm.reset();
//     });
// });

// const modal = document.getElementById("loginModal");
// const openModalBtn = document.getElementById("openModalBtn");
// const closeModal = document.querySelector(".close");

// openModalBtn.addEventListener("click", () => {
//     modal.style.display = "block";
// });

// closeModal.addEventListener("click", () => {
//     modal.style.display = "none";
// });

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      alert("Thank you! Your message has been sent.");
      contactForm.reset();
    } else {
      alert("Oops! Something went wrong.");
    }
  });
});

