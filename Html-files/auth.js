// Simple authentication handling without Firebase
console.log("Auth script loaded");

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loginLink = document.querySelector('.nav-link[href="Html-files/login.html"]');
    const signUpLink = document.querySelector('.nav-link[href="Html-files/signup.html"]');
    
    if (isLoggedIn === "true") {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (signUpLink) signUpLink.style.display = 'none';
        
        // Create and insert profile link
        const profileLink = document.createElement('a');
        profileLink.textContent = 'Profile';
        profileLink.href = 'Html-files/profile.html';
        profileLink.className = 'nav-link';
        
        // Create and insert logout link
        const logoutLink = document.createElement('a');
        logoutLink.textContent = 'Logout';
        logoutLink.href = '#';
        logoutLink.className = 'nav-link';
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("username");
            window.location.href = "../index.html"; 
        });
        
        const navList = document.querySelector('.navbar-nav');
        if (navList && loginLink) {
            navList.insertBefore(profileLink, loginLink); 
            navList.insertBefore(logoutLink, loginLink); 
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (signUpLink) signUpLink.style.display = 'block';
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});