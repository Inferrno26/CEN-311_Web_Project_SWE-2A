const ADOPTERS_KEY = 'adopters';

let adopters     = [];
let editingIndex = -1;

let formBox;
let formTitle;
let tableBody;
let searchInput;
let nameInput;
let phoneInput;
let emailInput;
let addressInput;

function openAddForm() {
  editingIndex = -1;
  formTitle.textContent = 'Add New Adopter';
  clearForm();
  formBox.classList.add('show');
}

function closeForm() {
  formBox.classList.remove('show');
  clearForm();
  editingIndex = -1;
}

function clearForm() {
  nameInput.value    = '';
  phoneInput.value   = '';
  emailInput.value   = '';
  addressInput.value = '';
}

function saveAdopter() {
  const name    = nameInput.value.trim();
  const phone   = phoneInput.value.trim();
  const email   = emailInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !email || !address) {
    alert('Please fill in all fields.');
    return;
  }

  const adopter = {
    name:    name,
    phone:   phone,
    email:   email,
    address: address
  };

  if (editingIndex === -1) {
    adopters.push(adopter);
  } else {
    adopters[editingIndex] = adopter;
  }

  localStorage.setItem(ADOPTERS_KEY, JSON.stringify(adopters));
  closeForm();
  renderAdopters();
}

function editAdopter(index) {
  const adopter = adopters[index];

  nameInput.value    = adopter.name;
  phoneInput.value   = adopter.phone;
  emailInput.value   = adopter.email;
  addressInput.value = adopter.address;

  editingIndex          = index;
  formTitle.textContent = 'Edit Adopter';
  formBox.classList.add('show');
}

function deleteAdopter(index) {
  if (!confirm('Are you sure you want to delete this adopter?')) {
    return;
  }

  adopters.splice(index, 1);
  localStorage.setItem(ADOPTERS_KEY, JSON.stringify(adopters));
  renderAdopters();
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
          '<button class="action-btn edit-btn"   onclick="editAdopter('   + i + ')">Edit</button>'   +
          '<button class="action-btn delete-btn" onclick="deleteAdopter(' + i + ')">Delete</button>' +
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
  adopters    = JSON.parse(localStorage.getItem(ADOPTERS_KEY)) || [];

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
  document.getElementById('saveBtn').addEventListener('click', saveAdopter);
  searchInput.addEventListener('input', renderAdopters);

  renderAdopters();
});
