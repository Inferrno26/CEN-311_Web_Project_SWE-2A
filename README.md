# Pet Adoption Center Management System

A full-stack CRUD web application developed for our **CEN 311 Web Development** project.
This project is a **Pet Adoption Center Management System**, allowing users to manage pets, adopters, and adoption applications through a clean interface backed by a real API and database.

## Project Overview

The application demonstrates the core CRUD operations across three resources:

- **Create** new records
- **Read** and display stored records
- **Update** existing records
- **Delete** records

The frontend is built with vanilla HTML, CSS, and JavaScript and talks to an **ASP.NET Core Web API** that persists data in a **SQLite** database via **Entity Framework Core**.

## Main Features

- Manage pet records (with images, filtering, and search)
- Manage adopter records
- Manage adoption applications
- Edit and delete existing entries through dedicated forms and modals
- Dashboard with live counters and recent pets
- Persistent storage in a real database
- Clean and user-friendly interface
- Simple navigation between pages
- Modular front-end structure for team collaboration

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend:** ASP.NET Core Web API (C#)
- **Database:** SQLite via Entity Framework Core
- **Tooling:** VS Code Live Server for the frontend, .NET SDK for the backend

## How to Run

1. **Start the backend.** Open a terminal in the `backend/` folder and run:
   ```
   dotnet run
   ```
   The API will start on `http://localhost:5057`. On first run, a `paws_hearts.db` SQLite file is created and seeded with sample data.

2. **Open the frontend.** Open `index.html` through **VS Code Live Server** (right-click → Open with Live Server). The frontend runs on `http://127.0.0.1:5500` or `http://localhost:5500`.

The frontend and backend must both be running for the app to work.

## Team Members

- Ana Gjergji
- Alba Gjergji
- Henri Aliaj
- Mekin Sijoni
- Isuf Çelhaka
- Amanda Shirka
- Dion Hasanbashaj
