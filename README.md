# JobFlow – Job Application Tracker

**JobFlow** is a full-stack web app for tracking job applications through the hiring pipeline. Register, log in, add roles you've applied for, and monitor them from applied → interview → offer or rejection. Your dashboard shows how many applications sit at each stage so you can see progress instead of guessing.

## Features

- **User authentication** – Sign up and sign in with JWT stored in httpOnly cookies
- **Job CRUD** – Add, edit, delete, and list all your applications
- **Status pipeline** – Track each job as: Applied, Interviewing, Offer, Rejected, or Accepted
- **Per-application notes** – Company, role, date applied, and free-form notes
- **User-scoped data** – Each user sees only their own applications

## Tech stack

| Layer   | Tech                           |
|---------|--------------------------------|
| Frontend| React, Vite, Tailwind, React Router |
| Backend | Express, Bun, MongoDB (Mongoose) |
| Auth    | JWT (httpOnly cookies)         |

## Project structure

- **client/** – React SPA (Vite, Tailwind)
- **backend/** – Express REST API with MongoDB

## Setup

1. **Install dependencies**
   ```bash
   cd client && bun install
   cd ../backend && bun install
   ```

2. **Backend environment**
   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Run**
   - Backend: `cd backend && bun run dev`
   - Client: `cd client && bun run dev`

## .gitignore

A root `.gitignore` covers the whole project: `node_modules`, build output, env files, logs, caches, and editor files.
