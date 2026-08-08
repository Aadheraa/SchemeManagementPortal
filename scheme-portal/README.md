# 🏛️ Scheme Management Portal

A full-stack MERN application for managing and applying to government welfare schemes.

---

## 📁 Project Structure

```
scheme-portal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── schemeController.js
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Scheme.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── schemeRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/           ← auto-created on first upload
│   ├── .env
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   └── Navbar.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Schemes.js
        │   ├── MyApplications.js
        │   ├── Profile.js
        │   └── admin/
        │       ├── AdminLayout.js
        │       ├── AdminDashboard.js
        │       ├── AdminSchemes.js
        │       ├── AdminApplications.js
        │       └── AdminUsers.js
        ├── services/
        │   ├── api.js
        │   └── AuthContext.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## ⚙️ Prerequisites

- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm

---

## 🚀 Setup Instructions

### 1. Clone / Extract the project

```bash
cd scheme-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/scheme_portal
JWT_SECRET=your_super_secret_jwt_key
```

Create the `uploads` folder:
```bash
mkdir uploads
```

Seed the database (creates admin + sample schemes):
```bash
node seed.js
```

Start the backend:
```bash
npm run dev     # with nodemon (recommended)
# OR
npm start       # production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

---

## 🔑 Default Credentials

| Role  | Email                   | Password |
|-------|-------------------------|----------|
| Admin | admin@portal.gov.in     | admin123 |
| User  | Register on the site    | —        |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/register  | Register user      |
| POST   | /api/auth/login     | Login              |
| GET    | /api/auth/profile   | Get profile        |
| PUT    | /api/auth/profile   | Update profile     |

### Schemes
| Method | Endpoint            | Access      |
|--------|---------------------|-------------|
| GET    | /api/schemes        | User        |
| GET    | /api/schemes/all    | Admin       |
| POST   | /api/schemes        | Admin       |
| PUT    | /api/schemes/:id    | Admin       |
| DELETE | /api/schemes/:id    | Admin       |

### Applications
| Method | Endpoint                      | Access |
|--------|-------------------------------|--------|
| POST   | /api/applications             | User   |
| GET    | /api/applications/my          | User   |
| GET    | /api/applications             | Admin  |
| PUT    | /api/applications/:id/status  | Admin  |

### Admin
| Method | Endpoint          | Access |
|--------|-------------------|--------|
| GET    | /api/admin/stats  | Admin  |
| GET    | /api/admin/users  | Admin  |

---

## ✨ Features

**User Side:**
- Register/Login with JWT
- View only eligible schemes (filtered by age, education, income)
- Search & filter schemes by category
- Apply with optional document upload
- Track application status (Pending / Approved / Rejected)
- Edit profile

**Admin Side:**
- Dashboard with stats
- Full CRUD for schemes
- Review and approve/reject applications with remarks
- View all registered users

---

## 🎨 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, CSS (custom)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **File Upload:** Multer
- **Fonts:** Sora + Space Mono (Google Fonts)
