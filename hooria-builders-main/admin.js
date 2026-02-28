// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// ===== INIT FIREBASE =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== LOGIN =====
window.adminLogin = async function() {
  const password = document.getElementById("admin-pass").value;

  try {
    await signInWithEmailAndPassword(auth, "admin@hooria.com", password);
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-app").style.display = "block";
    loadInquiries();
  } catch (error) {
    document.getElementById("login-error").innerText = error.message;
  }
};

// ===== LOGOUT =====
window.adminLogout = function() {
  signOut(auth).then(() => location.reload());
};

// ===== SECTION NAVIGATION =====
window.showSection = function(sectionId) {
  document.querySelectorAll(".section-panel").forEach(s => s.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
};

// ===== LOAD INQUIRIES =====
async function loadInquiries() {
  const querySnapshot = await getDocs(collection(db, "inquiries"));
  const container = document.getElementById("inquiries");
  container.innerHTML = "";

  if (querySnapshot.empty) {
    container.innerHTML = "<p>No inquiries yet.</p>";
    return;
  }

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${data.name}</strong> - ${data.phone} - ${data.apartment}`;
    container.appendChild(div);
  });
}
