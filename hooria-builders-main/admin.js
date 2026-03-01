// ===== IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyBXnbzrC6QpNNCJsDoiHRsLWAAE2K0Tl1E",
  authDomain: "studio-1643208753-15448.firebaseapp.com",
  databaseURL: "https://studio-1643208753-15448-default-rtdb.firebaseio.com",
  projectId: "studio-1643208753-15448",
  storageBucket: "studio-1643208753-15448.firebasestorage.app",
  messagingSenderId: "948366616848",
  appId: "1:948366616848:web:1805f6ae6d8961e6ab1d95"
};

// ===== INITIALIZE FIREBASE =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase Initialized ✅");
document.getElementById("login-form")
.addEventListener("submit", adminLogin);

