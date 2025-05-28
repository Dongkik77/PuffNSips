// Authentication System for PuffnSip
// This file handles user login status and page protection

//  Check if user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('LogInUser') === 'true' || 
           localStorage.getItem('LogInUser') === 'true';
}

//  Set user login status
function setLogInUser(remember = false) {
    const loginTime = new Date().toISOString();
    if (remember) {
        localStorage.setItem('LogInUser', 'true');
        localStorage.setItem('loginTime', loginTime);
    } else {
        sessionStorage.setItem('LogInUser', 'true');
        sessionStorage.setItem('loginTime', loginTime);
    }
}

//  Log user out
function logUserOut() {
    sessionStorage.removeItem('LogInUser');
    sessionStorage.removeItem('loginTime');
    localStorage.removeItem('LogInUser');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('LoggedInUser');
}

//  Save current page for redirect after login
function storeIntendedPage(page) {
    sessionStorage.setItem('intendedPage', page);
}

//  Protect checkout page
function protectCheckoutPage() {
    if (!isUserLoggedIn()) {
        alert('Please log in to access the checkout page.');
        storeIntendedPage(window.location.pathname);
        window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
        return false;
    }
    return true;
}

//  Update nav button to "Logout" or "Login"
function updateNavigation() {
    const loginBtn = document.querySelector('.new-user .btn');
    if (loginBtn) {
        if (isUserLoggedIn()) {
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                logUserOut();
                alert('You have been logged out successfully!');
                window.location.href = '/coffee-shop-website-design-main/index.html';
            };
        } else {
            loginBtn.textContent = 'Login/Signup';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
            };
        }
    }
}

//  Prevent access to checkout links if not logged in
function protectCheckoutLinks() {
    const checkoutLinks = document.querySelectorAll('a[href*="Checkout.html"]');
    checkoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!isUserLoggedIn()) {
                e.preventDefault();
                alert('Please log in to access the checkout page.');
                storeIntendedPage('/coffee-shop-website-design-main/html/Checkout.html');
                window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
            }
        });
    });
}

//  Initialize checks when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    protectCheckoutLinks();

    // Only protect checkout if we're on that page
    if (window.location.pathname.includes('Checkout.html')) {
        protectCheckoutPage();
    }

    //  DEBUG (optional): log login state
    console.log("Login status:", isUserLoggedIn());
});
