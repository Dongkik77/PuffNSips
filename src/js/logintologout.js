 document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.header .btn');

    // Check sessionStorage or localStorage for login state
    const isLoggedIn = sessionStorage.getItem('LogInUser') === 'true' || localStorage.getItem('LogInUser') === 'true';

    if (isLoggedIn && loginBtn) {
      loginBtn.textContent = 'Logout';
      loginBtn.href = '#'; // prevent navigation on logout

      loginBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Clear login state
        sessionStorage.removeItem('LogInUser');
        sessionStorage.removeItem('loginTime');
        sessionStorage.removeItem('userLoggedIn');
        localStorage.removeItem('LogInUser');
        localStorage.removeItem('loginTime');

        // Optionally show confirmation or redirect
        alert('You have been logged out.');
        window.location.href = '/index.html';
      });
    }
  });
