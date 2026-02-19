# Backend API

This directory contains the Express/MongoDB API for the Galaxy attendance/task SaaS.

## Folder structure

- `db/` – database connection helper
- `models/` – Mongoose schemas
- `routes/` – Express routers grouped by feature
- `controllers/` – business logic for each route
- `services/` – data-access functions (models wrappers)
- `middleware/` – auth, error handling, etc.
- `utils/` – small helpers (JWT helpers, etc.)

## Getting started

1. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET` and any other configuration (SMTP, ports, etc.).
2. `npm install` from `backend/`.
3. `npm run dev` to start in development (requires `nodemon`).

The code reads environment values via `config/index.js` so you can use defaults
or override from `.env`.

## Available endpoints (initial)

> **NOTE:** most endpoints are protected by role‑based permissions. When you create a role, you supply a list of permission strings (see `utils/permissions.js`). An admin role created automatically on org creation has `['*']` giving full access.

### Authentication

- `POST /api/auth/register` – register a user; you can also create an organization in the same step by supplying `orgName` (and optionally `orgAddress`) in the request body. The registering user becomes the org admin.
- `POST /api/auth/login` – login and receive JWT
- `GET /api/auth/me` – get current user (requires auth)
- `POST /api/auth/switch-org` – switch active organization (body: `{ orgId }`); returns new token with `currentOrg` field.

### Organizations

- `GET /api/organizations` – list orgs visible to user
- `POST /api/organizations` – create an organization
- `GET /api/organizations/:id` – get org by id

### Users

- `GET /api/users/:id` – get user profile
- `PUT /api/users/:id` – update user
- `GET /api/users/organization/:orgId` – list users in an org

### Roles & Permissions

- `GET /api/roles?organization=<id>` – list roles for an org (authenticated)
- `POST /api/roles` – create a role (`{ organization, name, permissions: [...] }`)
- `PUT /api/roles/:id` – update role
- `DELETE /api/roles/:id` – remove role

  > All role endpoints require appropriate permissions (e.g. `role:create`, `role:update`).
  > See `backend/utils/permissions.js` for available permission constants.

### User membership

- `POST /api/users/roles` – add a role to a user (`{ userId, orgId, roleId }`)
- `DELETE /api/users/roles` – remove a role from a user

### Attendance

- `POST /api/attendance` – add attendance entry
- `GET /api/attendance` – query entries
- `GET /api/attendance/summary?date=YYYY-MM-DD` – get aggregated hours for the `date` (defaults to today) for `currentOrg` (or pass `organization` and/or `user` query params)
- `GET /api/attendance/user/:userId/summary?date=YYYY-MM-DD` – get user's daily summary for a date
- `GET /api/attendance/summary/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` – range aggregation returning per‑day summaries plus `aggregate`
- `GET /api/attendance/summary/export?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` – download CSV export for the date range
- `GET /api/attendance/summary/period?period=week|month&ref=YYYY-MM-DD` – get weekly or monthly summary containing per‑day breakdown and aggregate (ref defaults to today)

### Tasks / Projects

- `POST /api/tasks/projects` – create project
- `GET /api/tasks/projects` – list projects
- `GET /api/tasks/projects/:projectId` – get project details with tasks
- `POST /api/tasks/projects/:projectId/tasks` – add task
- `PUT /api/tasks/tasks/:taskId` – update task

#### Time logging

- `POST /api/tasks/projects/:projectId/tasks/:taskId/logs` – log work on a task (body: `{ start, end, note? }`); duration hours calculated automatically
- `GET /api/tasks/tasks/:taskId/logs` – retrieve all logs for a task

  > When logs are added the task's `hoursLogged` field is updated.

Note: task and project endpoints require appropriate permissions such as `project:create`, `task:create`, `task:update`, `task:view`.

_Note:_ all controllers have sensible implementations now, though you may still want to add additional business validation or unit tests.

## Testing

Use Postman or curl. The authentication token must be sent as `Authorization: Bearer <token>`.

Run unit tests (simple Node scripts):

```bash
cd backend
npm test   # will execute all JS files under tests/ (attendance helpers, utils, etc.)
```

### Request validation and messages

All incoming requests are validated using [zod](https://github.com/colinhacks/zod)
via a generic `validate` middleware. Schema definitions live under
`validators/` and are used by the routes before hitting controllers.

Error and success strings are centralized in `utils/messages.js`; controllers
refer to these constants instead of hard‑coding messages.

### Logging & Notifications

A simple logging utility (`utils/logger.js`) writes JSON entries to
`logs/app.log` and prints to the console; controllers emit events for
important actions (user login, role assignment, project/task changes, etc.).

Email notifications are handled by `utils/email.js`, which uses `nodemailer`
and configuration from `config/index.js`. When SMTP settings are missing a
stub transporter logs outgoing messages instead. Example notifications
(welcome email, role‑assignment notices) are sent from the auth and user
controllers.

## Next steps

1. Implement role and permission logic (models + controllers).
2. Add membership switching, org‑level guards.
3. Build frontend clients (single app or separate super‑admin/app entries).
4. Extend attendance/task logic with detailed calculations.

This scaffolding gives you a clean separation of concerns and a starting point for the complete software.
