# Project Management System

A robust, full-stack Project Management web application built to streamline task tracking, project organization, and team collaboration. This project was designed with a focus on clean architecture, secure user authentication, and strict role-based access control (RBAC).

## 🚀 Features

### Authentication & Authorization
*   **Secure Authentication**: JWT-based authentication with encrypted passwords using bcrypt.
*   **Role-Based Access Control (RBAC)**:
    *   **Admin**: Full access. Can create projects, create tasks, and manage any task across the system.
    *   **Member**: Restricted access. Can view projects and tasks, but can only update the status of tasks explicitly assigned to them.

### Project & Task Management
*   **Project Dashboard**: Create and oversee multiple projects.
*   **Task Tracking**: Create tasks within projects, assign them to team members, and set due dates.
*   **Status Workflows**: Track task progress through organized stages (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`).
*   **Relational Integrity**: Deleting a project cascades and removes all associated tasks securely.

### UI/UX
*   **Modern Interface**: Clean, responsive design utilizing modern React practices.
*   **Interactive Modals**: Seamless project and task creation using intuitive modal overlays.

---

## 🛠️ Technology Stack

**Frontend**
*   [React 19](https://react.dev/) - UI Library
*   [Vite](https://vitejs.dev/) - Build Tool & Dev Server
*   [React Router](https://reactrouter.com/) - Client-side Routing
*   [Axios](https://axios-http.com/) - HTTP Client for API requests
*   [Lucide React](https://lucide.dev/) - Iconography

**Backend**
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - REST API Framework
*   [Prisma ORM](https://www.prisma.io/) - Database ORM
*   [SQLite](https://www.sqlite.org/) - Database
*   [JSON Web Tokens (JWT)](https://jwt.io/) - Authentication
*   [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - Password Hashing

---

## 🗄️ Database Schema

The database is built using Prisma and SQLite, consisting of three main entities:

1.  **User**: Stores user credentials, roles (`ADMIN` or `MEMBER`), and tracks authored projects and assigned tasks.
2.  **Project**: Represents a high-level project container, linked to the user who created it and containing multiple tasks.
3.  **Task**: Individual action items belonging to a project. Tracks status, due date, and the assigned user.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en/download/) (v16.x or higher recommended)
*   npm (comes with Node.js)

---

## 💻 Installation & Setup

This application is split into a `frontend` and `backend` directory. You will need to set up and run both concurrently.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_super_secret_jwt_key_here"
   PORT=5000
   ```

4. Database Initialization:
   Generate the Prisma client and push the schema to the SQLite database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

### 2. Frontend Setup

1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   *(Optional, if required by your setup)* Create a `.env` file in the `frontend` directory to define the backend API URL:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at the URL provided by Vite (usually `http://localhost:5173`).*

---

## 🔑 Default Roles & Testing

To fully test the Role-Based Access Control (RBAC), you should register at least two users:
1.  **Admin User**: Register a user. You may need to manually update their role to `ADMIN` in the SQLite database (using Prisma Studio) or via an admin registration endpoint if one exists.
    *   *Tip to open Prisma Studio: Run `npx prisma studio` in the backend directory.*
2.  **Member User**: Register a standard user (defaults to `MEMBER`).

Test logging in as both to observe the differences in UI permissions (e.g., editing tasks assigned to others).

---

## 📂 Project Structure

```text
project-manager/
├── backend/                  # Express API Server
│   ├── prisma/               # Database Schema & SQLite DB
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # JWT Auth & Role validation
│   │   ├── routes/           # API Route definitions
│   │   └── server.js         # Entry point
│   ├── .env                  # Backend Environment variables
│   └── package.json
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # Reusable UI elements & Modals
    │   ├── pages/            # View components (Dashboard, ProjectList, etc.)
    │   ├── context/          # React Context (Auth State)
    │   ├── api/              # Axios configuration & API calls
    │   ├── App.jsx           # Main routing component
    │   └── main.jsx          # React DOM render
    ├── .env                  # Frontend Environment variables
    └── package.json
```

---

## 🎯 Design Decisions & Approach

*   **Modular Architecture**: The codebase is strictly separated into controllers, routes, and middleware on the backend to ensure scalability and maintainability.
*   **Security First**: Passwords are never stored in plain text. JWTs are used for stateless authentication, ensuring APIs remain secure.
*   **Graceful Degradation**: The UI gracefully hides actions that a user is not permitted to perform based on their role, reducing confusion and preventing unauthorized API calls.

---

*This project was developed as a showcase of full-stack capabilities, emphasizing clean code, relational database management, and secure API design.*
