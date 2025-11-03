# LabAdmin - Full-Stack Lab Management System

LabAdmin is a full-stack web application designed to streamline the management of computer laboratories. It provides a complete, role-based system for Students, Teachers, LabTechs, and Admins to report issues, request software, and manage all lab assets and maintenance tasks.

This project is built with a modern stack featuring a React (Vite + Tailwind CSS) frontend and an ASP.NET Core Web API backend connected to a MySQL database.

## 📸 Screenshots

Landing Page

Login Page

Registration Page







(Add dashboard screenshots here as they are built)





## ✨ Key Features

Role-Based Access Control: Users have different views and permissions based on their role:

Student/Teacher: Can submit bug reports ("Tickets") and software requests.

LabTech: Can view assigned tasks and update their status (e.g., In Progress, Completed).

Admin: Can view an analytics dashboard, approve/reject new tickets, and assign tasks to LabTechs.

Ticket Submission: A clean, simple flow for reporting issues with specific lab devices.

Software Requests: A separate flow for requesting new software for a machine.

Task Management: A complete workflow from Pending -> Approved -> Assigned -> Completed.

Secure Authentication: User registration and login handled by JWT (JSON Web Tokens).

Polished UI: A modern, responsive, and attractive UI built with Tailwind CSS.

## 🛠️ Tech Stack

Area

Technology

Frontend

React, Vite, React Router, Tailwind CSS, Axios

Backend

ASP.NET Core 8 (Web API)

Database

MySQL

Authentication

JWT (JSON Web Tokens)

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

Prerequisites

You will need the following tools installed on your system:

.NET 8 SDK

Node.js (LTS) (which includes npm)

Yarn (as used in our setup)

A running MySQL server (e.g., XAMPP, WAMP, or MySQL Workbench)

1. Configure the Database

Ensure your MySQL server is running.

Using a tool like MySQL Workbench or phpMyAdmin, create a new database named lab_maintenance.

Run your CREATE TABLE scripts to create the following tables:

users

labs

devices

tickets

softwarerequests

worklogs

2. Backend Setup (LabAdmin.Api)

Navigate to the API folder:

cd LabAdmin.Api


Configure the connection string:
Open appsettings.json. Find the ConnectionStrings section and update it with your MySQL username and password.

"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=lab_maintenance;user=YOUR_USERNAME;password=YOUR_PASSWORD"
}


Run the backend server:

dotnet run


The server will start, typically on http://localhost:5xxx or https://localhost:7xxx. Note the URL from the terminal output.

3. Frontend Setup (labadmin-client)

Open a new terminal and navigate to the client folder:

cd labadmin-client


Install dependencies:

yarn install
# or: npm install


Set the API URL (Important):
You will need to configure your frontend to know where the backend is. The best way is to update your API service (e.g., src/services/api.js) to point to the backend URL you noted in the previous step.

(For production, you would use a .env file for this.)

Run the frontend app:

yarn dev
# or: npm run dev


Your frontend will now be running on http://localhost:5173. You can open this in your browser and start testing!

## 📁 Project Structure

/
├── LabAdmin.Api/         # ASP.NET Core Backend
│   ├── Controllers/      # API endpoints (e.g., AuthController.cs)
│   ├── Data/             # ApplicationDbContext.cs
│   ├── Models/           # C# database models (User.cs, Ticket.cs, etc.)
│   ├── Program.cs        # Server configuration
│   └── appsettings.json  # Connection strings, JWT keys
│
└── labadmin-client/      # React Frontend
    ├── src/
    │   ├── components/   # Reusable components (Header, Footer, Spinner)
    │   │   └── auth/     # SignInForm.jsx, SignUpForm.jsx
    │   ├── context/      # AuthContext.jsx
    │   ├── hooks/        # useAuth.js
    │   ├── pages/        # Home.jsx, Login.jsx, AuthLayout.jsx, NotFound.jsx
    │   ├── App.jsx       # Main application router
    │   └── main.jsx      # App entry point
    ├── tailwind.config.js
    └── package.json
