// ===== IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyBXnbzrC6QpNNCJsDoiHRsLWAAE2K0Tl1E",
  authDomain: "studio-1643208753-15448.firebaseapp.com",
  projectId: "studio-1643208753-15448",
  storageBucket: "studio-1643208753-15448.firebasestorage.app",
  messagingSenderId: "948366616848",
  appId: "1:948366616848:web:1805f6ae6d8961e6ab1d95"
};

// ===== INIT FIREBASE =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase Initialized ✅");

// ===== WAIT FOR DOM LOAD =====
document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const password = document.getElementById("admin-pass").value;

      try {
        await signInWithEmailAndPassword(auth, "admin@hooria.com", password);
        console.log("Login Successful ✅");
      } catch (error) {
        console.error(error.code);
        alert("Login Failed: " + error.code);
      }
    });
  }

});
