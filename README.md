# Meeting Reports

A minimal web application for tracking meeting notes and task assignments. Built with **React 19**, **Vite**, **Tailwind CSS v3**, and **json-server**.

## Features

- **Meetings**: Create, edit, and delete meetings. Each meeting supports multiple notes.
- **Tasks**: Assign tasks to users linked to specific meetings. Mark tasks as completed.
- **Users**: Dynamically manage users (add, edit, delete). Users are persisted via `json-server`.
- **Responsive UI**: Styled with Tailwind CSS using a custom color palette (`#1E104E`, `#452E5A`, `#FF653F`, `#FFC85C`).
- **Animations**: Smooth UI transitions powered by `motion` (Framer Motion).

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- Tailwind CSS v3 + PostCSS + Autoprefixer
- motion (Framer Motion)
- json-server (mock backend)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (project uses `bun.lock`)

### Installation

```bash
bun install
```

### Running the Project

You need to run **two** processes simultaneously: the frontend dev server and the mock backend.

**1. Start the mock API server**

```bash
bun run server
```

This starts `json-server` on `http://localhost:3001` using `db.json`.

**2. Start the Vite dev server**

```bash
bun run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start the Vite development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run server` | Start the json-server mock backend (`http://localhost:3001`) |

## Project Notes

- **Routing**: Real routes are defined in `src/routes/index.tsx` and consumed by `App.tsx`.
- **Backend**: There is no real backend. Data is stored in `db.json` and served by `json-server`.
- **Users**: The user list is dynamic. Manage users via the `/users` route instead of editing constants.
- **TypeScript**: Strict mode is enabled with `noUnusedLocals` and `noUnusedParameters`.
- **Styling**: Custom theme colors are defined in `tailwind.config.js`.
