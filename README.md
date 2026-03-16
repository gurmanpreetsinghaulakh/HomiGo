# HomiGo

A full-stack property listing & booking application with a **Node.js + Express + MongoDB** backend and a **React + Vite** frontend.

---

## 🧭 Project Structure

### 📁 Root
- `README.md` – this file
- `backend/` – API server, data models, auth, and database logic
- `frontend/` – React UI built with Vite

### 🗂️ Backend (`/backend`)
- `app.js` – main Express server
- `cloudComfig.js` – Cloudinary file upload configuration (with disk fallback)
- `schema.js` – Joi validation schemas
- `dump-listings.js` – script to export listings (uses `ALTLASDB_URL`)
- `init/` – database seed scripts
- `models/` – Mongoose models (`User`, `Listing`, `Review`)
- `routes/` – Express routes for listings, users, and reviews
- `controllers/` – route handler logic
- `utils/` – helper utilities (error wrapper, custom error class)

### 🗂️ Frontend (`/frontend`)
- `src/` – React components, pages, styles, context providers
- `public/` – static assets (CSS, JS helpers, images)
- Vite is used as the build/dev tooling (configured in `vite.config.js`)

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (local auth)
- Cloudinary (file uploads)
- EJS (server page templates for some pages)

### Frontend
- React (with hooks + context)
- React Router v6
- Vite (dev server & build)

---

## 🗄️ Database

The backend uses **MongoDB**. By default it connects to:

- `mongodb://127.0.0.1:27017/wanderlust` (local MongoDB)

You may override this using one of these environment variables:

- `ALTLASDB_URL` (typo-compatible)
- `ATLASDB_URL`
- `MONGODB_URI`
- `MONGO_URL`
- `MONGODB_URL`

> ⚠️ The default database name is `wanderlust` unless you override the connection string.

---

## 📦 Environment Variables

Create a `.env` file in the `backend/` folder (next to `app.js`). Example:

```env
# MongoDB / Atlas
ALTLASDB_URL=mongodb://127.0.0.1:27017/wanderlust
# or ATLASDB_URL=... or MONGODB_URI=...

# Session secret (required for sessions/cookies)
SECRET=super-secret-key

# Admin account (created automatically on server start)
ADMIN_EMAIL=admin@example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123

# Cloudinary (optional; uploads fallback to disk if missing)
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-api-key
CLOUD_API_SECRET=your-api-secret

# Optional: serve frontend build from backend
SERVE_FRONTEND=true

# Optional: Listen port (default: 4000)
PORT=4000
```

> ✅ If `SERVE_FRONTEND=true` and `frontend/dist` exists, the backend will serve the React build.

---

## 🚀 Setup & Run (Local Development)

### 1) Backend

```bash
cd backend
npm install
# Start in development mode (auto-reloads on change)
npm run dev
```

API will run on `http://localhost:4000` by default.


### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` by default and calls the backend API under `/api/`.


### 3) Running Both Together

- Start the backend (`npm run dev`) first.
- Then start the frontend (`npm run dev`) in a separate terminal.

> If you build the frontend (`npm run build`) and set `SERVE_FRONTEND=true`, the backend will serve the built UI automatically.

---

## ✅ Admin Account

When the backend starts, it ensures an admin user exists with the credentials from your `.env` file. If not set, defaults are:

- Email: `ketansingla3246@gmail.com`
- Username: `ketansingla3246`
- Password: `ketan@1885`
e.g.::::::::
ADMIN_EMAIL=gurman2109@gmail.com
ADMIN_USERNAME=gurmanpreetsingh
ADMIN_PASSWORD=Gurman@123

> 🔒 It is strongly recommended to change these values before deploying or sharing your instance.

---

## 🧩 Common Commands

From `backend/`
- `npm run dev` – run server with nodemon

From `frontend/`
- `npm run dev` – start Vite dev server
- `npm run build` – build production frontend
- `npm run preview` – preview build

---

## 🗂️ Notes

- File uploads use **Cloudinary** when credentials are provided, otherwise they are stored under `backend/uploads/`.
- The backend exposes a health check at `/ _health`.
- API endpoints are prefixed with `/api` (example: `/api/listings`).

---

## 📌 License

This project does not include a license file.
