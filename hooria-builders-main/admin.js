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
  } else if (sectionId === 'posts') {
    loadPosts();
  } else if (sectionId === 'pages') {
    loadPages(); // Pages load karega
  } else if (sectionId === 'content') {
    loadContent(); // Content load karega
  }
};

// ===== LOAD INQUIRIES (Updated with Delete) =====
async function loadInquiries() {
  const container = document.getElementById("inquiries-list");
  if(!container) return;
  container.innerHTML = "Loading inquiries..."; 
  try {
    const querySnapshot = await getDocs(collection(db, "inquiries"));
    container.innerHTML = ""; 
    if (querySnapshot.empty) { container.innerHTML = "<p>No inquiries yet.</p>"; return; }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      
      div.innerHTML = `
        <div>
          <strong>${data.name || "Unknown"}</strong> - ${data.phone || ""} - ${data.apartment || ""}
        </div>
        <button onclick="deleteItem('inquiries', '${docSnap.id}')" style="background: #ff4c4c; margin: 0; padding: 6px 10px;"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    });
  } catch (error) { container.innerHTML = "<p style='color:red;'>Error loading data.</p>"; }
}

// ===== LOAD PROJECTS (Updated with Delete) =====
async function loadProjects() {
  const container = document.getElementById("projects-list");
  if(!container) return;
  container.innerHTML = "Loading projects...";
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    container.innerHTML = ""; 
    if (querySnapshot.empty) { container.innerHTML = "<p>No projects found.</p>"; return; }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      
      div.innerHTML = `
        <div>
          <h3>${data.title}</h3>
          <p style="color: #666; font-size: 14px;">${data.description}</p>
        </div>
        <button onclick="deleteItem('projects', '${docSnap.id}')" style="background: #ff4c4c; margin-top: 0; height: fit-content;"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    });
  } catch (error) { container.innerHTML = "<p style='color:red;'>Failed to load projects.</p>"; }
}

// ===== LOAD POSTS (Updated with Delete) =====
async function loadPosts() {
  const container = document.getElementById("posts-list");
  if(!container) return;
  container.innerHTML = "Loading posts...";
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    container.innerHTML = ""; 
    if (querySnapshot.empty) { container.innerHTML = "<p>No posts found.</p>"; return; }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      
      div.innerHTML = `
        <div style="flex: 1; padding-right: 15px;">
          <h3>${data.title}</h3>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">${data.content}</p>
        </div>
        <button onclick="deleteItem('posts', '${docSnap.id}')" style="background: #ff4c4c; margin-top: 0; height: fit-content;"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    });
  } catch (error) { container.innerHTML = "<p style='color:red;'>Failed to load posts.</p>"; }
}

// ===== LOAD PAGES (Updated with Delete) =====
async function loadPages() {
  const container = document.getElementById("pages-list");
  if(!container) return;
  container.innerHTML = "Loading pages...";
  try {
    const querySnapshot = await getDocs(collection(db, "pages"));
    container.innerHTML = ""; 
    if (querySnapshot.empty) { container.innerHTML = "<p>No pages found.</p>"; return; }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      
      div.innerHTML = `
        <div>
          <h3>${data.title}</h3>
          <p style="color: #ff2e63; font-size: 13px;">URL: /${data.slug}</p>
        </div>
        <button onclick="deleteItem('pages', '${docSnap.id}')" style="background: #ff4c4c; margin: 0;"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    });
  } catch (error) { container.innerHTML = "<p style='color:red;'>Failed to load pages.</p>"; }
}

// ===== LOAD CONTENT (Updated with Delete) =====
async function loadContent() {
  const container = document.getElementById("content-list");
  if(!container) return;
  container.innerHTML = "Loading content...";
  try {
    const querySnapshot = await getDocs(collection(db, "content"));
    container.innerHTML = ""; 
    if (querySnapshot.empty) { container.innerHTML = "<p>No content found.</p>"; return; }

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      
      div.innerHTML = `
        <div>
          <h3>${data.title}</h3>
          ${data.url ? `<a href="${data.url}" target="_blank" style="color: #111; font-size: 13px; text-decoration: none;">🔗 View Media Link</a>` : ''}
        </div>
        <button onclick="deleteItem('content', '${docSnap.id}')" style="background: #ff4c4c; margin: 0;"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    });
  } catch (error) { container.innerHTML = "<p style='color:red;'>Failed to load content.</p>"; }
}
