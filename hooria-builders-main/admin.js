// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateDateTime();
    renderInquiries();
    
    // Auto-refresh date every minute
    setInterval(updateDateTime, 60000);
});

// --- AUTHENTICATION ---
function adminLogin() {
    const pass = document.getElementById('admin-pass').value;
    const error = document.getElementById('login-error');
    
    // For demo: password is 'admin123'
    if (pass === 'admin123') {
        localStorage.setItem('hb_admin_auth', 'true');
        checkAuth();
    } else {
        error.innerText = "Incorrect password!";
        error.style.color = "var(--danger)";
    }
}

function adminLogout() {
    localStorage.removeItem('hb_admin_auth');
    location.reload();
}

function checkAuth() {
    const isAuth = localStorage.getItem('hb_admin_auth');
    if (isAuth === 'true') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-app').style.display = 'block';
    }
}

// --- NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item[data-section]');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        navigate(sectionId);
        
        // Close sidebar on mobile after click
        if (window.innerWidth <= 768) closeSidebar();
    });
});

function navigate(sectionId) {
    // Update Nav UI
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update Panels
    document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
}

// --- SIDEBAR UI ---
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// --- DATA RENDERING (DEMO DATA) ---
let mockInquiries = [
    { name: "Asif Khan", phone: "0300-1234567", apartment: "3 Bed (Type A)", date: "2026-02-27", status: "New" },
    { name: "Sarah Ahmed", phone: "0333-7654321", apartment: "2 Bed (Type B)", date: "2026-02-25", status: "Contacted" }
];

function renderInquiries() {
    const tbody = document.getElementById('inquiries-table-body');
    const recentBody = document.getElementById('recent-table-body');
    
    if (mockInquiries.length === 0) return;

    const rows = mockInquiries.map((iq, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${iq.name}</strong></td>
            <td>${iq.phone}</td>
            <td>${iq.apartment}</td>
            <td>Interested in booking...</td>
            <td>${iq.date}</td>
            <td><span class="badge" style="color: ${iq.status === 'New' ? 'var(--gold)' : 'var(--green)'}">${iq.status}</span></td>
            <td><button class="btn-sm btn-outline-gold">Manage</button></td>
        </tr>
    `).join('');

    tbody.innerHTML = rows;
    recentBody.innerHTML = rows; // Showing same for demo
    
    // Update stats
    document.getElementById('stat-total-inquiries').innerText = mockInquiries.length;
}

// --- HELPERS ---
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('topbar-date').innerText = now.toLocaleDateString('en-US', options);
}
