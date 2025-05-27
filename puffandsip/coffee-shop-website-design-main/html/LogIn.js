import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBiJ4S6oNAuStuE78mT6_LwJi0eekhkOl4",
  authDomain: "super-final-web-project.firebaseapp.com",
  projectId: "super-final-web-project",
  storageBucket: "super-final-web-project.appspot.com",
  messagingSenderId: "589145834551",
  appId: "1:589145834551:web:8c72e5c8a38976e503abb2",
  databaseURL: "https://super-final-web-project-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Show message helper
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

//  Make sure to set login state
function setLogInUser(remember = false) {
  if (remember) {
    localStorage.setItem('LogInUser', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
  } else {
    sessionStorage.setItem('LogInUser', 'true');
    sessionStorage.setItem('loginTime', new Date().toISOString());
  }
}

//  Form submission handler
document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login');
  const loginMessage = document.getElementById('loginMessage');

  if (!loginButton) {
    console.error("Login button with ID 'login' not found.");
    return;
  }

  loginButton.addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    // Simple check: make sure both fields are filled
    if (email && password) {
      sessionStorage.setItem('userLoggedIn', 'true');

      // Check if there was a previously stored page the user wanted
      const intendedPage = sessionStorage.getItem('intendedPage');
      if (intendedPage) {
        sessionStorage.removeItem('intendedPage');
        window.location.href = intendedPage;
      } else {
        window.location.href = '/coffee-shop-website-design-main/index.html'; // Default home
      }
    } else {
      if (loginMessage) {
        loginMessage.innerText = 'Please enter both email and password.';
        loginMessage.style.display = 'block';
      }
    }
  });
});
