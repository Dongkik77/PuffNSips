import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
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

// Optional: showMessage function
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

const resetButton = document.getElementById('submit');
resetButton.addEventListener('click', function (e) {
  e.preventDefault();

  const email = document.getElementById('email')?.value;

  if (!email) {
    showMessage("Please enter your email.", "resetMessage");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      showMessage("Password reset email sent!", "resetMessage");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
      showMessage("Failed to send password reset email. Please try again.", "resetMessage");
    });
});
