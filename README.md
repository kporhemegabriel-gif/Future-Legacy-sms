# Future Legacy School — Student Management System

A full-stack Student Management System for Future Legacy School: React
(Vite) + Tailwind CSS on the frontend, Node/Express + Mongoose on the
backend, connecting to a MongoDB database hosted on Joytree, with
JWT-based admin authentication.

```
sms/
├── server/     Express REST API
└── client/     React (Vite) + Tailwind frontend
```

## 1. Install dependencies

From the project root (needs Node 18+):

```bash
npm run install:all
```

This installs both `server/` and `client/` dependencies. (If you don't want
the root `concurrently` script, you can instead `cd server && npm install`
and `cd client && npm install` separately.)

## 2. Configure your Joytree MongoDB connection

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set `MONGO_URI` to your Joytree connection string, e.g.:

```
MONGO_URI=mongodb://<username>:<password>@<your-cluster>.joytree.site:27017/student_management?authSource=admin
```

or, if Joytree gives you an SRV-style URI:

```
MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster>.joytree.site/student_management?retryWrites=true&w=majority
```

**I need this exact connection string (and to confirm the database name) from
you before the app can talk to real data** — paste it into `server/.env`,
or hand it to me and I'll wire it in. Everything else in the app works
against whatever `MONGO_URI` you provide, so no code changes are needed
once it's set.

Also copy the client env file (defaults work for local dev out of the box):

```bash
cp client/.env.example client/.env
```

## 3. Run it

```bash
npm run dev
```

This starts the API on `http://localhost:5000` and the frontend on
`http://localhost:5173` (Vite proxies `/api` to the server, so the browser
never needs to know the API port).

Watch the server terminal for the MongoDB handshake log:

```
[db] Mongoose connected -> <host>/<database>
[db] MongoDB handshake successful.
```

If it fails, the log will point at the usual culprits: wrong URI, wrong
credentials, or the Joytree cluster not allow-listing your current IP.

## 4. First login

Every route under `/api/students` now requires a logged-in admin. On first
run, open the app and you'll land on **Create Admin Account** automatically
(the API reports there are no admins yet). Fill it in — that becomes the
first admin.

After that first account exists, self sign-up is turned off: the app shows
the **Log In** screen instead, and new staff or admin accounts can only be
created by an existing admin from **Settings → Add Staff / Admin Account**.

Tokens are JSON Web Tokens signed with `JWT_SECRET` (set it in
`server/.env` — see `.env.example`). The frontend stores the token in
`localStorage` and attaches it to every API call automatically; logging out
just clears it.

## API reference

| Method | Route                | Description |
|--------|----------------------|--------------|
| GET    | `/api/auth/setup-status` | Whether any admin account exists yet |
| POST   | `/api/auth/signup`   | Create the *first* admin account only (disabled after that) |
| POST   | `/api/auth/login`    | Log in, returns a JWT + admin profile |
| GET    | `/api/auth/me`       | Current logged-in admin (requires token) |
| POST   | `/api/auth/invite`   | Admin-only: create another staff/admin account |


| Method | Route                        | Description                                   |
|--------|------------------------------|------------------------------------------------|
| GET    | `/api/students`               | List students. Query: `search, course, status, page, limit` |
| GET    | `/api/students/meta/summary`  | Dashboard counts (total, active, graduated, courses) |
| GET    | `/api/students/:id`           | Get one student |
| POST   | `/api/students`               | Create a student |
| PUT    | `/api/students/:id`           | Update a student |
| DELETE | `/api/students/:id`           | Soft delete (deactivate). Add `?hard=true` to permanently remove |

## Notes

- Delete is **soft** by default (sets `isDeleted: true` and hides the record
  from normal reads) so records aren't destroyed by accident. Pass
  `?hard=true` to the DELETE endpoint for a permanent removal.
- Courses are derived automatically from whatever you type into the
  "Major / Course" field — there's no separate courses collection to manage.
- The frontend has no login/auth screen yet; if you need role-based access
  for staff vs. admin, that's a natural next addition to the `server/`
  middleware folder.
