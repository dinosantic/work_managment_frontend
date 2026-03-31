# Frontend Guide

## Stack
- React 19
- TypeScript
- Vite
- Utility-class styling via Tailwind-style classes in JSX

## Entry Points
- App bootstrap: `src/main.tsx`
- Top-level app flow: `src/App.tsx`

## Current Architecture
- `src/pages/` contains the user-facing screens: home, login, register, tasks.
- Navigation is local state driven inside `App.tsx`; there is no router yet.
- Auth token is stored in `localStorage` and lifted into `App` state.

## Conventions
- Follow the current small-app pattern unless the task requires a larger rewrite.
- Keep page components focused on their own API calls and local UI state.
- Prefer explicit prop types for page components.
- Keep API calls aligned with backend routes and response shapes.
- Preserve the current auth flow: login stores token, logout clears token, protected screens depend on token presence.

## Existing Behavior To Preserve
- `API_URL` is currently hardcoded in `src/App.tsx` as `http://localhost:3000`.
- App state switches between `login`, `register`, `home`, and `tasks`.
- Tasks page fetches tasks on mount and sends bearer tokens on protected requests.

## UI Guidance
- Match the existing simple utility-class styling unless the task is specifically about redesigning the UI.
- Keep forms and feedback messages straightforward and functional.
- Avoid introducing a routing library or state library unless the task explicitly justifies it.

## Commands
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Implementation Guidance
- When changing request payloads or response handling, update the corresponding backend endpoint in the same task.
- If you change auth storage or page flow, verify the login, logout, and token-gated rendering paths.
- If you touch tasks UI behavior, keep it consistent with backend task status rules and permissions.
