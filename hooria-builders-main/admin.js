// --- CONFIG & STATE ---
let inquiries = JSON.parse(localStorage.getItem('hooria_inquiries')) || [];

// --- LOGIN LOGIC ---
function adminLogin() {
    const passInput = document.getElementById('admin-pass').value;
    const errorMsg = document.getElementById('login-error');
    
    if (passInput === "admin123") { // Replace with your actual password logic
        localStorage.setItem('hooria_auth', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-app').style.display = 'block';
        renderInquiries();
    } else {
        errorMsg.innerText = "Invalid Password. Please try again.";
    }
}

// --- NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item[data-section]');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        
        // Update active nav
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show target section
        document.querySelectorAll('.section-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`section-${target}`).classList.add('active');
    });
});

// --- RENDER INQUIRIES ---
function renderInquiries() {
    const tableBody = document.getElementById('inquiries-table-body');
    if (inquiries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No inquiries found.</div></td></tr>';
        return;
    }

    tableBody.innerHTML = inquiries.map((iq, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>**${iq.name}**</td>
            <td>${iq.phone}</td>
            <td>${iq.apartmentType}</td>
            <td><small>${iq.message}</small></td>
            <td>${iq.date}</td>
            <td><span class="badge badge-${iq.status.toLowerCase()}">${iq.status}</span></td>
            <td>
                <button class="btn-sm btn-outline-gold" onclick="updateStatus(${index})">Update</button>
            </td>
        </tr>
    `).join('');
}
</i>' +
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
