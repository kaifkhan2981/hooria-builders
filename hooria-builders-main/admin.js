// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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

// ===== INIT FIREBASE =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== CHECK AUTH STATE =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-app").style.display = "flex"; 
    loadInquiries(); 
  } else {
    document.getElementById("login-screen").style.display = "flex"; 
    document.getElementById("admin-app").style.display = "none";
  }
});

// ===== LOGIN =====
window.adminLogin = async function() {
  const password = document.getElementById("admin-pass").value;
  try {
    await signInWithEmailAndPassword(auth, "admin@hooria.com", password);
  } catch (error) {
    document.getElementById("login-error").innerText = "Invalid password or network error.";
  }
};

// ===== LOGOUT =====
window.adminLogout = function() {
  signOut(auth).then(() => {
     document.getElementById("admin-pass").value = ""; 
  });
};

// ===== SECTION NAVIGATION =====
window.showSection = function(sectionId) {
  document.querySelectorAll(".section-panel").forEach(s => s.style.display = "none");
  document.getElementById(sectionId).style.display = "block";

  // Data load based on section
  if (sectionId === 'inquiries') {
    loadInquiries();
  } else if (sectionId === 'projects') {
    loadProjects();
  }
};

// ===== LOAD INQUIRIES =====
async function loadInquiries() {
  const container = document.getElementById("inquiries-list");
  if(!container) return;
  
  container.innerHTML = "Loading inquiries..."; 
  try {
    const querySnapshot = await getDocs(collection(db, "inquiries"));
    container.innerHTML = ""; 

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No inquiries yet.</p>";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      
      const nameStrong = document.createElement("strong");
      nameStrong.textContent = data.name || "Unknown";
      
      div.appendChild(nameStrong);
      div.appendChild(document.createTextNode(` - ${data.phone || ""} - ${data.apartment || ""}`));
      
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p style='color:red;'>Error loading data.</p>";
  }
}

// ===== ADD NEW PROJECT =====
window.addProject = async function(event) {
  const title = document.getElementById("project-title").value;
  const desc = document.getElementById("project-desc").value;

  if (!title) {
    alert("Please enter a project title!");
    return;
  }

  const btn = event.target;
  btn.innerText = "Adding..."; 

  try {
    await addDoc(collection(db, "projects"), {
      title: title,
      description: desc,
      timestamp: new Date()
    });
    
    document.getElementById("project-title").value = "";
    document.getElementById("project-desc").value = "";
    btn.innerText = "Add New Project";
    
    loadProjects(); 
  } catch (error) {
    console.error("Error adding project: ", error);
    alert("Error adding project!");
    btn.innerText = "Add New Project";
  }
};

// ===== LOAD PROJECTS =====
async function loadProjects() {
  const container = document.getElementById("projects-list");
  if(!container) return;

  container.innerHTML = "Loading projects...";
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    container.innerHTML = ""; 

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No projects found.</p>";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      
      div.innerHTML = `
        <h3>${data.title}</h3>
        <p style="color: #666; font-size: 14px;">${data.description}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p style='color:red;'>Failed to load projects.</p>";
  }
}
