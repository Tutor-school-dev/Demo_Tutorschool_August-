# Copilot Instructions for totorbuddy

## Project Overview
- **Type:** Vite + React + TypeScript SPA
- **UI:** shadcn-ui components, Tailwind CSS
- **Structure:**
  - `src/` contains all app code
    - `components/` – main UI components (atomic, reusable)
    - `components/ui/` – shadcn-ui primitives (do not modify directly)
    - `pages/` – top-level route views
    - `hooks/` – custom React hooks
    - `lib/` – shared utilities
    - `assets/` – static images
  - `public/` – static files (served as-is)
  - `vite.config.ts` – Vite config
  - `tailwind.config.ts` – Tailwind config

## Key Patterns & Conventions
- **Component Structure:**
  - Use function components with TypeScript.
  - Prefer composition over inheritance.
  - UI logic is separated into atomic components in `components/` and composed in `pages/`.
- **Styling:**
  - Use Tailwind utility classes for layout and design.
  - Use shadcn-ui primitives for consistent UI patterns.
- **State & Data Flow:**
  - Use React hooks for state and effects.
  - Custom hooks live in `src/hooks/`.
  - Utilities in `src/lib/utils.ts`.
- **Routing:**
  - Top-level views/pages go in `src/pages/`.
- **Assets:**
  - Reference images from `src/assets/` or `public/`.

## Developer Workflows
- **Install dependencies:** `npm i`
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Lint:** `npx eslint .`

## Integration & External Services
- No backend code in this repo; all logic is client-side.
- No API integration patterns are present by default.
- shadcn-ui is used for UI primitives; do not edit files in `components/ui/` directly.

## Examples
- To add a new page: create a file in `src/pages/` and register the route in the router (if present).
- To add a new UI component: add to `src/components/` and import where needed.
- To use a custom hook: create in `src/hooks/` and import in components/pages.

## References
- See `README.md` for setup and editing instructions.
- See `tailwind.config.ts` and `vite.config.ts` for build and styling config.

---

If you are unsure about a pattern, prefer following the structure of existing files in the relevant directory.
