# 🧪 LabAdmin – Laboratory Management System

![.NET 8](https://img.shields.io/badge/.NET-8.0-blueviolet?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/Database-MySQL-00758F?style=for-the-badge&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)
![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?style=for-the-badge&logo=swagger)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

### 🔹 Overview

**LabAdmin** is a full-stack **Laboratory Management System** built with **React (Vite)**, **ASP.NET Core 8 Web API**, and **MySQL**.  
It offers a secure, role-based workflow for managing computer labs — from issue reporting to resolution tracking — across **Admin**, **Lab Technician**, **Teacher**, and **Student** roles.

---

## 📸 Screenshots

| Admin Dashboard | Manage Users | Manage Tickets |
|:----------------:|:-------------:|:---------------:|
| ![Admin Dashboard](https://github.com/user-attachments/assets/ea4775d2-a7f3-4357-bf96-1f9fdd8d62c6) | ![Manage Users](https://github.com/user-attachments/assets/5eabfe03-ea2a-4b0c-9f0e-87cced9004c8) | ![Manage Tickets](https://github.com/user-attachments/assets/c166635f-d0cc-41ec-8e09-c654001801bb) |

| Student Dashboard | Teacher Dashboard | LabTech Dashboard |
|:----------------:|:----------------:|:----------------:|
| ![Student Dashboard](https://github.com/user-attachments/assets/2facd6ef-6dc8-4eaa-9396-8887ff56e161) | ![Teacher Dashboard](https://github.com/user-attachments/assets/fdff220f-b9f6-4667-982b-f516ff2bece2) | *(Screenshot pending)* |

---

## ✨ Core Features

### 👨‍💼 Admin
- **📊 Analytics Dashboard**
  - Monthly Bugs Fixed (Bar)
  - Open vs. Closed Tickets (Donut)
  - Technician Performance (Area)
  - Lab Statistics (Bar List)
- **🧩 Full CRUD Management**
  - Manage Labs, Systems, and Users
- **🎫 Ticket Triage**
  - View & assign tickets to LabTechs
- **💾 Software Request Management**
  - Approve or reject software requests
- **📈 Reporting**
  - Audit Trail for all LabTech actions  
  - Charts for *Tickets per Lab* & *Top Software Requests*

---

### 🔧 Lab Technician (LabTech)
- Dashboard to view all assigned tickets  
- Update ticket statuses (Assigned → InProgress → Completed)  
- Add work logs with remarks (auto-synced to Admin Audit Trail)

---

### 👩‍🏫 Teacher & 🎓 Student
- Personal dashboards showing ticket & request history  
- Report device/lab issues  
- Request new software installations  
- *(Teacher only)* Book a lab for a specific date (placeholder)

---

### ⚙️ General & Security
- **JWT Authentication** for secure API access  
- **Role-Based Access Control (RBAC)** across endpoints  
- **User Profile Management**  
- **Dark Mode UI** with responsive layout and collapsible sidebar  

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React 18 (Vite), React Router, Tailwind CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | ASP.NET Core 8 Web API |
| **Database** | MySQL |
| **ORM** | Entity Framework Core |
| **Authentication** | JWT, BCrypt.Net |
| **API Testing** | Swagger (OpenAPI) |

---

## 🚀 Getting Started

### Prerequisites
Ensure you have:
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js (LTS)](https://nodejs.org/)
- A running **MySQL Server** (e.g., XAMPP, MySQL Workbench)

---

### 1️⃣ Backend Setup (`LabAdmin.Api`)
```bash
cd LabAdmin.Api
dotnet restore
