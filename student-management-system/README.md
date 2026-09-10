# Future Legacy School — Student Management System

A full-stack Student Management System for Future Legacy School: React
(Vite) + Tailwind CSS on the frontend, Node/Express + Mongoose on the
backend, connecting to a MongoDB database hosted on Joytree, with
JWT-based admin authentication.

```
sms/
├── server/   Express REST API
└── client/   React (Vite) + Tailwind frontend
```

## 1. Install dependencies

```bash
npm run install:all
```

## 2. Configure your Joytree MongoDB connection

```bash
cp server/.env.example server/.env
```

Set in `server/.env`:
- `MONGO_URI` — your Joytree MongoDB connection string
- `JWT_SECRET` — any long random string (required — login fails with
  `secretOrPrivateKey must have a value` if this is empty)
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_ORIGIN` — the URL your frontend will be served from

Also:
```bash
cp client/.env.example client/.env
```

## 3. Run it locally

```bash
npm run dev
```
API on `http://localhost:5000`, frontend on `http://localhost:5173`
(Vite proxies `/api` to the server).

## 4. Deploying on Joytree

You need **two separate deployments**.

### Server (Web Service)
- Site Type: Server App (Node.js / Express)
- Working Directory: `server` (the folder that directly contains
  `server/package.json`)
- Install Command: `npm install`
- Build Command: **empty** — no build step for the server
- Start Command: `npm start`
- Custom App Port: Auto-assigned
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
  `CLIENT_ORIGIN`

### Client (Static Site)
- Site Type: Static Site
- Working Directory: `client`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Set `client/.env`'s `VITE_API_BASE_URL` to the server's live URL **before**
building/deploying the client, since Vite bakes env vars in at build time
(unlike the server, changing this later requires a rebuild, not just a
restart).

**If Joytree runs `vite preview` (a dev/preview server) instead of serving
the built `dist/` folder as static files**, you'll hit a
`Blocked request... not allowed. To allow this host, add it to
server.allowedHosts` error. `vite.config.js` already sets
`preview.allowedHosts: true` to prevent this, but the more robust fix is
making sure Joytree's Static Site serves the `dist/` folder directly
rather than running any Vite server in production at all — static hosting
doesn't need Vite running after the build finishes.

Finally, set `CLIENT_ORIGIN` on the server to the client's live URL and
restart the server (CORS).

## Logo

The school crest lives in `client/public/` (`logo.png`, `logo-icon.png` —
a tighter crop used in the sidebar/login/signup/favicon, `favicon-32.png`).
Referenced via absolute paths (`/logo-icon.png`, etc.) in `index.html`,
`Sidebar.jsx`, `Login.jsx`, and `Signup.jsx` — Vite copies everything in
`public/` to the build output as-is, so no import needed.

## First login

On first run the app shows **Create Admin Account** automatically (no
admins exist yet). After that, self sign-up is disabled — new accounts
are created from **Settings → Add Staff / Admin Account** by an existing
admin.

If you ever get locked out, `scripts/reset-admin.js` lets you list or
delete admin accounts directly via MongoDB from your own computer — see
the comment at the top of that file for usage.

## API reference

| Method | Route                        | Description |
|--------|------------------------------|--------------|
| GET    | `/api/auth/setup-status`     | Whether any admin account exists yet |
| POST   | `/api/auth/signup`           | Create the *first* admin account only |
| POST   | `/api/auth/login`            | Log in, returns a JWT + admin profile |
| GET    | `/api/auth/me`                | Current logged-in admin |
| POST   | `/api/auth/invite`           | Admin-only: create another staff/admin account |
| GET    | `/api/students`               | List students. Query: `search, course, status, page, limit` |
| GET    | `/api/students/meta/summary`  | Dashboard counts |
| GET    | `/api/students/:id`           | Get one student |
| POST   | `/api/students`               | Create a student |
| PUT    | `/api/students/:id`           | Update a student |
| DELETE | `/api/students/:id`           | Soft delete. Add `?hard=true` to permanently remove |

## Notes

- Delete is **soft** by default. Pass `?hard=true` for a permanent removal.
- Courses are derived automatically from the "Major / Course" field.
