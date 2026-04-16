const petsKey = 'pets';
const pets = JSON.parse(localStorage.getItem(petsKey)) || [];

function savePets() {
  localStorage.setItem(petsKey, JSON.stringify(pets));
}

function showMessage(text, type = 'success') {
  const existing = document.getElementById('add-pet-message');
  if (existing) {
    existing.textContent = text;
    existing.className = type === 'error' ? 'message error' : 'message success';
    existing.style.display = 'block';
    return;
  }
  alert(text);
}

function handleAddPet() {
  const name = document.getElementById('name')?.value.trim();
  const age = document.getElementById('age')?.value.trim();
  const weight = document.getElementById('weight')?.value.trim();
  const location = document.getElementById('location')?.value.trim();
  const gender = document.getElementById('gender')?.value;
  const type = document.getElementById('type')?.value;
  const status = document.getElementById('status')?.value;
  const description = document.getElementById('description')?.value.trim();

  if (!name || !age || !weight || !location || !gender || !type || !status || !description) {
    showMessage('Please fill in every field before adding a pet.', 'error');
    return;
  }

  const pet = {
    id: Date.now(),
    name,
    age,
    weight,
    location,
    gender,
    type,
    status,
    description,
  };

  pets.push(pet);
  savePets();

  document.getElementById('addPetForm')?.reset();
  showMessage('Pet added successfully!');
  renderDashboard();
  renderRecentPets();
}

function renderPetsPage() {
  const container = document.querySelector('.card-container');
  if (!container) return;

  container.innerHTML = '';

  if (pets.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No pets have been added yet. Use the Add Pet button to add a new pet.</p></div>';
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-image">
        <img src="https://cdn-icons-png.flaticon.com/512/616/616554.png" alt="${pet.type}" style="width:120px;" />
      </div>
      <div class="card-body">
        <h4><b>${pet.type}</b> <span class="status ${pet.status.toLowerCase()}">${pet.status}</span></h4>
        <p>${pet.description}</p>
        <p><i class="fa-regular fa-calendar"></i> ${pet.age} ${pet.gender}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${pet.location}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderDashboard() {
  const countElements = document.querySelectorAll('.card-value');
  if (countElements.length > 0) {
    countElements[0].textContent = pets.length;
  }

  const petsCount = document.querySelector('#pets-count');
  if (petsCount) {
    petsCount.textContent = pets.length;
  }
}

function renderRecentPets() {
  const tbody = document.getElementById('recent-pets-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const recentPets = pets.slice(-3).reverse();

  if (recentPets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No pets available yet.</td></tr>';
    return;
  }

  recentPets.forEach((pet) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pet.name}</td>
      <td>${pet.type}</td>
      <td>${pet.age}</td>
      <td><span class="status ${pet.status.toLowerCase()}">${pet.status}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function init() {
  const addPetForm = document.getElementById('addPetForm');
  if (addPetForm) {
    addPetForm.addEventListener('submit', function (event) {
      event.preventDefault();
      handleAddPet();
    });
  }

  renderPetsPage();
  renderDashboard();
  renderRecentPets();
}

document.addEventListener('DOMContentLoaded', init);
