const STORAGE_KEY = "pac_applications";

/*  Helpers  */

function generateId() {
  return "APP-" + Date.now().toString(36).toUpperCase();
}

function getApplications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveApplications(apps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function statusClass(status) {
  return status.toLowerCase(); // "approved" | "pending" | "rejected"
}

/*  Render  */

function renderTable(apps) {
  const tbody = document.getElementById("applicationsBody");
  const empty = document.getElementById("emptyState");

  tbody.innerHTML = "";

  if (apps.length === 0) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  apps.forEach((app) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${app.id}</td>
      <td>${escapeHtml(app.adopterName)}</td>
      <td>${escapeHtml(app.petName)}</td>
      <td>${formatDate(app.dateApplied)}</td>
      <td><span class="status ${statusClass(app.status)}">${app.status}</span></td>
      <td>
        <button class="action-btn edit" title="Edit" data-id="${app.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="action-btn delete" title="Delete" data-id="${app.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach row-level event listeners
  tbody.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });

  tbody.querySelectorAll(".action-btn.delete").forEach((btn) => {
    btn.addEventListener("click", () => openDeleteConfirm(btn.dataset.id));
  });
}

function updateStats(apps) {
  document.getElementById("stat-total").textContent    = apps.length;
  document.getElementById("stat-pending").textContent  = apps.filter((a) => a.status === "Pending").length;
  document.getElementById("stat-approved").textContent = apps.filter((a) => a.status === "Approved").length;
  document.getElementById("stat-rejected").textContent = apps.filter((a) => a.status === "Rejected").length;
}

function refresh() {
  const apps    = getApplications();
  const search  = document.getElementById("searchInput").value.trim().toLowerCase();
  const status  = document.getElementById("statusFilter").value;

  const filtered = apps.filter((a) => {
    const matchSearch =
      !search ||
      a.adopterName.toLowerCase().includes(search) ||
      a.petName.toLowerCase().includes(search) ||
      a.id.toLowerCase().includes(search);

    const matchStatus = status === "all" || a.status === status;

    return matchSearch && matchStatus;
  });

  renderTable(filtered);
  updateStats(apps); // stats always reflect full dataset
}

/*  Modal: Add / Edit  */

let editingId = null;

function openAddModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Add Application";
  document.getElementById("appId").value           = "";
  document.getElementById("adopterName").value     = "";
  document.getElementById("petName").value         = "";
  document.getElementById("dateApplied").value     = todayISO();
  document.getElementById("appStatus").value       = "Pending";
  document.getElementById("notes").value           = "";
  document.getElementById("formError").classList.add("hidden");
  document.getElementById("modalOverlay").classList.remove("hidden");
  document.getElementById("adopterName").focus();
}

function openEditModal(id) {
  const apps = getApplications();
  const app  = apps.find((a) => a.id === id);
  if (!app) return;

  editingId = id;
  document.getElementById("modalTitle").textContent = "Edit Application";
  document.getElementById("appId").value           = app.id;
  document.getElementById("adopterName").value     = app.adopterName;
  document.getElementById("petName").value         = app.petName;
  document.getElementById("dateApplied").value     = app.dateApplied;
  document.getElementById("appStatus").value       = app.status;
  document.getElementById("notes").value           = app.notes || "";
  document.getElementById("formError").classList.add("hidden");
  document.getElementById("modalOverlay").classList.remove("hidden");
  document.getElementById("adopterName").focus();
}

function closeAddModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

function saveApplication() {
  const adopterName = document.getElementById("adopterName").value.trim();
  const petName     = document.getElementById("petName").value.trim();
  const dateApplied = document.getElementById("dateApplied").value;
  const status      = document.getElementById("appStatus").value;
  const notes       = document.getElementById("notes").value.trim();

  // Validation
  if (!adopterName || !petName || !dateApplied) {
    document.getElementById("formError").classList.remove("hidden");
    return;
  }

  document.getElementById("formError").classList.add("hidden");

  const apps = getApplications();

  if (editingId) {
    // Update existing
    const idx = apps.findIndex((a) => a.id === editingId);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], adopterName, petName, dateApplied, status, notes };
    }
  } else {
    // Create new
    apps.unshift({ id: generateId(), adopterName, petName, dateApplied, status, notes });
  }

  saveApplications(apps);
  closeAddModal();
  refresh();
}

/*  Modal: Delete confirm  */

let deletingId = null;

function openDeleteConfirm(id) {
  deletingId = id;
  document.getElementById("deleteOverlay").classList.remove("hidden");
}

function closeDeleteConfirm() {
  deletingId = null;
  document.getElementById("deleteOverlay").classList.add("hidden");
}

function confirmDelete() {
  if (!deletingId) return;
  const apps    = getApplications().filter((a) => a.id !== deletingId);
  saveApplications(apps);
  closeDeleteConfirm();
  refresh();
}

/*  Utilities  */

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/*  Bootstrap  */

document.addEventListener("DOMContentLoaded", () => {

  // Initial render
  refresh();

  // Search & filter listeners
  document.getElementById("searchInput").addEventListener("input", refresh);
  document.getElementById("statusFilter").addEventListener("change", refresh);

  // Open add modal
  document.getElementById("openAddModal").addEventListener("click", openAddModal);

  // Close add/edit modal
  document.getElementById("closeModal").addEventListener("click", closeAddModal);
  document.getElementById("cancelModal").addEventListener("click", closeAddModal);

  // Save application
  document.getElementById("saveApplication").addEventListener("click", saveApplication);

  // Keyboard shortcut: Enter to save when modal is open
  document.getElementById("modalOverlay").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") saveApplication();
    if (e.key === "Escape") closeAddModal();
  });

  // Delete confirm modal
  document.getElementById("closeDeleteModal").addEventListener("click", closeDeleteConfirm);
  document.getElementById("cancelDelete").addEventListener("click", closeDeleteConfirm);
  document.getElementById("confirmDelete").addEventListener("click", confirmDelete);

  // Close modals on overlay click
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeAddModal();
  });

  document.getElementById("deleteOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("deleteOverlay")) closeDeleteConfirm();
  });
});
