# Galaxy Frontend

A modern React 19 + Vite frontend for the Galaxy SaaS application. Built with Tailwind CSS, Redux Toolkit, React Router, react-hook-form, and zod validation.

## Features

- **Authentication**: JWT-based login with persistent session storage.
- **State Management**: Redux Toolkit with async thunks for API calls.
- **Form Validation**: react-hook-form + zod for client-side and schema validation.
- **API Integration**: Axios with built-in JWT interceptor for authenticated requests.
- **Routing**: React Router v7 with loaders/actions for data fetching and form submission.
- **UI Framework**: Tailwind CSS v4.2.0 with responsive mobile-first layouts.
- **Notifications**: react-hot-toast for success/error messages (top-right position).
- **Modular Routes**: Organized route modules under `src/routes/` for easy scaling.

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, FilterBar)
│   ├── layouts/           # Layout components (MainLayout with Toaster)
│   ├── pages/             # Page components with loader/action exports
│   │   ├── Login.jsx      # Login with action handler
│   │   ├── Dashboard.jsx  # Home dashboard with quick-access tiles
│   │   ├── Users.jsx      # User list with filters and loader
│   │   ├── UserDetail.jsx # Edit user with loader/action
│   │   ├── Projects.jsx   # Project list with filters and loader
│   │   ├── ProjectDetail.jsx
│   │   ├── Attendance.jsx # Attendance list with filters and loader
│   │   ├── AttendanceSummary.jsx
│   │   └── SwitchOrg.jsx  # Switch organization with loader/action
│   ├── routes/            # Modular route definitions
│   │   ├── index.js       # Main router configuration
│   │   ├── auth.js        # Login route
│   │   ├── users.js       # User routes
│   │   ├── projects.js    # Project routes
│   │   └── attendance.js  # Attendance routes
│   ├── services/
│   │   └── api.js         # Axios instance with JWT interceptor
│   ├── store/             # Redux store and slices
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── usersSlice.js
│   │   ├── projectsSlice.js
│   │   └── attendanceSlice.js
│   ├── validators/        # Zod schemas for form validation
│   │   ├── auth.js        # Login validation
│   │   └── user.js        # User validation
│   ├── utils/
│   │   ├── messages.js    # Centralized success/error messages
│   │   └── toast.js       # Toast notification helpers
│   ├── styles/
│   │   └── components.css # Custom Tailwind component styles
│   ├── main.jsx          # Entry point with RouterProvider
│   └── index.css         # Tailwind directives + global styles
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
└── README.md
```

## Setup

### Install Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5174` (or the next available port).

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## API Integration

### Axios Service (`src/services/api.js`)

- **Base URL**: Configurable via `VITE_API_URL` environment variable (default: `http://localhost:3000/api`)
- **Auth Interceptor**: Automatically attaches Bearer token from Redux `auth.token` to all requests
- **Error Handling**: Caught by action handlers and displayed as toast notifications

### Loaders & Actions

Each page module exports optional `loader()` and `action()` functions for React Router:

- **Loaders**: Fetch data server-side before rendering (e.g., `loader({ params })` for user details)
- **Actions**: Handle form submissions with zod validation and show toasts on success/error

Example usage in routes:

```javascript
export async function loader({ params }) {
  const res = await api.get(`/users/${params.id}`);
  return { user: res.data };
}

export async function action({ request, params }) {
  const form = await request.formData();
  const data = Object.fromEntries(form);
  try {
    const parsed = userDetailSchema.parse(data);
    const res = await api.put(`/users/${params.id}`, parsed);
    showSuccess("Saved successfully.");
    return { success: true, data: res.data };
  } catch (err) {
    showError(err.response?.data?.message || err.message);
    return { error: err };
  }
}
```

## State Management (Redux)

### Example: Auth Slice (`src/store/authSlice.js`)

- **`login` thunk**: POST to `/auth/login`, stores token in state
- **`logout` reducer**: Clears token from state
- **Interceptor**: Attaches token to all subsequent API requests

### Other Slices

- **usersSlice**: `fetchUsers(filters)` thunk for paginated user list
- **projectsSlice**: `fetchProjects(filters)` thunk for project list
- **attendanceSlice**: `fetchAttendance(filters)` and `fetchAttendanceSummary()` thunks

## Form Validation

### Zod Schemas (`src/validators/`)

```javascript
// auth.js
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password required" }),
});

// user.js
export const userDetailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
```

### react-hook-form Integration

Forms are wired with `zodResolver` for real-time validation:

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("email")} placeholder="Email" />
  {formState.errors.email && <span>{formState.errors.email.message}</span>}
</form>
```

## Tailwind CSS v4.2.0

### PostCSS Setup

- **Plugin**: `@tailwindcss/postcss` (required for v4)
- **Config**: `tailwind.config.cjs` includes content paths
- **Global**: `src/index.css` includes `@import "tailwindcss";`

### Custom Components

Utility-first approach. Common component styles in `src/styles/components.css`:

```css
.input {
  @apply w-full px-3 py-2 border border-slate-300 rounded text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
```

## Notifications (react-hot-toast)

### Setup

- **Toaster** rendered in `src/layouts/MainLayout.jsx` at position="top-right"
- **Helpers** in `src/utils/toast.js`:
  - `showSuccess(msg)` – Green toast
  - `showError(err)` – Red toast with error message fallback

### Usage

```javascript
import { showSuccess, showError } from "../utils/toast.js";

try {
  await api.post("/users", data);
  showSuccess("User created.");
} catch (err) {
  showError(err.response?.data?.message || err.message);
}
```

## Development Tips

### HMR (Hot Module Replacement)

Vite automatically refreshes the page when you save changes. No need to manually reload.

### Responsive Design

- Mobile-first Tailwind utilities: `sm:`, `md:`, `lg:`, `xl:`
- Example: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` = 1 col on mobile, 2 on tablet, 3 on desktop

### Linting

```bash
npm run lint
```

## Dependencies

| Package              | Version | Purpose                      |
| -------------------- | ------- | ---------------------------- |
| react                | ^19.2.4 | UI library                   |
| react-dom            | ^19.2.4 | DOM rendering                |
| react-router-dom     | ^7.13.0 | Client-side routing          |
| @reduxjs/toolkit     | ^2.11.2 | State management             |
| react-redux          | ^9.2.0  | Redux bindings               |
| react-hook-form      | ^7.71.1 | Form state management        |
| zod                  | ^4.3.6  | Schema validation            |
| axios                | ^1.13.5 | HTTP client                  |
| tailwindcss          | ^4.2.0  | CSS framework                |
| @tailwindcss/postcss | Latest  | Tailwind PostCSS plugin (v4) |
| react-hot-toast      | ^2.6.0  | Toast notifications          |

## Troubleshooting

### Port 5173 Already in Use

Vite will automatically try the next available port (e.g., 5174, 5175). Check the terminal output for the actual URL.

### "Cannot find module" Errors

Ensure file extensions are correct:

- Components: `.jsx`
- Plain JS/config: `.js`
- Styles: `.css`

### PostCSS Errors

If you see "need to install @tailwindcss/postcss", run:

```bash
npm install --save-dev @tailwindcss/postcss
```

And verify `postcss.config.cjs` includes:

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Next Steps

- [ ] Add TypeScript for type safety
- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Add error boundary component
- [ ] Add loading skeletons
- [ ] Add dark mode support
- [ ] Optimize bundle with code splitting

## License

Galaxy © 2026. All rights reserved.
