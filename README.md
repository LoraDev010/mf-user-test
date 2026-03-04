# Domina People — Micro Frontend Monorepo

A production-ready **Micro Frontend** reference application built with **Vite Module Federation**, React 19, TypeScript, and Tailwind CSS. The project demonstrates a clean host/remote MFE pattern inside an npm workspaces monorepo.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                    Browser (runtime)                       │
│                                                            │
│  ┌─────────────────────────┐  Module Federation (HTTP)     │
│  │  shell  (HOST)          │◄────────────────────────────┐ │
│  │  localhost:5173         │   remoteEntry.js             │ │
│  │                         │                              │ │
│  │  Routes:                │  ┌──────────────────────────┤ │
│  │  /          ──► lazy    │  │  users-mfe  (REMOTE)     │ │
│  │  /users/:id ──► Zustand │  │  localhost:5174          │ │
│  │                         │  │                          │ │
│  │  Zustand store          │  │  Exposes:                │ │
│  │  (selectedUser)         │  │  ./UsersFeature          │ │
│  └─────────────────────────┘  │  (self-contained React   │ │
│                                │   tree + QueryClient)    │ │
│                                └──────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Key architectural decisions

| Decision | Detail |
|----------|--------|
| **Module Federation** | `@originjs/vite-plugin-federation` — `users-mfe` exposes `./UsersFeature`; `shell` consumes it lazily at runtime |
| **Shared singletons** | `react`, `react-dom`, `react-router-dom` are declared `shared` — only one copy loads per session |
| **Self-contained MFE** | `UsersFeature` ships its own `QueryClient` and Zustand store; the host has zero knowledge of its internals |
| **Cross-app comms** | Two parallel patterns: prop callback `onUserSelect(user)` **and** `window.dispatchEvent(new CustomEvent('user:selected', { detail: user }))` |
| **Async boundary** | `React.lazy` + `<Suspense>` wraps the remote import — shell shows `<LoadingScreen>` until the remote bundle arrives |
| **Persistent state** | `useUsersStore` uses `zustand/persist` so local adds/edits/deletes survive page refresh |
| **Routing** | Shell owns routing; MFE is route-agnostic (no `BrowserRouter` inside the exported component) |

---

## Monorepo Structure

```
app-react/                        ← npm workspace root
├── package.json                  ← root scripts, workspaces config
├── package-lock.json
├── apps/
│   ├── shell/                    ← HOST application  (port 5173)
│   │   ├── vite.config.ts        ← declares remote: usersMfe → :5174/remoteEntry.js
│   │   └── src/
│   │       ├── App.tsx           ← Routes: / and /users/:uuid
│   │       ├── pages/
│   │       │   ├── HomePage.tsx  ← lazy-imports UsersFeature, handles onUserSelect
│   │       │   └── UserDetailPage.tsx
│   │       ├── stores/
│   │       │   └── selectedUserStore.ts   ← Zustand (persists selected user across route)
│   │       ├── shared/components/
│   │       │   ├── Layout.tsx
│   │       │   └── LoadingScreen.tsx
│   │       └── types/
│   │           ├── index.ts      ← shared User interface
│   │           └── remote.d.ts   ← TypeScript ambient module declaration for MFE
│   │
│   └── users-mfe/                ← REMOTE micro-frontend (port 5174)
│       ├── vite.config.ts        ← exposes ./UsersFeature
│       └── src/
│           ├── features/users/
│           │   ├── index.tsx     ← PUBLIC API: wraps QueryClientProvider + UsersPage
│           │   ├── types.ts      ← User, UserName, UserLocation … interfaces
│           │   ├── pages/
│           │   │   └── UsersPage.tsx     ← top-level page component
│           │   ├── components/
│           │   │   ├── UserList.tsx      ← grid of UserCard
│           │   │   ├── UserCard.tsx      ← card with avatar + info
│           │   │   ├── UserSearch.tsx    ← controlled search input (debounced)
│           │   │   ├── UserFormModal.tsx ← create / edit modal
│           │   │   └── Pagination.tsx
│           │   ├── hooks/
│           │   │   └── useUsers.ts       ← merges API + local state, filters, paginates
│           │   ├── services/
│           │   │   └── users.service.ts  ← fetchUsers() → randomuser.me/api
│           │   └── store/
│           │       └── usersStore.ts     ← Zustand + persist (search, page, CRUD)
│           └── shared/
│               ├── components/ErrorFallback.tsx
│               ├── hooks/useDebounce.ts
│               └── lib/
│                   ├── httpClient.ts     ← thin fetch wrapper
│                   └── queryClient.ts    ← React Query client (stale 5 min)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build tool | [Vite 6](https://vitejs.dev) |
| Module Federation | [@originjs/vite-plugin-federation 1.3](https://github.com/originjs/vite-plugin-federation) |
| UI library | [React 19](https://react.dev) |
| Language | TypeScript 5.7 (strict) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) + custom design tokens |
| State — server | [TanStack React Query 5](https://tanstack.com/query) |
| State — client | [Zustand 5](https://zustand-demo.pmnd.rs) (`persist` middleware) |
| Routing | [React Router 7](https://reactrouter.com) |
| Animations | [Motion (Framer Motion) 11](https://motion.dev) |
| Data source | [randomuser.me API](https://randomuser.me) |
| Testing | [Jest 30](https://jestjs.io) + [Testing Library 16](https://testing-library.com) |
| Test transform | Babel 7 (`babel-jest`) |
| Package manager | npm 10+ (workspaces) |

---

## Prerequisites

- **Node.js ≥ 20** (tested on v24)
- **npm ≥ 10**

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

This installs all dependencies for the root and both workspace apps in one command.

### 2. Start the MFE remote (must start first)

```bash
npm run dev:mfe
```

`users-mfe` starts on **http://localhost:5174**.  
You can open it standalone to develop the MFE in isolation.

### 3. Start the host shell

```bash
npm run dev:shell
```

Shell starts on **http://localhost:5173** and loads the MFE at runtime from port 5174.

> Both apps must be running simultaneously for the full experience.

---

## Scripts Reference

All scripts are run from the **repository root**.

| Script | Description |
|--------|-------------|
| `npm run dev:mfe` | Start `users-mfe` dev server on port 5174 |
| `npm run dev:shell` | Start `shell` dev server on port 5173 |
| `npm run build:mfe` | Build `users-mfe` (outputs `dist/assets/remoteEntry.js`) |
| `npm run build:shell` | Build `shell` (requires MFE already built) |
| `npm run build` | Build both in order: MFE → shell |
| `npm run preview:mfe` | Serve the built `users-mfe` on port 5174 |
| `npm run preview:shell` | Serve the built `shell` on port 5173 |
| `npm test` | Run `users-mfe` test suite with coverage |
| `npm run test:ci` | Same as above with enforced ≥ 90% line coverage threshold |

---

## Module Federation Wiring

### Remote (`users-mfe/vite.config.ts`)

```typescript
federation({
  name: 'usersMfe',
  filename: 'remoteEntry.js',       // → dist/assets/remoteEntry.js
  exposes: {
    './UsersFeature': './src/features/users/index.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Host (`shell/vite.config.ts`)

```typescript
federation({
  name: 'shell',
  remotes: {
    usersMfe: 'http://localhost:5174/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Consumption in shell

```tsx
// apps/shell/src/pages/HomePage.tsx
const UsersFeature = React.lazy(() => import('usersMfe/UsersFeature'))

<Suspense fallback={<LoadingScreen />}>
  <UsersFeature onUserSelect={handleUserSelect} />
</Suspense>
```

TypeScript knows the remote's shape via an ambient declaration in [apps/shell/src/types/remote.d.ts](apps/shell/src/types/remote.d.ts).

---

## Cross-App Communication

When a user card is clicked, two channels fire simultaneously:

```
users-mfe (UsersPage)
  │
  ├── calls props.onUserSelect(user)         ← prop callback
  │     shell receives it in HomePage.tsx
  │     → sets Zustand selectedUserStore
  │     → navigates to /users/:uuid
  │
  └── dispatches CustomEvent('user:selected') ← event bus
        useful for additional hosts or analytics listeners
```

---

## Testing

```bash
# Run once with coverage report
npm test

# CI mode — fails if line coverage drops below 90%
npm run test:ci
```

Coverage is collected from all `src/**/*.{ts,tsx}` files excluding `main.tsx`, `bootstrap.tsx`, and mock files.

### What's covered

- `features/users/` — store, hooks (`useUsers`), service, all components, page
- `shared/` — `useDebounce`, `httpClient`, `queryClient`, `ErrorFallback`
- Public API smoke test (`features/users/index.tsx`)

---

## Design Tokens

Both apps share identical Tailwind tokens and Google Fonts (loaded in each `index.html`):

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#f0f2f8` | Page background |
| `surface` | `#ffffff` | Cards, modals |
| `brand` | `#1400CC` | Primary actions |
| `accent` | `#FFD400` | Logo checkmark highlight |
| `text-primary` | `#06084a` | Headings |
| `text-secondary` | `#5a5e8a` | Supporting text |

Fonts: **Syne** (display/headings) · **DM Sans** (body)
