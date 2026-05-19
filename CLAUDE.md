# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BiteReel** — a full-stack social food discovery and delivery platform combining Instagram-style vertical food video reels with food ordering. Built as a university final project (UET, Web Technologies lab).

## Development Commands

### Backend
```bash
# Start backend (from /backend)
npx nodemon server.js

# Or with node
node server.js
```
Backend runs on port **3000**. Entry point is `backend/server.js` (not inside `src/`).

### Frontend
```bash
# Start dev server (from /frontend)
npm run dev

# Lint
npm run lint

# Build
npm run build
```

No test suite is configured for either backend or frontend.

## Architecture

### Stack
- **Backend:** Node.js + Express 5, MongoDB + Mongoose, JWT auth, ImageKit (video storage), Multer (file uploads) — CommonJS modules
- **Frontend:** React 19, React Router 7, Vite — ES modules. Tailwind CSS is **not yet installed**.

### Backend Structure

`backend/server.js` — HTTP server entry; loads dotenv, connects DB, starts listening.  
`backend/src/app.js` — Express instance, mounts `cookie-parser`, `express.json()`, and route prefixes.  
`backend/src/` — MVC layers:

| Path | Purpose |
|------|---------|
| `routes/` | URL definitions and middleware wiring |
| `controllers/` | Business logic and response handling |
| `models/` | Mongoose schemas (User, FoodPartner, Food) |
| `middlewares/auth.middleware.js` | JWT cookie validation |
| `services/storage.services.js` | ImageKit upload abstraction |
| `db/db.js` | Mongoose connection |

### API Routes (`/api`)

**Auth** (`/api/auth`):
- `POST /user/register` — register user
- `POST /user/login` — login user (sets JWT cookie)
- `GET /user/logout` — clear cookie
- `POST /food-partner/register` — register food partner
- `POST /food-partner/login` — login food partner
- `GET /food-partner/logout` — clear cookie

**Food** (`/api/food`):
- `POST /` — create food item; requires `authFoodPartnerMiddleware`; multipart/form-data with field name **`food2`** for the video file
- `GET /` — list all foods; requires `authUserMiddleware`

### Authentication

JWT tokens stored in HTTP-only cookies. Two separate middleware guards:
- `authUserMiddleware` — attaches `req.user` (regular user routes)
- `authFoodPartnerMiddleware` — attaches `req.foodPartner` (food partner routes)

Both decode the token, look up the entity in MongoDB, and short-circuit with 401 if missing or invalid.

### Data Models

- **User**: `fullName`, `email` (unique), `password` (bcrypt), timestamps
- **FoodPartner**: `name`, `email` (unique), `password` (bcrypt)
- **Food**: `name`, `video` (ImageKit URL), `description`, `foodPartner` (ref)

### Frontend Structure (`frontend/src/`)

No page components exist yet. `routes/AppRoutes.jsx` defines four routes with inline placeholder JSX (`<h1>` stubs): `/user/register`, `/user/login`, `/food-partner/register`, `/food-partner/login`. `App.jsx` renders only `<AppRoutes />`. `StrictMode` is commented out in `main.jsx`.

No API client, no state management, no Tailwind, no axios/fetch wrappers — all of this is still to be built.

## Environment Variables

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/food-view
JWT_SECRET=<secret>
IMAGEKIT_PUBLIC_KEY=<key>
IMAGEKIT_PRIVATE_KEY=<key>
IMAGEKIT_URL_ENDPOINT=<url>
```

## Current State

- Backend auth and food upload/listing are functional
- Frontend is scaffolded (React Router, Vite) but has no page components or API integration
- No CORS middleware configured — required when frontend (Vite default :5173) and backend (:3000) run on different ports
- No Vite proxy configured — add `server.proxy` in `vite.config.js` to forward `/api` to `localhost:3000` during development
