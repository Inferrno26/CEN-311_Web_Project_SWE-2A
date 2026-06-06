const API_URL = 'http://localhost:5057/api';

let adopters  = [];
let editingId = null;

let formBox;
let formTitle;
let tableBody;
let searchInput;
let nameInput;
let phoneInput;
let emailInput;
let addressInput;


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


async function loadAdopters() {
  try {
    adopters = await apiRequest('/adopters', 'GET');
    renderAdopters();
  } catch (error) {
    showError('Could not load adopters. Make sure the API is running.');
  }
}

async function createAdopter(adopter) {
  await apiRequest('/adopters', 'POST', adopter);
}

async function updateAdopter(id, adopter) {
  adopter.id = id;
  await apiRequest('/adopters/' + id, 'PUT', adopter);
}

async function removeAdopter(id) {
  await apiRequest('/adopters/' + id, 'DELETE');
}


function openAddForm() {
  editingId = null;
  formTitle.textContent = 'Add New Adopter';
  clearForm();
  formBox.classList.add('show');
}

function openEditForm(id) {
  let adopter = null;
  for (let i = 0; i < adopters.length; i++) {
    if (adopters[i].id === id) {
      adopter = adopters[i];
      break;
    }
  }
  if (!adopter) {
    return;
  }

  editingId = id;
  formTitle.textContent = 'Edit Adopter';

  nameInput.value    = adopter.name;
  phoneInput.value   = adopter.phone;
  emailInput.value   = adopter.email;
  addressInput.value = adopter.address;

  formBox.classList.add('show');
}

function closeForm() {
  formBox.classList.remove('show');
  clearForm();
  editingId = null;
}

function clearForm() {
  nameInput.value    = '';
  phoneInput.value   = '';
  emailInput.value   = '';
  addressInput.value = '';
}


async function saveForm() {
  const name    = nameInput.value.trim();
  const phone   = phoneInput.value.trim();
  const email   = emailInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !email || !address) {
    showError('Please fill in all fields.');
    return;
  }

  const adopter = {
    name:    name,
    phone:   phone,
    email:   email,
    address: address
  };

  try {
    if (editingId === null) {
      await createAdopter(adopter);
    } else {
      await updateAdopter(editingId, adopter);
    }
    closeForm();
    await loadAdopters();
  } catch (error) {
    showError('Could not save the adopter. Please try again.');
  }
}

async function deleteAdopter(id) {
  if (!confirm('Are you sure you want to delete this adopter?')) {
    return;
  }

  try {
    await removeAdopter(id);
    await loadAdopters();
  } catch (error) {
    showError('Could not delete the adopter. Please try again.');
  }
}


function editAdopter(id) {
  openEditForm(id);
}

function renderAdopters() {
  const query = searchInput.value.toLowerCase().trim();

  tableBody.innerHTML = '';

  let matchCount = 0;

  for (let i = 0; i < adopters.length; i++) {
    const adopter = adopters[i];

    const nameMatch    = adopter.name.toLowerCase().includes(query);
    const phoneMatch   = adopter.phone.toLowerCase().includes(query);
    const emailMatch   = adopter.email.toLowerCase().includes(query);
    const addressMatch = adopter.address.toLowerCase().includes(query);

    if (nameMatch || phoneMatch || emailMatch || addressMatch) {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + adopter.name    + '</td>' +
        '<td>' + adopter.phone   + '</td>' +
        '<td>' + adopter.email   + '</td>' +
        '<td>' + adopter.address + '</td>' +
        '<td>' +
          '<button class="action-btn edit-btn"   onclick="editAdopter('   + adopter.id + ')">Edit</button>'   +
          '<button class="action-btn delete-btn" onclick="deleteAdopter(' + adopter.id + ')">Delete</button>' +
        '</td>';
      tableBody.appendChild(row);
      matchCount++;
    }
  }

  if (matchCount === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty-row">No adopters found.</td></tr>';
  }
}


document.addEventListener('DOMContentLoaded', function() {
  formBox      = document.getElementById('formBox');
  formTitle    = document.getElementById('formTitle');
  tableBody    = document.getElementById('adoptersTableBody');
  searchInput  = document.getElementById('searchInput');
  nameInput    = document.getElementById('name');
  phoneInput   = document.getElementById('phone');
  emailInput   = document.getElementById('email');
  addressInput = document.getElementById('address');

  document.getElementById('showFormBtn').addEventListener('click', openAddForm);
  document.getElementById('cancelBtn').addEventListener('click', closeForm);
  document.getElementById('saveBtn').addEventListener('click', saveForm);
  searchInput.addEventListener('input', renderAdopters);

  loadAdopters();
});
