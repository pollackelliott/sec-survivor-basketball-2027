# SEC Survivor Basketball 2027

A mobile-first SEC men's basketball survivor pool built from the proven SEC Survivor Football application shell, with a basketball-specific two-game weekly result and strike system.

## Build status

Development is currently on `build/sec-basketball-2027`. Do not treat `main` as production until the basketball database rules, schedule import, automated scores, and end-to-end tests are complete.

## Canonical project documents

- **[GAMEPLAY.md](GAMEPLAY.md)** — definitive gameplay and elimination rules.
- **[SETUP.md](SETUP.md)** — launch, Auth, commissioner, Pages, and secret-key checklist.
- **[data/README.md](data/README.md)** — exact schedule-grid contract.
- `season.json` — season-level configuration.

## Architecture target

ESPN college-basketball data → GitHub Actions → Supabase PostgreSQL/Auth/RLS → vanilla JavaScript frontend → GitHub Pages.

The visual product should remain intentionally close to the SEC football pool; the game engine is basketball-specific.
