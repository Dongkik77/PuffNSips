import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase config (same as LogIn.js)
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
const db = getFirestore(app);
const auth = getAuth(app);

// Show message helper function
function showMessage(message, type = 'success') {
  const successMessage = document.getElementById('successMessage');
  if (!successMessage) return;
  
  // Update message content and styling based on type
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  const className = type === 'success' ? 'success-message' : 'error-message';
  
  successMessage.className = className;
  successMessage.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  successMessage.style.display = 'block';
  successMessage.scrollIntoView({ behavior: 'smooth' });
  
  // Hide message after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

// Collect feedback data from form
function collectFeedbackData() {
  // Get basic form data
  const customerName = document.getElementById('customerName')?.value;
  const email = document.getElementById('email')?.value;
  const visitDate = document.getElementById('visitDate')?.value;
  const branch = document.getElementById('branch')?.value;
  const comments = document.getElementById('comments')?.value;
  const recommendation = document.getElementById('recommendation')?.value;
  
  // Get ratings from global ratings object
  const coffeeRating = ratings.coffee || 0;
  const vapeRating = ratings.vape || 0;
  const serviceRating = ratings.service || 0;
  const atmosphereRating = ratings.atmosphere || 0;
  
  // Get enjoyed checkboxes
  const enjoyedCheckboxes = document.querySelectorAll('input[name="enjoyed[]"]:checked');
  const enjoyedItems = Array.from(enjoyedCheckboxes).map(cb => cb.value);
  
  return {
    customerName,
    email,
    visitDate,
    branch,
    ratings: {
      coffee: coffeeRating,
      vape: vapeRating,
      service: serviceRating,
      atmosphere: atmosphereRating,
      overall: Math.round((coffeeRating + vapeRating + serviceRating + atmosphereRating) / 4)
    },
    enjoyedMost: enjoyedItems,
    comments,
    recommendation,
    submittedAt: serverTimestamp(),
    userId: auth.currentUser?.uid || null // Include user ID if logged in
  };
}

// Validate form data
function validateFeedbackData(data) {
  const errors = [];
  
  if (!data.customerName?.trim()) {
    errors.push('Customer name is required');
  }
  
  if (!data.email?.trim()) {
    errors.push('Email address is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.visitDate) {
    errors.push('Visit date is required');
  }
  
  if (!data.branch) {
    errors.push('Please select a branch');
  }
  
  if (!data.recommendation) {
    errors.push('Please indicate if you would recommend us');
  }
  
  // Check if at least one rating is provided
  const hasRatings = Object.values(data.ratings).some(rating => rating > 0);
  if (!hasRatings) {
    errors.push('Please provide at least one rating');
  }
  
  return errors;
}

// Submit feedback to Firebase
async function submitFeedback(feedbackData) {
  try {
    // Add document to 'feedback' collection
    const docRef = await addDoc(collection(db, 'feedback'), feedbackData);
    console.log('Feedback submitted with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }
}

// Main form submission handler
async function handleFeedbackSubmission(event) {
  event.preventDefault();
  
  try {
    // Collect and validate data
    const feedbackData = collectFeedbackData();
    const validationErrors = validateFeedbackData(feedbackData);
    
    if (validationErrors.length > 0) {
      showMessage(validationErrors.join('. '), 'error');
      return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    // Submit to Firebase
    const result = await submitFeedback(feedbackData);
    
    if (result.success) {
      showMessage('Thank you for your feedback! We appreciate your input and will use it to improve our service.', 'success');
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000);
      
      // Track feedback submission (optional analytics)
      console.log('Feedback submitted successfully:', result.id);
      
    } else {
      showMessage('Sorry, there was an error submitting your feedback. Please try again.', 'error');
      console.error('Feedback submission failed:', result.error);
    }
    
  } catch (error) {
    console.error('Unexpected error during feedback submission:', error);
    showMessage('An unexpected error occurred. Please try again later.', 'error');
  } finally {
    // Restore submit button
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    submitButton.disabled = false;
  }
}

// Enhanced reset form function
function resetFormEnhanced() {
  const form = document.getElementById('feedbackForm');
  if (form) {
    form.reset();
  }
  
  // Reset star ratings
  if (typeof ratings !== 'undefined') {
    Object.keys(ratings).forEach(key => {
      delete ratings[key];
    });
  }
  
  // Reset visual state of stars
  document.querySelectorAll('.star').forEach(star => {
    star.classList.remove('active');
  });
  
  // Hide any visible messages
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.style.display = 'none';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (feedbackForm) {
    // Replace the existing form submission handler
    feedbackForm.removeEventListener('submit', handleFeedbackSubmission);
    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    
    // Override the global resetForm function if it exists
    if (typeof window.resetForm === 'function') {
      window.resetForm = resetFormEnhanced;
    }
    
    console.log('Firebase feedback integration initialized');
  } else {
    console.error('Feedback form not found');
  }
});

// Export functions for potential external use
window.feedbackModule = {
  submitFeedback,
  resetForm: resetFormEnhanced,
  collectFeedbackData,
  validateFeedbackData
};