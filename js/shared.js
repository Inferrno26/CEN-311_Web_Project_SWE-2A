const PETS_KEY     = 'pets';
const ADOPTERS_KEY = 'adopters';
const APPS_KEY     = 'pac_applications';

const PET_IMAGES = {
  dog:    'https://cdn-icons-png.flaticon.com/512/616/616554.png',
  cat:    'https://cdn-icons-png.flaticon.com/512/6988/6988878.png',
  rabbit: 'https://cdn-icons-png.flaticon.com/512/9308/9308872.png'
};

function getPets() {
  const stored = localStorage.getItem(PETS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

function savePets(pets) {
  localStorage.setItem(PETS_KEY, JSON.stringify(pets));
}

function showMessage(text, type) {
  const msg = document.getElementById('form-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'form-message ' + type;
    msg.style.display = 'block';
  } else {
    alert(text);
  }
}

function handleAddPet() {
  const name        = document.getElementById('name').value.trim();
  const age         = document.getElementById('age').value.trim();
  const weight      = document.getElementById('weight').value.trim();
  const location    = document.getElementById('location').value.trim();
  const gender      = document.getElementById('gender').value;
  const type        = document.getElementById('pet-type').value;
  const status      = document.getElementById('pet-status').value;
  const description = document.getElementById('description').value.trim();

  if (!name || !age || !weight || !location || !gender || !type || !status || !description) {
    showMessage('Please fill in every field before adding a pet.', 'error');
    return;
  }

  const newPet = {
    id:          Date.now(),
    name:        name,
    age:         age,
    weight:      weight,
    location:    location,
    gender:      gender,
    type:        type,
    status:      status,
    description: description
  };

  const pets = getPets();
  pets.push(newPet);
  savePets(pets);

  showMessage('Pet added successfully!', 'success');
  document.getElementById('addPetForm').reset();

  renderDashboard();
  renderRecentPets();

  setTimeout(function() {
    window.location.href = 'pets.html';
  }, 1000);
}

function getPetImage(type) {
  const key = type.toLowerCase();
  if (PET_IMAGES[key]) {
    return PET_IMAGES[key];
  }
  return PET_IMAGES['dog'];
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

  const pets = getPets();
  container.innerHTML = '';

  if (pets.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No pets have been added yet. Use Add Pet to get started.</p></div>';
    return;
  }

  let matchCount = 0;

  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];

    const typeMatch   = (selectedType === 'All')   || (pet.type === selectedType);
    const statusMatch = (selectedStatus === 'All') || (pet.status === selectedStatus);
    const searchMatch = (searchQuery === '')       || (pet.name.toLowerCase().includes(searchQuery));

    if (typeMatch && statusMatch && searchMatch) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="card-image">' +
          '<img src="' + getPetImage(pet.type) + '" alt="' + pet.type + '" style="width: 120px;" />' +
        '</div>' +
        '<div class="card-body">' +
          '<h4><b>' + pet.type + '</b> <span class="status ' + pet.status.toLowerCase() + '">' + pet.status + '</span></h4>' +
          '<p>' + pet.description + '</p>' +
          '<p>' + pet.age + ' &bull; ' + pet.gender + '</p>' +
          '<p>' + pet.location + '</p>' +
        '</div>';
      container.appendChild(card);
      matchCount++;
    }
  }

  if (matchCount === 0) {
    container.innerHTML = '<div class="empty-state"><p>No pets match your search.</p></div>';
  }
}

function renderDashboard() {
  const pets     = getPets();
  const adopters = JSON.parse(localStorage.getItem(ADOPTERS_KEY)) || [];
  const apps     = JSON.parse(localStorage.getItem(APPS_KEY))     || [];

  const cardValues = document.querySelectorAll('.card-value');
  if (cardValues.length >= 1) { cardValues[0].textContent = pets.length;     }
  if (cardValues.length >= 2) { cardValues[1].textContent = adopters.length; }
  if (cardValues.length >= 3) { cardValues[2].textContent = apps.length;     }
}

function renderRecentPets() {
  const tbody = document.getElementById('recent-pets-body');
  if (!tbody) {
    return;
  }

  const pets = getPets();
  tbody.innerHTML = '';

  if (pets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No pets available yet.</td></tr>';
    return;
  }

  const start = pets.length - 3;
  for (let i = pets.length - 1; i >= 0 && i >= start; i--) {
    const pet = pets[i];
    const row = document.createElement('tr');
    row.innerHTML =
      '<td>' + pet.name + '</td>' +
      '<td>' + pet.type + '</td>' +
      '<td>' + pet.age  + '</td>' +
      '<td><span class="status ' + pet.status.toLowerCase() + '">' + pet.status + '</span></td>';
    tbody.appendChild(row);
  }
}

function init() {
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

  if (filterType)   { filterType.addEventListener('change', renderPetsPage);  }
  if (filterStatus) { filterStatus.addEventListener('change', renderPetsPage); }
  if (filterSearch) { filterSearch.addEventListener('input', renderPetsPage);  }

  renderPetsPage();
  renderDashboard();
  renderRecentPets();
}

document.addEventListener('DOMContentLoaded', init);
