// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign up event
document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const agreeSignup = document.getElementById("agreeSignup").checked;

  if (!agreeSignup) {
    showMessage("Please agree to the Terms & Conditions.", "signupMessage");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info (excluding password!) to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      address, password,
      email,
      agreeSignup
    });

    showMessage("Sign Up Successful! Redirecting...", "signupMessage");
    setTimeout(() => {
      window.location.href = "LogSign.html"; // Adjust path as needed
    }, 1500);

  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email already in use. Please try another email.", "signupMessage");
    } else {
      showMessage("Unable to create user: " + error.message, "signupMessage");
    }
  }
});
