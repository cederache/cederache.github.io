# cederache.github.io

Personal site hosted on [GitHub Pages](https://pages.github.com/). It shows a hero section, a live list of public repositories from the GitHub API, and an about/contact area.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- [TanStack Query](https://tanstack.com/query) for GitHub API data
- [React Router](https://reactrouter.com/) for routing
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/react) for unit tests

## Prerequisites

- Node.js (LTS recommended)
- [pnpm](https://pnpm.io/) — the repo pins a `packageManager` version in `package.json`

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

The dev server listens on port **8080** (see `vite.config.ts`).

## Build

```bash
pnpm build
```

Output goes to `dist/`. Preview the production build with `pnpm preview`.

## Deploy to GitHub Pages ([gh-pages](https://www.npmjs.com/package/gh-pages))

This mirrors the flow from [gitname/react-gh-pages](https://github.com/gitname/react-gh-pages), adapted for **Vite** (build output is `dist/`, not `build/`) and a **user site** repo (`username.github.io`), where `homepage` is `https://cederache.github.io` with no repository path segment.

1. **One-time:** In the GitHub repo → **Settings** → **Pages** → **Build and deployment**: source **Deploy from a branch**, branch **`gh-pages`** folder **`/ (root)`**, then Save.
2. Ensure your local `origin` remote points at this repository (same as the tutorial’s step 6).
3. From the project root:

```bash
pnpm run deploy
```

(`pnpm deploy` is a different pnpm command; use `run deploy` for this script.)

That runs `predeploy` (production build) then pushes the contents of `dist/` to the `gh-pages` branch. Optional custom commit message:

```bash
pnpm run deploy -- -m "Deploy site"
```

Keep deploying **source** on your default branch (`git push`) separately from `pnpm run deploy`, which only updates the **`gh-pages`** branch with the built site.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_GITHUB_TOKEN` | No | GitHub personal access token (classic fine-grained with `public_repo` or read-only repo scope). Without it, the app uses unauthenticated API calls, which have a lower rate limit. |

Create a `.env` or `.env.local` in the project root (do not commit secrets):

```bash
VITE_GITHUB_TOKEN=ghp_...
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build |
| `pnpm build:dev` | Build in development mode |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest once |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm run deploy` | Build and publish `dist/` to the `gh-pages` branch |

## Project layout

- `src/` — application code (`pages/`, `components/`, `hooks/`, etc.)
- `public/` — static assets served as-is
- `index.html` — Vite entry HTML

Repository data is fetched for the GitHub user `cederache`; adjust `GITHUB_USERNAME` in `src/hooks/useGitHubRepos.ts` if you fork this for another account.
