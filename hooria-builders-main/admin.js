/* =============================================
   HOORIA BUILDERS — ADMIN PANEL LOGIC
   ============================================= */

var ADMIN_PASS_KEY = "hb_admin_pass";
var INQUIRIES_KEY  = "hb_inquiries";
var AUTH_KEY       = "hb_admin_auth";
var DEFAULT_PASS   = "hooria@2024";

// ─── Projects data (static) ───────────────────
var PROJECTS = [
  {
    id: "hooria-residency",
    name: "Hooria Residency",
    image: "assets/images/Front.jpg",
    location: "Nazimabad #5-D, Karachi",
    type: "3, 4 & 5 Room Apartments",
    status: "booking_open",
    units: "Limited",
    desc: "Premium apartments in the heart of Nazimabad with modern amenities and flexible payment plans."
  },
  {
    id: "bismillah-terrace",
    name: "Bismillah Terrace",
    image: "assets/images/bismillah-terrace.jpeg",
    location: "Nazimabad, Karachi",
    type: "2 & 3 Bedroom Apartments",
    status: "completed",
    units: 24,
    desc: "Modern apartments with all amenities, ready for possession."
  },
  {
    id: "bismillah-terrace-1",
    name: "Bismillah Terrace 1",
    image: "assets/images/bismillah-terrace1.jpeg",
    location: "Gulshan-e-Iqbal, Karachi",
    type: "3 & 4 Bedroom Apartments",
    status: "completed",
    units: 18,
    desc: "Spacious living in a prime location of Karachi."
  },
  {
    id: "bismillah-terrace-2",
    name: "Bismillah Terrace 2",
    image: "assets/images/bismillah-terrace2.jpeg",
    location: "North Nazimabad, Karachi",
    type: "2, 3 & 4 Bedroom Apartments",
    status: "completed",
    units: 20,
    desc: "Elegant design with immediate possession available."
  },
  {
    id: "bismillah-terrace-3",
    name: "Bismillah Terrace 3",
    image: "assets/images/bismillah-terrace3.jpeg",
    location: "Nazimabad, Karachi",
    type: "3 & 4 Bedroom Luxury Apartments",
    status: "completed",
    units: 16,
    desc: "Luxury apartments with flexible payment plans."
  }
];

// ─── Helpers ─────────────────────────────────
function getPass() {
  return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASS;
}

function getInquiries() {
  return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]");
}

function saveInquiries(data) {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(data));
}

function getProjectStatus(projectId) {
  var overrides = JSON.parse(localStorage.getItem("hb_project_status") || "{}");
  return overrides[projectId] || null;
}

function setProjectStatus(projectId, status) {
  var overrides = JSON.parse(localStorage.getItem("hb_project_status") || "{}");
  overrides[projectId] = status;
  localStorage.setItem("hb_project_status", JSON.stringify(overrides));
}

// ─── Auth ─────────────────────────────────────
function adminLogin() {
  var pass = document.getElementById("admin-pass").value;
  var err  = document.getElementById("login-error");
  if (!pass) { err.textContent = "Please enter your password."; return; }
  if (pass === getPass()) {
    sessionStorage.setItem(AUTH_KEY, "1");
    showAdminApp();
  } else {
    err.textContent = "Incorrect password. Please try again.";
    document.getElementById("admin-pass").value = "";
    document.getElementById("admin-pass").focus();
  }
}

function adminLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  document.getElementById("admin-app").classList.remove("visible");
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-pass").value = "";
  document.getElementById("login-error").textContent = "";
}

function showAdminApp() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-app").classList.add("visible");
  initDashboard();
  renderProjects();
}

// Allow Enter key on login
document.addEventListener("DOMContentLoaded", function () {
  var passInput = document.getElementById("admin-pass");
  if (passInput) {
    passInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") adminLogin();
    });
  }

  // Set topbar date
  var dateEl = document.getElementById("topbar-date");
  if (dateEl) {
    var now = new Date();
    dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  }

  // Check session
  if (sessionStorage.getItem(AUTH_KEY) === "1") {
    showAdminApp();
  }

  // Sidebar nav
  document.querySelectorAll(".nav-item[data-section]").forEach(function (item) {
    item.addEventListener("click", function () {
      navigate(this.getAttribute("data-section"));
      closeSidebar();
    });
  });
});

// ─── Navigation ───────────────────────────────
function navigate(section) {
  // Update nav
  document.querySelectorAll(".nav-item").forEach(function (el) {
    el.classList.remove("active");
    if (el.getAttribute("data-section") === section) el.classList.add("active");
  });
  // Show panel
  document.querySelectorAll(".section-panel").forEach(function (el) {
    el.classList.remove("active");
  });
  var panel = document.getElementById("section-" + section);
  if (panel) panel.classList.add("active");

  // Refresh data on navigate
  if (section === "dashboard") initDashboard();
  if (section === "inquiries") renderInquiries();
  if (section === "projects") renderProjects();
}

// ─── Sidebar ──────────────────────────────────
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebar-overlay").classList.toggle("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("open");
}

// ─── Dashboard ────────────────────────────────
function initDashboard() {
  var inquiries = getInquiries();
  var newCount  = inquiries.filter(function (i) { return i.status === "new"; }).length;
  var contacted = inquiries.filter(function (i) { return i.status === "contacted"; }).length;
  var closed    = inquiries.filter(function (i) { return i.status === "closed"; }).length;

  setEl("stat-total-inquiries", inquiries.length);
  setEl("stat-new-inquiries", newCount > 0 ? newCount + " new unread" : "All reviewed");
  setEl("stat-contacted", contacted);
  setEl("breakdown-new", newCount + " inquiries pending review");
  setEl("breakdown-contacted", contacted + " inquiries followed up");
  setEl("breakdown-closed", closed + " inquiries resolved");

  // Recent 5
  var recent = inquiries.slice(-5).reverse();
  var tbody  = document.getElementById("recent-table-body");
  if (!tbody) return;
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No inquiries yet.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = recent.map(function (inq) {
    return '<tr>' +
      '<td><strong>' + esc(inq.name) + '</strong></td>' +
      '<td>' + esc(inq.phone) + '</td>' +
      '<td>' + esc(inq.apartment) + '</td>' +
      '<td><span class="cell-muted">' + esc(inq.date) + '</span></td>' +
      '<td>' + badgeHTML(inq.status) + '</td>' +
      '</tr>';
  }).join("");
}

// ─── Inquiries ────────────────────────────────
function renderInquiries() {
  var inquiries = getInquiries();
  var query     = (document.getElementById("inquiry-search") || {}).value || "";
  query = query.toLowerCase();

  if (query) {
    inquiries = inquiries.filter(function (i) {
      return i.name.toLowerCase().includes(query) || i.phone.toLowerCase().includes(query) || i.apartment.toLowerCase().includes(query);
    });
  }

  var count = document.getElementById("inquiry-count");
  if (count) count.textContent = inquiries.length + " record" + (inquiries.length !== 1 ? "s" : "");

  var clearBtn = document.getElementById("clear-btn");
  if (clearBtn) clearBtn.style.display = getInquiries().length > 0 ? "inline-flex" : "none";

  var tbody = document.getElementById("inquiries-table-body");
  if (!tbody) return;

  if (inquiries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No inquiries found' + (query ? ' matching "' + esc(query) + '"' : '') + '.</p></div></td></tr>';
    return;
  }

  var reversed = inquiries.slice().reverse();
  tbody.innerHTML = reversed.map(function (inq, idx) {
    var msgShort = inq.message && inq.message.length > 40 ? inq.message.substring(0, 40) + "…" : (inq.message || "—");
    return '<tr>' +
      '<td><span class="cell-muted">' + (reversed.length - idx) + '</span></td>' +
      '<td><strong>' + esc(inq.name) + '</strong></td>' +
      '<td><a href="tel:' + esc(inq.phone) + '" style="color:var(--gold);text-decoration:none;">' + esc(inq.phone) + '</a></td>' +
      '<td>' + esc(inq.apartment) + '</td>' +
      '<td title="' + esc(inq.message || "") + '">' + esc(msgShort) + '</td>' +
      '<td><span class="cell-muted">' + esc(inq.date) + '</span></td>' +
      '<td>' + badgeHTML(inq.status) + '</td>' +
      '<td style="white-space:nowrap;">' +
        '<div style="display:flex;gap:6px;">' +
          statusActionBtn(inq) +
          '<button class="btn-sm btn-danger" title="Delete" onclick="deleteInquiry(\'' + inq.id + '\')">' +
            '<i class="fa-solid fa-trash"></i>' +
          '</button>' +
          '<a href="https://wa.me/92' + inq.phone.replace(/^0/, "").replace(/\D/g,"") + '" target="_blank" class="btn-sm btn-green" title="WhatsApp">' +
            '<i class="fa-brands fa-whatsapp"></i>' +
          '</a>' +
        '</div>' +
      '</td>' +
      '</tr>';
  }).join("");
}

function statusActionBtn(inq) {
  if (inq.status === "new") {
    return '<button class="btn-sm btn-green" title="Mark Contacted" onclick="updateStatus(\'' + inq.id + '\', \'contacted\')">' +
      '<i class="fa-solid fa-phone"></i>' +
      '</button>';
  }
  if (inq.status === "contacted") {
    return '<button class="btn-sm btn-outline-gold" title="Mark Closed" onclick="updateStatus(\'' + inq.id + '\', \'closed\')">' +
      '<i class="fa-solid fa-check"></i>' +
      '</button>';
  }
  return '<button class="btn-sm" style="background:var(--gold-dim);color:var(--text-muted);border:1px solid var(--gold-border);" title="Reopen" onclick="updateStatus(\'' + inq.id + '\', \'new\')">' +
    '<i class="fa-solid fa-rotate-left"></i>' +
    '</button>';
}

function updateStatus(id, status) {
  var inquiries = getInquiries();
  var idx = inquiries.findIndex(function (i) { return i.id === id; });
  if (idx > -1) {
    inquiries[idx].status = status;
    saveInquiries(inquiries);
    renderInquiries();
    initDashboard();
  }
}

function deleteInquiry(id) {
  if (!confirm("Delete this inquiry? This cannot be undone.")) return;
  var inquiries = getInquiries().filter(function (i) { return i.id !== id; });
  saveInquiries(inquiries);
  renderInquiries();
  initDashboard();
}

function clearAllInquiries() {
  if (!confirm("Delete ALL inquiries? This cannot be undone.")) return;
  saveInquiries([]);
  renderInquiries();
  initDashboard();
}

function exportCSV() {
  var inquiries = getInquiries();
  if (inquiries.length === 0) { alert("No inquiries to export."); return; }
  var headers = ["#", "Name", "Phone", "Apartment", "Message", "Date", "Status"];
  var rows = inquiries.map(function (inq, i) {
    return [
      i + 1,
      csvCell(inq.name),
      csvCell(inq.phone),
      csvCell(inq.apartment),
      csvCell(inq.message),
      csvCell(inq.date),
      csvCell(inq.status)
    ].join(",");
  });
  var csv = [headers.join(",")].concat(rows).join("\n");
  var blob = new Blob([csv], { type: "text/csv" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "hooria-inquiries-" + new Date().toISOString().slice(0,10) + ".csv";
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(val) {
  var s = (val || "").toString().replace(/"/g, '""');
  return '"' + s + '"';
}

// ─── Projects ─────────────────────────────────
function renderProjects() {
  var grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = PROJECTS.map(function (proj) {
    var status = getProjectStatus(proj.id) || proj.status;
    var badgeCls = status === "booking_open" ? "badge-booking" : status === "ongoing" ? "badge-ongoing" : "badge-completed";
    var badgeText = status === "booking_open" ? "📢 Booking Open" : status === "ongoing" ? "🏗 Ongoing" : "✅ Completed";

    var nextStatus = status === "completed" ? "booking_open" : status === "booking_open" ? "ongoing" : "completed";
    var toggleLabel = status === "completed" ? "Set Booking Open" : status === "booking_open" ? "Set Ongoing" : "Set Completed";

    return '<div class="project-card">' +
      '<img src="' + proj.image + '" alt="' + esc(proj.name) + '" onerror="this.src=\'assets/images/Front.jpg\'">' +
      '<div class="project-card-body">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">' +
          '<h4>' + esc(proj.name) + '</h4>' +
          '<span class="badge ' + badgeCls + '">' + badgeText + '</span>' +
        '</div>' +
        '<p>' + esc(proj.desc) + '</p>' +
        '<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:12px;display:flex;flex-direction:column;gap:3px;">' +
          '<span><i class="fa-solid fa-location-dot" style="color:var(--gold);margin-right:5px;"></i>' + esc(proj.location) + '</span>' +
          '<span><i class="fa-solid fa-home" style="color:var(--gold);margin-right:5px;"></i>' + esc(proj.type) + '</span>' +
          '<span><i class="fa-solid fa-key" style="color:var(--gold);margin-right:5px;"></i>Units: ' + proj.units + '</span>' +
        '</div>' +
        '<div class="project-card-footer">' +
          '<button class="btn-sm btn-outline-gold" onclick="toggleProjectStatus(\'' + proj.id + '\', \'' + nextStatus + '\')">' +
            '<i class="fa-solid fa-rotate"></i> ' + toggleLabel +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join("");
}

function toggleProjectStatus(projectId, newStatus) {
  setProjectStatus(projectId, newStatus);
  renderProjects();
}

// ─── Settings ─────────────────────────────────
function changePassword() {
  var np  = document.getElementById("new-pass").value;
  var cp  = document.getElementById("confirm-pass").value;
  var msg = document.getElementById("pass-msg");
  if (!np) { msg.textContent = "Please enter a new password."; msg.style.color = "var(--danger)"; return; }
  if (np.length < 6) { msg.textContent = "Password must be at least 6 characters."; msg.style.color = "var(--danger)"; return; }
  if (np !== cp) { msg.textContent = "Passwords do not match."; msg.style.color = "var(--danger)"; return; }
  localStorage.setItem(ADMIN_PASS_KEY, np);
  msg.textContent = "✓ Password updated successfully!";
  msg.style.color = "var(--green)";
  document.getElementById("new-pass").value    = "";
  document.getElementById("confirm-pass").value = "";
  setTimeout(function () { msg.textContent = ""; }, 3000);
}

// ─── Badge HTML ───────────────────────────────
function badgeHTML(status) {
  if (status === "new")       return '<span class="badge badge-new"><i class="fa-solid fa-circle fa-2xs"></i>New</span>';
  if (status === "contacted") return '<span class="badge badge-contacted"><i class="fa-solid fa-circle fa-2xs"></i>Contacted</span>';
  if (status === "closed")    return '<span class="badge badge-closed"><i class="fa-solid fa-circle fa-2xs"></i>Closed</span>';
  return '<span class="badge badge-new">' + status + '</span>';
}

// ─── Utilities ────────────────────────────────
function esc(str) {
  return (str || "").toString()
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function setEl(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}
