# ContentHub — Content Management & Analytics Dashboard

A full-stack content workspace for publishing posts, tracking engagement, and managing users with role-based access. The project pairs a React dashboard with a NestJS REST API and a MySQL database.

> **Suggested GitHub repository name:** `content-hub-dashboard`

## Features

- Register and sign in with JWT-based authentication
- Role-aware dashboard with protected pages
- Create and browse posts; record views and likes
- Admin UI for searching users and managing roles
- Analytics dashboard with post, view, and engagement summaries
- MySQL persistence through TypeORM

## Tech stack

- **Frontend:** React, TypeScript, Vite, React Router, Axios, Recharts
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** MySQL
- **Quality:** Oxlint, Vitest

## Project structure

```text
.
├── backend/
│   └── backend/   # NestJS API
└── frontend/      # React + Vite app
```

## Prerequisites

- Node.js and npm
- A MySQL server and a database with tables matching the application entities

The API uses `synchronize: false`, so it will not create or update the database schema automatically. No schema migration or seed script is included; prepare a compatible schema and an initial admin account before using the admin features.

## Run locally

### 1. Configure and start the API

From the repository root:

```bash
cd backend/backend
npm install
```

Create a `.env` file in `backend/backend/` and set your database credentials and a private JWT secret:

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=replace_with_a_long_random_secret
```

Start the API in development mode:

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

### 2. Start the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
```

Optionally create `frontend/.env` to point the app at a different API URL:

```dotenv
VITE_API_URL=http://localhost:3000
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The API currently allows browser requests from that default frontend origin.

## API overview

All routes are relative to the API origin. Protected routes expect an `Authorization: Bearer <token>` header.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register an account |
| `POST` | `/auth/login` | Public | Get an access token |
| `GET` | `/auth/profile` | Authenticated | Get the current profile |
| `POST` | `/auth/logout` | Authenticated | Log out in the client |
| `GET` | `/posts` | Authenticated | List posts and like counts |
| `POST` | `/posts` | Authenticated | Create a post |
| `POST` | `/posts/:id/view` | Authenticated | Record a post view |
| `POST` | `/posts/:id/like` | Authenticated | Like a post |
| `PUT`, `DELETE` | `/posts/:id` | Admin | Update or remove a post |
| `GET` | `/analytics` | Authenticated | Get workspace analytics |
| `GET` | `/users` | Authenticated | Search/list users (supports `search` and `role` query parameters) |
| `POST`, `PUT`, `DELETE` | `/users` and `/users/:id` | Admin | Manage users |

## Checks

Run backend tests from `backend/backend/`:

```bash
npm test
npm run test:e2e
```

Build and lint the frontend from `frontend/`:

```bash
npm run build
npm run lint
```

## Showcase notes

For a polished GitHub presentation, add a dashboard screenshot or short GIF, and replace the suggested repository slug if it is already taken. Keep database credentials and JWT secrets in local environment files—never commit them.
