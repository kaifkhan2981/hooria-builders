// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
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

// ===== CHECK AUTH STATE (Fix for page reload) =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-app").style.display = "block";
    loadInquiries();
  } else {
    document.getElementById("login-screen").style.display = "block";
    document.getElementById("admin-app").style.display = "none";
  }
});

// ===== LOGIN =====
window.adminLogin = async function() {
  const password = document.getElementById("admin-pass").value;

  try {
    await signInWithEmailAndPassword(auth, "admin@hooria.com", password);
    // UI hide/show ab onAuthStateChanged handle karega
  } catch (error) {
    document.getElementById("login-error").innerText = "Invalid password or network error.";
    console.error("Login Error:", error.message);
  }
};

// ===== LOGOUT =====
window.adminLogout = function() {
  signOut(auth).then(() => {
     // UI hide/show ab onAuthStateChanged handle karega
     document.getElementById("admin-pass").value = ""; // clear password field
  });
};

// ===== SECTION NAVIGATION =====
window.showSection = function(sectionId) {
  document.querySelectorAll(".section-panel").forEach(s => s.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
};

// ===== LOAD INQUIRIES (Secured & Error Handled) =====
async function loadInquiries() {
  const container = document.getElementById("inquiries");
  container.innerHTML = "Loading inquiries..."; // Loading state

  try {
    const querySnapshot = await getDocs(collection(db, "inquiries"));
    container.innerHTML = ""; // Clear loading text

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No inquiries yet.</p>";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      
      // XSS Protection: Using text nodes safely
      const nameStrong = document.createElement("strong");
      nameStrong.textContent = data.name;
      
      div.appendChild(nameStrong);
      div.appendChild(document.createTextNode(` - ${data.phone} - ${data.apartment}`));
      
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    container.innerHTML = "<p style='color:red;'>Error loading data. Check console.</p>";
  }
}
