let adopters = JSON.parse(localStorage.getItem("adopters")) || [];
let editingIndex = -1;

const formBox = document.getElementById("formBox");
const showFormBtn = document.getElementById("showFormBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("adoptersTableBody");
const formTitle = document.getElementById("formTitle");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");

showFormBtn.addEventListener("click", function () {
  formBox.classList.add("show");
  formTitle.textContent = "Add New Adopter";
  clearForm();
  editingIndex = -1;
});

cancelBtn.addEventListener("click", function () {
  formBox.classList.remove("show");
  clearForm();
  editingIndex = -1;
});

saveBtn.addEventListener("click", saveAdopter);
searchInput.addEventListener("input", renderAdopters);

function saveAdopter() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const address = addressInput.value.trim();

  if (name === "" || phone === "" || email === "" || address === "") {
    alert("Please fill in all fields.");
    return;
  }

  const adopter = {
    name: name,
    phone: phone,
    email: email,
    address: address
  };

  if (editingIndex === -1) {
    adopters.push(adopter);
  } else {
    adopters[editingIndex] = adopter;
  }

  localStorage.setItem("adopters", JSON.stringify(adopters));
  renderAdopters();
  clearForm();
  formBox.classList.remove("show");
  editingIndex = -1;
}

function renderAdopters() {
  const searchValue = searchInput.value.toLowerCase().trim();

  const filteredAdopters = adopters.filter(function (adopter) {
    return (
      adopter.name.toLowerCase().includes(searchValue) ||
      adopter.phone.toLowerCase().includes(searchValue) ||
      adopter.email.toLowerCase().includes(searchValue) ||
      adopter.address.toLowerCase().includes(searchValue)
    );
  });

  tableBody.innerHTML = "";

  if (filteredAdopters.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">No adopters found.</td>
      </tr>
    `;
    return;
  }

  filteredAdopters.forEach(function (adopter) {
    const realIndex = adopters.findIndex(function (a) {
      return (
        a.name === adopter.name &&
        a.phone === adopter.phone &&
        a.email === adopter.email &&
        a.address === adopter.address
      );
    });

    tableBody.innerHTML += `
      <tr>
        <td>${adopter.name}</td>
        <td>${adopter.phone}</td>
        <td>${adopter.email}</td>
        <td>${adopter.address}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editAdopter(${realIndex})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteAdopter(${realIndex})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function editAdopter(index) {
  const adopter = adopters[index];

  nameInput.value = adopter.name;
  phoneInput.value = adopter.phone;
  emailInput.value = adopter.email;
  addressInput.value = adopter.address;

  editingIndex = index;
  formTitle.textContent = "Edit Adopter";
  formBox.classList.add("show");
}

function deleteAdopter(index) {
  const confirmDelete = confirm("Are you sure you want to delete this adopter?");
  if (!confirmDelete) {
    return;
  }

  adopters.splice(index, 1);
  localStorage.setItem("adopters", JSON.stringify(adopters));
  renderAdopters();
}

function clearForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
}

renderAdopters();