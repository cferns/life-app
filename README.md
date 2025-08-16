## Universal Daily Navigator — Demo App

A calm, action‑first daily guide that helps you do the next right thing across three roots: Eat/Rest, Connect, Decide. This repository contains a Vite + React + TypeScript demo of the Map/Solar views, drawers, and theming system. It is designed for quick iteration by engineering, product, design, sales, and customer stakeholders.

### Who this is for
- **Engineering**: modular React components, TypeScript types, hooks, theming via CSS variables, and a Three.js 3D view
- **Product**: realistic demo data, card toggles, modes, and a compact toolbar matching the mock
- **Design/UI**: tokenized themes, card system, grid, and in‑drawer visual theme previews
- **Sales/Customer**: quick to run locally, safe demo data only, no backend required

## Quick start

- **Requirements**: Node 18+.
- **Install**:
```bash
npm install
```
- **Run locally** (hot reload):
```bash
npm run dev
```
- **Build for production**:
```bash
npm run build
```
- **Preview production build**:
```bash
npm run preview
```

Open the app at the local address printed by the dev/preview server.

## What you’re looking at

- **Top bar**: left button opens `Filters` (card visibility toggles). Right avatar opens `Profile` (modes, sync, theme, data reset). Search is visual only in this demo.
- **View 1 (main)**: toolbar with dropdown for `Map 2D`, `Solar 2D`, `Solar 3D`, `List`, `Timeline`; plus `Auto`, `+`, `-`, `Reset` controls. The map has a fullscreen button that uses the browser Fullscreen API.
- **Legend**: horizontal, scrollable chips to filter by kind and status.
- **View 2**: optional secondary card that can show Map 2D, Solar 2D, List, or Timeline.
- **Quick Actions / Today’s Story / Anchors**: sample cards with demo content; visibility is controlled in `Filters`.

### Interactions
- **Drag pins** on Map 2D to reposition; double‑click a pin to edit.
- **Double‑click** empty map area to quick‑add a task at center.
- **Timeline**: drag blocks to adjust start; double‑click a block to edit.
- **Fullscreen**: use the ↗ button in the map. Click again or press Esc to exit.

## Theming

Themes are applied with CSS variables on `<body data-theme="...">`. The app ships with four options and persists your selection to `localStorage`.

- **Light**: iOS‑style light surface cards on a soft light page background
- **Dark**: dark page and card surfaces, high‑contrast text and controls
- **Warm**: warm, cream background and light card surfaces
- **Custom (photo)**: upload an image; a palette is extracted on‑device and saved

What changes with a theme:
- Page background `--app-bg`
- Text `--text`
- Card surfaces and borders `--card-bg`, `--card-border`
- Pills/buttons on accent surfaces `--control-*`
- Section headers/accent surfaces `--accent-*`
- Map surface and grid `--surface-bg`, `--grid-color`

Preview tiles in the Profile drawer show the theme’s page background, accent bar, control chip, and card look.

### Custom theme (photo)
- Choose an image in `Profile → Theme → Custom (photo)`.
- The app calculates a palette client‑side (no upload) and saves it to `localStorage` under `udn_theme_custom` and sets theme to `custom`.
- Text contrast is computed automatically based on background luminance.

## Data and privacy
- All data in this demo is static and stored in the browser only (`localStorage`). No external network calls besides loading local docs.
- You can reset the demo data from `Profile → Data → Reset demo data`.

## Code structure

- `src/ConsolidatedLifeTracker.tsx` — main composition of the page; coordinates drawers, views, and modals
- `src/components/` — UI pieces
  - `HeaderBar.tsx` — compact top bar with `Filters` and `Profile` triggers
  - `FiltersDrawer.tsx` — card visibility toggles (View 1, Legend, View 2, Quick actions, Today’s story, Anchors)
  - `ProfileDrawer.tsx` — Modes (Faith, Sabbath), Sync state, Data reset, Theme selection + custom photo
  - `VisualizationToolbar.tsx` — view selector + Auto/Zoom/Reset controls
  - `MapView.tsx` — 2D map with pins, grid, ring labels, and fullscreen toggle
  - `SecondaryView.tsx` — secondary card that can render map/solar/list/timeline
  - `Legend.tsx` — horizontal filter chips by kind and attention status
  - `AvgDayTimeline.tsx` — simple average‑day timeline with drag + double‑click to edit
  - `QuickActions.tsx`, `TodaysStory.tsx`, `AnchorsCard.tsx` — supporting cards
  - `GlobalEditModal.tsx`, `QuickAddModal.tsx`, `IntentQuickAddModal.tsx` — modals for edit/add flows
  - `Card.tsx` — shared card surface using CSS variables
- `src/hooks/`
  - `usePinsStorage.ts` — persist pins to `localStorage`
  - `useFullscreen.ts` — browser fullscreen with vendor prefixes + state sync
- `src/theme.ts` — theme palettes, storage helpers, and `applyPalette`
- `src/style.css` — global CSS and theme tokens for `light`, `warm`, `dark`, `custom`
- `src/utils/map.ts` — helpers like `formatLabel` and `clampPct`
- `src/data/seed.ts` — demo pins, scores, and lists

## Design tokens (CSS variables)

Defined on `:root` and overridden by `body[data-theme]`:
- `--app-bg`, `--text`
- `--card-bg`, `--card-border`, `--pill-bg`
- `--accent-bg`, `--accent-text`
- `--control-bg`, `--control-text`, `--control-border`
- `--surface-bg`, `--grid-color`

## Troubleshooting

- **Fullscreen doesn’t enter/exit**: Some browsers require a user interaction (click/tap). Use the ↗ button inside the map. Esc exits. The app listens to both `fullscreenchange` and `webkitfullscreenchange`.
- **Theme colors look wrong after changing**: The app clears stale inline CSS vars before applying a palette. If needed, switch to another theme and back, or open devtools and clear `localStorage` keys `udn_theme` and `udn_theme_custom`.
- **Text is hard to read on Custom**: The theme engine computes a contrasting `--text` automatically. If your photo is extremely bright/dark, pick another image with a stronger dominant color.
- **Build warnings about chunk size**: This is a single‑page demo; splitting by route is not yet configured. See Vite’s Rollup `manualChunks` if needed for production.

## Contributing

- Branching: feature branches off `main`. Example: `feat/…`, `chore/…`, `fix/…`.
- Linting/TS config is strict; keep files under ~500 lines for easier review.

## License

Demo code for internal exploration and evaluation. Not licensed for redistribution without permission.
