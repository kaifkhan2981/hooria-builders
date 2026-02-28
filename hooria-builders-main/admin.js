import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = { /* aapka config */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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
window.adminLogout = function() { signOut(auth).then(()=>location.reload()); }

// ===== AUTO LOGIN CHECK =====
onAuthStateChanged(auth, user=>{
  if(user){
    document.getElementById("login-screen").style.display="none";
    document.getElementById("admin-app").style.display="block";
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

// ===== EXAMPLE: PROJECTS CRUD =====
async function loadProjects(){
  const querySnap = await getDocs(collection(db, "projects"));
  const container = document.getElementById("projects");
  container.innerHTML = `<h2>Projects</h2>`;
  querySnap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.title}</h3>
      <img src="${data.imageUrl}" width="150">
      <button onclick="deleteProject('${docSnap.id}')">Delete</button>`;
    container.appendChild(div);
  });
}

window.deleteProject = async function(id){
  await deleteDoc(doc(db, "projects", id));
  loadProjects();
}

window.addProject = async function(title, file){
  const storageRef = ref(storage, `projects/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await addDoc(collection(db, "projects"), { title, imageUrl: url });
  loadProjects();
}
