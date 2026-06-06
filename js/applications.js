const API_URL = 'http://localhost:5057/api';

let applications = [];
let editingId    = null;
let deletingId   = null;


async function apiRequest(path, method, body) {
  const options = { method: method };

  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body    = JSON.stringify(body);
  }

  const response = await fetch(API_URL + path, options);

  if (!response.ok) {
    throw new Error('Request failed.');
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

function showError(message) {
  alert(message);
}


async function loadApplications() {
  try {
    applications = await apiRequest('/applications', 'GET');
    refresh();
  } catch (error) {
    showError('Could not load applications. Make sure the API is running.');
  }
}

async function createApplication(application) {
  await apiRequest('/applications', 'POST', application);
}

async function updateApplication(id, application) {
  application.id = id;
  await apiRequest('/applications/' + id, 'PUT', application);
}

async function removeApplication(id) {
  await apiRequest('/applications/' + id, 'DELETE');
}


function formatDate(isoDate) {
  if (!isoDate) {
    return '';
  }
  const parts = isoDate.split('-');
  const year  = parts[0];
  const month = parts[1];
  const day   = parts[2];
  return day + '/' + month + '/' + year;
}

function todayISO() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day   = String(today.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function getStatusClass(status) {
  return status.toLowerCase();
}


function refresh() {
  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;

  const filtered = [];

  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];

    const nameMatch   = app.adopterName.toLowerCase().includes(search);
    const petMatch    = app.petName.toLowerCase().includes(search);
    const idMatch     = String(app.id).toLowerCase().includes(search);
    const matchSearch = (search === '') || nameMatch || petMatch || idMatch;
    const matchStatus = (status === 'all') || (app.status === status);

    if (matchSearch && matchStatus) {
      filtered.push(app);
    }
  }

  renderTable(filtered);
  updateStats(applications);
}

function renderTable(apps) {
  const tbody = document.getElementById('applicationsBody');
  const empty = document.getElementById('emptyState');

  tbody.innerHTML = '';

  if (apps.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const tr  = document.createElement('tr');

    tr.innerHTML =
      '<td>' + app.id + '</td>' +
      '<td>' + app.adopterName + '</td>' +
      '<td>' + app.petName + '</td>' +
      '<td>' + formatDate(app.dateApplied) + '</td>' +
      '<td><span class="status ' + getStatusClass(app.status) + '">' + app.status + '</span></td>' +
      '<td>' +
        '<button class="action-btn edit"   title="Edit"   onclick="openEditModal(\'' + app.id + '\')">' +
          '<i class="fa-solid fa-pen"></i>' +
        '</button>' +
        '<button class="action-btn delete" title="Delete" onclick="openDeleteConfirm(\'' + app.id + '\')">' +
          '<i class="fa-solid fa-trash"></i>' +
        '</button>' +
      '</td>';

    tbody.appendChild(tr);
  }
}

function updateStats(apps) {
  let totalCount    = apps.length;
  let pendingCount  = 0;
  let approvedCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < apps.length; i++) {
    if (apps[i].status === 'Pending')  { pendingCount++;  }
    if (apps[i].status === 'Approved') { approvedCount++; }
    if (apps[i].status === 'Rejected') { rejectedCount++; }
  }

  document.getElementById('stat-total').textContent    = totalCount;
  document.getElementById('stat-pending').textContent  = pendingCount;
  document.getElementById('stat-approved').textContent = approvedCount;
  document.getElementById('stat-rejected').textContent = rejectedCount;
}


function openAddModal() {
  editingId = null;

  document.getElementById('modalTitle').textContent = 'Add Application';
  document.getElementById('appId').value            = '';
  document.getElementById('adopterName').value      = '';
  document.getElementById('petName').value          = '';
  document.getElementById('dateApplied').value      = todayISO();
  document.getElementById('appStatus').value        = 'Pending';
  document.getElementById('notes').value            = '';
  document.getElementById('formError').classList.add('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('adopterName').focus();
}

function openEditModal(id) {
  let app = null;

  for (let i = 0; i < applications.length; i++) {
    if (applications[i].id === id) {
      app = applications[i];
      break;
    }
  }

  if (!app) {
    return;
  }

  editingId = id;

  document.getElementById('modalTitle').textContent = 'Edit Application';
  document.getElementById('appId').value            = app.id;
  document.getElementById('adopterName').value      = app.adopterName;
  document.getElementById('petName').value          = app.petName;
  document.getElementById('dateApplied').value      = app.dateApplied;
  document.getElementById('appStatus').value        = app.status;
  document.getElementById('notes').value            = app.notes || '';
  document.getElementById('formError').classList.add('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('adopterName').focus();
}

function closeAddModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}


async function saveApplication() {
  const adopterName = document.getElementById('adopterName').value.trim();
  const petName     = document.getElementById('petName').value.trim();
  const dateApplied = document.getElementById('dateApplied').value;
  const status      = document.getElementById('appStatus').value;
  const notes       = document.getElementById('notes').value.trim();

  if (!adopterName || !petName || !dateApplied) {
    document.getElementById('formError').classList.remove('hidden');
    return;
  }

  document.getElementById('formError').classList.add('hidden');

  const application = {
    adopterName: adopterName,
    petName:     petName,
    dateApplied: dateApplied,
    status:      status,
    notes:       notes
  };

  try {
    if (editingId === null) {
      await createApplication(application);
    } else {
      await updateApplication(editingId, application);
    }
    closeAddModal();
    await loadApplications();
  } catch (error) {
    showError('Could not save the application. Please try again.');
  }
}


function openDeleteConfirm(id) {
  deletingId = id;
  document.getElementById('deleteOverlay').classList.remove('hidden');
}

function closeDeleteConfirm() {
  deletingId = null;
  document.getElementById('deleteOverlay').classList.add('hidden');
}

async function confirmDelete() {
  if (!deletingId) {
    return;
  }

  try {
    await removeApplication(deletingId);
    closeDeleteConfirm();
    await loadApplications();
  } catch (error) {
    showError('Could not delete the application. Please try again.');
  }
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('input', refresh);
  document.getElementById('statusFilter').addEventListener('change', refresh);

  document.getElementById('openAddModal').addEventListener('click', openAddModal);

  document.getElementById('closeModal').addEventListener('click', closeAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeAddModal);

  document.getElementById('saveApplication').addEventListener('click', saveApplication);

  document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteConfirm);
  document.getElementById('cancelDelete').addEventListener('click', closeDeleteConfirm);
  document.getElementById('confirmDelete').addEventListener('click', confirmDelete);

  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === document.getElementById('modalOverlay')) {
      closeAddModal();
    }
  });

  document.getElementById('deleteOverlay').addEventListener('click', function(e) {
    if (e.target === document.getElementById('deleteOverlay')) {
      closeDeleteConfirm();
    }
  });

  loadApplications();
});
