import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBXnbzrC6QpNNCJsDoiHRsLWAAE2K0Tl1E",
  authDomain: "studio-1643208753-15448.firebaseapp.com",
  databaseURL: "https://studio-1643208753-15448-default-rtdb.firebaseio.com",
  projectId: "studio-1643208753-15448",
  storageBucket: "studio-1643208753-15448.firebasestorage.app",
  messagingSenderId: "948366616848",
  appId: "1:948366616848:web:1805f6ae6d8961e6ab1d95"
};

// ===== LOGIN =====
window.adminLogin = async function() {
  const password = document.getElementById("admin-pass").value;
  try {
    await signInWithEmailAndPassword(auth, "admin@hooria.com", password);
  } catch {
    document.getElementById("login-error").innerText = "Wrong password";
  }
}

// ===== LOGOUT =====
window.adminLogout = () => signOut(auth).then(()=>location.reload());

// ===== AUTO LOGIN =====
onAuthStateChanged(auth, user=>{
  if(user){
    document.getElementById("login-screen").style.display="none";
    document.getElementById("admin-app").style.display="block";
    loadDashboard();
    loadProjects();
    loadPages();
    loadPosts();
    loadContent();
    loadInquiries();
  }
});

// ===== SECTION NAVIGATION =====
window.showSection = function(id){
  document.querySelectorAll(".section-panel").forEach(sec => sec.style.display="none");
  document.getElementById(id).style.display="block";
}

// ======================== DASHBOARD ========================
async function loadDashboard(){
  const dash = document.getElementById("dashboard");
  dash.innerHTML = "<h2>Dashboard</h2>";

  const inquiriesSnap = await getDocs(collection(db,"inquiries"));
  const projectsSnap = await getDocs(collection(db,"projects"));
  const postsSnap = await getDocs(collection(db,"posts"));

  dash.innerHTML += `
    <p>Total Inquiries: ${inquiriesSnap.size}</p>
    <p>Total Projects: ${projectsSnap.size}</p>
    <p>Total Posts: ${postsSnap.size}</p>
  `;
}

// ======================== PROJECTS ========================
async function loadProjects(){
  const container = document.getElementById("projects");
  container.innerHTML = `<h2>Projects</h2>
    <input type="text" id="project-title" placeholder="Title">
    <input type="file" id="project-file">
    <button onclick="addProject()">Add Project</button>
    <div id="projects-list"></div>
  `;

  const listDiv = document.getElementById("projects-list");
  listDiv.innerHTML = "";
  const querySnap = await getDocs(collection(db,"projects"));
  querySnap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.title}</h3><img src="${data.imageUrl}" width="150">
      <button onclick="deleteProject('${docSnap.id}')">Delete</button>`;
    listDiv.appendChild(div);
  });
}

window.addProject = async function(){
  const title = document.getElementById("project-title").value;
  const file = document.getElementById("project-file").files[0];
  if(!title || !file){ alert("Title & Image required"); return; }

  const storageRef = ref(storage, `projects/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db,"projects"), { title, imageUrl: url });
  loadProjects();
}

window.deleteProject = async function(id){
  if(!confirm("Delete project?")) return;
  await deleteDoc(doc(db,"projects",id));
  loadProjects();
}

// ======================== PAGES ========================
async function loadPages(){
  const container = document.getElementById("pages");
  container.innerHTML = `<h2>Pages</h2>
    <input type="text" id="page-title" placeholder="Page Title">
    <input type="text" id="page-slug" placeholder="Slug">
    <textarea id="page-content" placeholder="Content"></textarea>
    <button onclick="addPage()">Add Page</button>
    <div id="pages-list"></div>
  `;

  const listDiv = document.getElementById("pages-list");
  listDiv.innerHTML = "";
  const querySnap = await getDocs(collection(db,"pages"));
  querySnap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.title} (${data.slug})</h3>
      <p>${data.content}</p>
      <button onclick="deletePage('${docSnap.id}')">Delete</button>`;
    listDiv.appendChild(div);
  });
}

window.addPage = async function(){
  const title = document.getElementById("page-title").value;
  const slug = document.getElementById("page-slug").value;
  const content = document.getElementById("page-content").value;
  if(!title || !slug || !content){ alert("All fields required"); return; }
  await addDoc(collection(db,"pages"), { title, slug, content });
  loadPages();
}

window.deletePage = async function(id){
  if(!confirm("Delete page?")) return;
  await deleteDoc(doc(db,"pages",id));
  loadPages();
}

// ======================== POSTS ========================
async function loadPosts(){
  const container = document.getElementById("posts");
  container.innerHTML = `<h2>Posts</h2>
    <input type="text" id="post-title" placeholder="Title">
    <select id="post-category"><option>General</option><option>News</option></select>
    <textarea id="post-content" placeholder="Content"></textarea>
    <input type="checkbox" id="post-published"> Publish
    <button onclick="addPost()">Add Post</button>
    <div id="posts-list"></div>
  `;

  const listDiv = document.getElementById("posts-list");
  listDiv.innerHTML = "";
  const querySnap = await getDocs(collection(db,"posts"));
  querySnap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.title} (${data.category}) ${data.published?'[Published]':''}</h3>
      <p>${data.content}</p>
      <button onclick="deletePost('${docSnap.id}')">Delete</button>`;
    listDiv.appendChild(div);
  });
}

window.addPost = async function(){
  const title = document.getElementById("post-title").value;
  const category = document.getElementById("post-category").value;
  const content = document.getElementById("post-content").value;
  const published = document.getElementById("post-published").checked;
  if(!title || !content){ alert("Title & Content required"); return; }
  await addDoc(collection(db,"posts"), { title, category, content, published });
  loadPosts();
}

window.deletePost = async function(id){
  if(!confirm("Delete post?")) return;
  await deleteDoc(doc(db,"posts",id));
  loadPosts();
}

// ======================== CONTENT EDITOR ========================
async function loadContent(){
  const container = document.getElementById("content");
  container.innerHTML = `<h2>Website Content Editor</h2><div id="content-editor"></div>`;
  const editorDiv = document.getElementById("content-editor");
  editorDiv.innerHTML = "";

  const querySnap = await getDocs(collection(db,"content"));
  querySnap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.section}</h3>
      <textarea id="content-${docSnap.id}">${data.text}</textarea>
      <button onclick="updateContent('${docSnap.id}')">Update</button>`;
    editorDiv.appendChild(div);
  });
}

window.updateContent = async function(id){
  const text = document.getElementById(`content-${id}`).value;
  await updateDoc(doc(db,"content",id), { text });
  alert("Content updated!");
}

// ======================== INQUIRIES ========================
async function loadInquiries(){
  const container = document.getElementById("inquiries");
  container.innerHTML = "<h2>Inquiries</h2><div id='inquiries-list'></div>";
  const listDiv = document.getElementById("inquiries-list");
  listDiv.innerHTML = "";

  const querySnap = await getDocs(collection(db,"inquiries"));
  querySnap.forEach((docSnap,index)=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<p>${index+1}. ${data.name} | ${data.phone} | ${data.apartment} | ${data.date?.toDate().toLocaleDateString()}</p>
      <button onclick="deleteInquiry('${docSnap.id}')">Delete</button>`;
    listDiv.appendChild(div);
  });
}

window.deleteInquiry = async function(id){
  if(!confirm("Delete inquiry?")) return;
  await deleteDoc(doc(db,"inquiries",id));
  loadInquiries();
}
