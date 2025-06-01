window.fbAsyncInit = function() {
    FB.init({
      appId: 'YOUR_FACEBOOK_APP_ID',
      cookie: true,
      xfbml: true,
      version: 'v12.0'
    });

    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            fetchFacebookProfile();
        }
    });
};

function fetchFacebookProfile() {
  FB.api('/me', {fields: 'name,email,picture'}, function(response) {
    const user = {
      id: response.id,
      username: response.name,
      email: response.email,
      profileImage: response.picture.data.url,
      socialProvider: "Facebook"
    };
    
    localStorage.setItem('nutrifittech_user', JSON.stringify(user));
    checkAuthStatus();
    closeModal(registerModal);
  });
}

document.querySelector('.facebook-btn').addEventListener('click', function(e) {
  e.preventDefault();
  FB.login(function(response) {
    if (response.authResponse) {
      fetchFacebookProfile();
    }
  }, {scope: 'public_profile,email'});
});

document.addEventListener("DOMContentLoaded", function () {
    const featureBoxes = document.querySelectorAll(".feature-box");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    featureBoxes.forEach(box => {
        observer.observe(box);
    });

    
    featureBoxes[0].addEventListener("click", function () {
        window.location.href = "meal-plan.html";
    });

    featureBoxes[1].addEventListener("click", function () {
        window.location.href = "workout-tracker.html";
    });

    featureBoxes[2].addEventListener("click", function () {
        window.location.href = "health-monitor.html";
    });

   

   
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const profileModal = document.getElementById("profileModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const openRegisterModalBtn = document.getElementById("openRegisterModalBtn");
    const closeButtons = document.querySelectorAll(".close");
    const showLoginLink = document.getElementById("showLogin");
    const showRegisterLink = document.querySelector(".register-link a");
    const profileLink = document.getElementById("profileLink");
    const profileDropdown = document.querySelector('.profile-dropdown');

    profileDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('show-dropdown');
    });

    document.addEventListener('click', function() {
        profileDropdown.classList.remove('show-dropdown');
    });

    function openModal(modal) {
        modal.style.display = "block";
        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.marginTop = '5%';
        }, 10);
    }

    function closeModal(modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
    }

    openModalBtn.addEventListener("click", () => openModal(loginModal));
    openRegisterModalBtn.addEventListener("click", () => openModal(registerModal));

    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            closeModal(loginModal);
            closeModal(registerModal);
        });
    });
        
    const authButtons = document.getElementById("authButtons");
    const userProfile = document.getElementById("userProfile");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const profileImage = document.getElementById("profileImage");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");
    const googleBtn = document.querySelector(".google-btn");
    const facebookBtn = document.querySelector(".facebook-btn");

    function checkAuthStatus() {
        const user = JSON.parse(localStorage.getItem("nutrifittech_user"));
        if (user) {
            authButtons.style.display = "none";
            userProfile.style.display = "flex";
            usernameDisplay.textContent = user.username;
            const profileImg = document.getElementById("profileImage");
            if (user.socialImage) {
                profileImg.src = user.socialImage;
            } else if (user.profileImage) {
                profileImg.src = user.profileImage;
            } else {
                profileImg.src = "default-profile.png";
            }
        } else {
            authButtons.style.display = "flex";
            userProfile.style.display = "none";
        }
    }

    checkAuthStatus();

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const username = document.getElementById("regUsername").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        document.querySelectorAll(".error-message").forEach(el => el.remove());
        document.querySelectorAll(".success-message").forEach(el => el.remove());

        if (password !== confirmPassword) {
            showError(registerForm, "Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            showError(registerForm, "Password must be at least 6 characters");
            return;
        }

        const users = JSON.parse(localStorage.getItem("nutrifittech_users")) || [];
        const userExists = users.some(user => user.username === username || user.email === email);
        
        if (userExists) {
            showError(registerForm, "Username or email already exists");
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            createdAt: new Date().toISOString(),
            profileImage: "default-profile.png"
        };

        users.push(newUser);
        localStorage.setItem("nutrifittech_users", JSON.stringify(users));
        localStorage.setItem("nutrifittech_user", JSON.stringify(newUser));

        showSuccess(registerForm, "Registration successful! You are now logged in.");
        
        setTimeout(() => {
            registerModal.style.display = "none";
            checkAuthStatus();
        }, 1500);
    });

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const identifier = document.querySelector(".login-form input[type='text']").value;
        const password = document.querySelector(".login-form input[type='password']").value;

        document.querySelectorAll(".error-message").forEach(el => el.remove());
        document.querySelectorAll(".success-message").forEach(el => el.remove());

        const users = JSON.parse(localStorage.getItem("nutrifittech_users")) || [];
        const user = users.find(u => 
            (u.username === identifier || u.email === identifier) && 
            u.password === password
        );

        if (!user) {
            showError(loginForm, "Invalid username/email or password");
            return;
        }

        localStorage.setItem("nutrifittech_user", JSON.stringify(user));
        showSuccess(loginForm, "Login successful!");
        
        setTimeout(() => {
            loginModal.style.display = "none";
            checkAuthStatus();
        }, 1500);
    });

    function handleLogout() {
        if (localStorage.getItem('nutrifittech_user')?.includes('Google')) {
          const auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(() => {
            console.log('Google user signed out');
          });
        }

        if (localStorage.getItem('nutrifittech_user')?.includes('Facebook')) {
          FB.logout(response => {
            console.log('Facebook user signed out', response);
          });
        }

        localStorage.removeItem('nutrifittech_user');
        checkAuthStatus();
        window.location.reload();
    }
      
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    googleBtn.addEventListener("click", function(e) {
        e.preventDefault();
        simulateSocialLogin("Google");
    });

    facebookBtn.addEventListener("click", function(e) {
        e.preventDefault();
        simulateSocialLogin("Facebook");
    });

    function simulateSocialLogin(provider) {
        const spinner = document.createElement("div");
        spinner.className = "spinner";
        const button = provider === "Google" ? googleBtn : facebookBtn;
        button.disabled = true;
        button.innerHTML = '';
        button.appendChild(spinner);
        
        setTimeout(() => {
            const mockUser = {
                id: `social_${Date.now()}`,
                username: `${provider.toLowerCase()}_user`,
                email: `${provider.toLowerCase()}_user@example.com`,
                createdAt: new Date().toISOString(),
                profileImage: "default-profile.png",
                socialProvider: provider
            };

            const users = JSON.parse(localStorage.getItem("nutrifittech_users")) || [];
            users.push(mockUser);
            localStorage.setItem("nutrifittech_users", JSON.stringify(users));
            localStorage.setItem("nutrifittech_user", JSON.stringify(mockUser));

            checkAuthStatus();
            closeModal(registerModal);

            alert(`Successfully logged in with ${provider}`);
        }, 1500);
    }

    
    function onGoogleSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        const user = {
          id: profile.getId(),
          username: profile.getName(),
          email: profile.getEmail(),
          profileImage: profile.getImageUrl(),
          socialProvider: "Google"
        };

        localStorage.setItem('nutrifittech_user', JSON.stringify(user));
        checkAuthStatus();
        closeModal(registerModal);
    }

    document.querySelector(".facebook-btn").addEventListener("click", function(e) {
        e.preventDefault();
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'name,email,picture'}, function(response) {
                    const user = {
                        id: response.id,
                        username: response.name,
                        email: response.email,
                        socialProvider: "Facebook",
                        socialImage: response.picture.data.url,
                        createdAt: new Date().toISOString()
                    };

                    const users = JSON.parse(localStorage.getItem("nutrifittech_users")) || [];
                    users.push(user);
                    localStorage.setItem("nutrifittech_users", JSON.stringify(users));
                    localStorage.setItem("nutrifittech_user", JSON.stringify(user));
                    
                    closeModal(registerModal);
                    checkAuthStatus();
                });
            }
        }, {scope: 'public_profile,email'});
    });

    profileLink.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        profileDropdown.classList.remove('show-dropdown');
        const user = JSON.parse(localStorage.getItem("nutrifittech_user"));
        if (!user) return;
        
        document.getElementById("editUsername").value = user.username;
        document.getElementById("editEmail").value = user.email || "";
        
        const profilePreview = document.getElementById("profilePreview");
        profilePreview.src = user.profileImage || user.socialImage || 'default-profile.png';
        
        openModal(profileModal);
    });

    document.getElementById("changePhotoBtn").addEventListener("click", function() {
        document.getElementById("profileImageInput").click();
    });

    document.getElementById("profileImageInput").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById("profilePreview").src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelector(".profile-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("nutrifittech_user"));
        if (!user) return;
        
        const username = document.getElementById("editUsername").value;
        const email = document.getElementById("editEmail").value;
        const profileImageInput = document.getElementById("profileImageInput");

        user.username = username;
        user.email = email;

        if (profileImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                user.profileImage = event.target.result;
                user.socialImage = null;
                saveUserData(user);
            };
            reader.readAsDataURL(profileImageInput.files[0]);
        } else {
            saveUserData(user);
        }
    });

    function saveUserData(user) {
        localStorage.setItem("nutrifittech_user", JSON.stringify(user));

        const users = JSON.parse(localStorage.getItem("nutrifittech_users")) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem("nutrifittech_users", JSON.stringify(users));
        }
        
        closeModal(profileModal);
        checkAuthStatus();
        showSuccess(profileModal.querySelector(".modal-content"), "Profile updated successfully!");
    }

    function showError(form, message) {
        const errorElement = document.createElement("p");
        errorElement.className = "error-message";
        errorElement.textContent = message;
        form.insertBefore(errorElement, form.lastElementChild);
    }

    function showSuccess(form, message) {
        const successElement = document.createElement("p");
        successElement.className = "success-message";
        successElement.textContent = message;
        form.insertBefore(successElement, form.lastElementChild);
    }

});


document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step-box");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    steps.forEach(step => {
        observer.observe(step);
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

document.addEventListener("DOMContentLoaded", function () {
    function smoothScrollTo(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const href = link.getAttribute("href");

            if (href.includes("#")) {
                e.preventDefault(); 
                const targetId = href.split("#")[1]; 

                if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
                    smoothScrollTo(targetId);
                } else {
                    window.location.href = `index.html#${targetId}`;
                }
            }
        });
    });

    
    
});