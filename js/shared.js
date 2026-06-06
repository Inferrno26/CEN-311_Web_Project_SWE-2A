const API_URL = 'http://localhost:5057/api';

const PET_IMAGES = {
  dog:    'https://cdn-icons-png.flaticon.com/512/616/616554.png',
  cat:    'https://cdn-icons-png.flaticon.com/512/6988/6988878.png',
  rabbit: 'https://cdn-icons-png.flaticon.com/512/9308/9308872.png'
};

let pets = [];


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

function showMessage(text, type) {
  const msg = document.getElementById('form-message');
  if (msg) {
    msg.textContent   = text;
    msg.className     = 'form-message ' + type;
    msg.style.display = 'block';
  } else {
    alert(text);
  }
}


async function loadPets() {
  try {
    pets = await apiRequest('/pets', 'GET');
  } catch (error) {
    pets = [];
    showMessage('Could not load pets. Make sure the API is running.', 'error');
  }
}

async function createPet(pet) {
  await apiRequest('/pets', 'POST', pet);
}

async function updatePet(id, pet) {
  pet.id = id;
  await apiRequest('/pets/' + id, 'PUT', pet);
}

async function removePet(id) {
  await apiRequest('/pets/' + id, 'DELETE');
}

async function deletePet(id) {
  if (!confirm('Are you sure you want to delete this pet?')) {
    return;
  }

  try {
    await removePet(id);
    await loadPets();
    renderPetsPage();
  } catch (error) {
    showMessage('Could not delete the pet. Please try again.', 'error');
  }
}

function editPet(id) {
  openEditModal(id);
}

function openEditModal(id) {
  let pet = null;
  for (let i = 0; i < pets.length; i++) {
    if (pets[i].id === id) {
      pet = pets[i];
      break;
    }
  }
  if (!pet) {
    return;
  }

  document.getElementById('edit-pet-id').value     = pet.id;
  document.getElementById('edit-name').value        = pet.name;
  document.getElementById('edit-age').value         = pet.age;
  document.getElementById('edit-weight').value      = pet.weight;
  document.getElementById('edit-location').value    = pet.location;
  document.getElementById('edit-gender').value      = pet.gender;
  document.getElementById('edit-type').value        = pet.type;
  document.getElementById('edit-status').value      = pet.status;
  document.getElementById('edit-description').value = pet.description;

  document.getElementById('editPetOverlay').classList.add('show');
}

function closeEditModal() {
  document.getElementById('editPetOverlay').classList.remove('show');
}

async function saveEditModal() {
  const id          = parseInt(document.getElementById('edit-pet-id').value);
  const name        = document.getElementById('edit-name').value.trim();
  const ageText     = document.getElementById('edit-age').value.trim();
  const weightText  = document.getElementById('edit-weight').value.trim();
  const location    = document.getElementById('edit-location').value.trim();
  const gender      = document.getElementById('edit-gender').value;
  const type        = document.getElementById('edit-type').value;
  const status      = document.getElementById('edit-status').value;
  const description = document.getElementById('edit-description').value.trim();

  if (!name || !ageText || !weightText || !location || !description) {
    alert('Please fill in every field.');
    return;
  }

  const age    = parseInt(ageText);
  const weight = parseFloat(weightText);

  if (isNaN(age) || isNaN(weight)) {
    alert('Age and weight must be numbers.');
    return;
  }

  const updatedPet = {
    name:        name,
    age:         age,
    weight:      weight,
    location:    location,
    gender:      gender,
    type:        type,
    status:      status,
    description: description
  };

  try {
    await updatePet(id, updatedPet);
    closeEditModal();
    await loadPets();
    renderPetsPage();
  } catch (error) {
    alert('Could not save the pet. Please try again.');
  }
}


function getPetImage(type) {
  const key = type.toLowerCase();
  if (PET_IMAGES[key]) {
    return PET_IMAGES[key];
  }
  return PET_IMAGES['dog'];
}


async function handleAddPet() {
  const name        = document.getElementById('name').value.trim();
  const ageText     = document.getElementById('age').value.trim();
  const weightText  = document.getElementById('weight').value.trim();
  const location    = document.getElementById('location').value.trim();
  const gender      = document.getElementById('gender').value;
  const type        = document.getElementById('pet-type').value;
  const status      = document.getElementById('pet-status').value;
  const description = document.getElementById('description').value.trim();

  if (!name || !ageText || !weightText || !location || !gender || !type || !status || !description) {
    showMessage('Please fill in every field before adding a pet.', 'error');
    return;
  }

  const age    = parseInt(ageText);
  const weight = parseFloat(weightText);

  if (isNaN(age) || isNaN(weight)) {
    showMessage('Age and weight must be numbers.', 'error');
    return;
  }

  const newPet = {
    name:        name,
    age:         age,
    weight:      weight,
    location:    location,
    gender:      gender,
    type:        type,
    status:      status,
    description: description
  };

  try {
    await createPet(newPet);

    showMessage('Pet added successfully!', 'success');
    document.getElementById('addPetForm').reset();

    setTimeout(function() {
      window.location.href = 'pets.html';
    }, 1000);
  } catch (error) {
    showMessage('Could not save the pet. Please try again.', 'error');
  }
}


function renderPetsPage() {
  const container = document.querySelector('.card-container');
  if (!container) {
    return;
  }

  const typeFilter   = document.getElementById('filter-type');
  const statusFilter = document.getElementById('filter-status');
  const searchInput  = document.getElementById('filter-search');

  const selectedType   = typeFilter   ? typeFilter.value   : 'All';
  const selectedStatus = statusFilter ? statusFilter.value : 'All';
  const searchQuery    = searchInput  ? searchInput.value.toLowerCase().trim() : '';

  container.innerHTML = '';

  if (pets.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No pets have been added yet. Use Add Pet to get started.</p></div>';
    return;
  }

  let matchCount = 0;

  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];

    const typeMatch   = (selectedType   === 'All') || (pet.type   === selectedType);
    const statusMatch = (selectedStatus === 'All') || (pet.status === selectedStatus);
    const searchMatch = (searchQuery    === '')    || (pet.name.toLowerCase().includes(searchQuery));

    if (typeMatch && statusMatch && searchMatch) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="card-image">' +
          '<img src="' + getPetImage(pet.type) + '" alt="' + pet.type + '" style="width: 120px;" />' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-header">' +
            '<h4>' + pet.name + '</h4>' +
            '<span class="status ' + pet.status.toLowerCase() + '">' + pet.status + '</span>' +
          '</div>' +
          '<p class="card-breed">' + pet.type + ' &bull; ' + pet.gender + '</p>' +
          '<p>' + pet.description + '</p>' +
          '<p>' + pet.age + ' years &bull; ' + pet.weight + ' kg</p>' +
          '<p>' + pet.location + '</p>' +
          '<div class="card-actions">' +
            '<button class="action-btn edit-btn"   onclick="editPet('   + pet.id + ')">Edit</button>' +
            '<button class="action-btn delete-btn" onclick="deletePet(' + pet.id + ')">Delete</button>' +
          '</div>' +
        '</div>';
      container.appendChild(card);
      matchCount++;
    }
  }

  if (matchCount === 0) {
    container.innerHTML = '<div class="empty-state"><p>No pets match your search.</p></div>';
  }
}


async function renderDashboard() {
  try {
    const allPets     = await apiRequest('/pets',         'GET');
    const allAdopters = await apiRequest('/adopters',     'GET');
    const allApps     = await apiRequest('/applications', 'GET');

    const cardValues = document.querySelectorAll('.card-value');
    if (cardValues.length >= 1) { cardValues[0].textContent = allPets.length;     }
    if (cardValues.length >= 2) { cardValues[1].textContent = allAdopters.length; }
    if (cardValues.length >= 3) { cardValues[2].textContent = allApps.length;     }

    renderRecentPets(allPets);
  } catch (error) {
    showMessage('Could not load dashboard data. Make sure the API is running.', 'error');
  }
}

function renderRecentPets(petList) {
  const tbody = document.getElementById('recent-pets-body');
  if (!tbody) {
    return;
  }

  tbody.innerHTML = '';

  if (petList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No pets available yet.</td></tr>';
    return;
  }

  const start = petList.length - 3;
  for (let i = petList.length - 1; i >= 0 && i >= start; i--) {
    const pet = petList[i];
    const row = document.createElement('tr');
    row.innerHTML =
      '<td>' + pet.name + '</td>' +
      '<td>' + pet.type + '</td>' +
      '<td>' + pet.age  + ' years</td>' +
      '<td><span class="status ' + pet.status.toLowerCase() + '">' + pet.status + '</span></td>';
    tbody.appendChild(row);
  }
}


async function init() {
  const addPetForm = document.getElementById('addPetForm');
  if (addPetForm) {
    addPetForm.addEventListener('submit', function(event) {
      event.preventDefault();
      handleAddPet();
    });
  }

  const filterType   = document.getElementById('filter-type');
  const filterStatus = document.getElementById('filter-status');
  const filterSearch = document.getElementById('filter-search');

  if (filterType)   { filterType.addEventListener('change', renderPetsPage);   }
  if (filterStatus) { filterStatus.addEventListener('change', renderPetsPage); }
  if (filterSearch) { filterSearch.addEventListener('input', renderPetsPage);  }

  if (document.querySelector('.card-container')) {
    await loadPets();
    renderPetsPage();
  }

  if (document.querySelector('.card-value')) {
    await renderDashboard();
  }

  const editOverlay = document.getElementById('editPetOverlay');
  if (editOverlay) {
    editOverlay.addEventListener('click', function(event) {
      if (event.target === editOverlay) {
        closeEditModal();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
