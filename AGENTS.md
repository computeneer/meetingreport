# Agent Instructions

> Start with `PURPOSE.md` (Turkish) for domain context. This app tracks meeting notes and task assignments using a React 19 + Vite frontend.

## Package Manager
- Use **Bun**. Both `bun.lock` and `package-lock.json` exist, but `bun.lock` is the current lockfile.
- Commands: `bun install`, `bun run dev`, `bun run build`, `bun run lint`

## Routing (MISMATCH — READ BEFORE EDITING)
- `src/routes/index.tsx` defines the real route tree with lazy-loaded pages (`Home`, `Meetings`, `Tasks`) inside `DefaultLayout`.
- `App.tsx` currently hardcodes a minimal `createBrowserRouter` that **ignores** `src/routes/index.tsx` entirely.
- When adding routes, either update `App.tsx` to consume `routes/index.tsx`, or keep changes in sync.

## Backend
- `PURPOSE.md` specifies **json-server** as the backend. It is planned but **not installed or configured** yet.
- If you implement API persistence, add `json-server` and a `db.json` at repo root.

## Imports
- This is **React Router v7** (package `"react-router"`), NOT `"react-router-dom"`.
- Imports like `createBrowserRouter`, `RouterProvider`, `Outlet`, `useNavigate` come from `"react-router"`.

## TypeScript Strictness
- `tsconfig.app.json` enforces `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`.
- Unused variables or imports will fail the build (`tsc -b`).

## Styling
- **Tailwind CSS v3** + PostCSS + Autoprefixer.
- `PURPOSE.md` requires a custom color palette (`#1E104E`, `#452E5A`, `#FF653F`, `#FFC85C`) but it is **not yet added** to `tailwind.config.js`.
- Animation library **motion** (framer-motion) is installed and available.

## Testing / CI
- No test runner, no CI workflows, no pre-commit hooks are configured.
