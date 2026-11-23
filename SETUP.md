# SEC Survivor Basketball 2027 — Launch / Operations Setup

This file is the persistent setup checklist for the 2027 SEC basketball survivor app.

## Current project references

- GitHub repository: `pollackelliott/sec-survivor-basketball-2027`
- Working branch: `build/sec-basketball-2027`
- Supabase project: `SEC Survivor - Basketball 2027`
- Supabase project ref: `rlsxmkxwruuzimskvwrr`
- GitHub Pages URL target: `https://pollackelliott.github.io/sec-survivor-basketball-2027/`
- Canonical gameplay specification: `GAMEPLAY.md`
- Preserved normalized schedule: `data/normalized-schedule.json`

## 1. Enable GitHub Pages for the repository

In GitHub:

**Repository → Settings → Pages → Build and deployment → Source → GitHub Actions**

The repository contains `.github/workflows/preview-pages.yml`. While development remains on the build branch, pushes to `build/sec-basketball-2027` deploy the preview site.

## 2. Configure Supabase Auth for this pool

The app intentionally uses immediate email/password signup, matching the football survivor UX.

In Supabase:

**Authentication → Sign In / Providers → Email**

- Keep email/password signup enabled.
- Turn **Confirm email** OFF before public signups open.

With Confirm email off, a successful browser signup receives an active session immediately, allowing the same signup action to submit the Week 1 pick.

Then configure:

**Authentication → URL Configuration**

- Site URL: `https://pollackelliott.github.io/sec-survivor-basketball-2027/`
- Add the same GitHub Pages URL to the allowed redirect URLs.

This is required for the password-reset flow used by the site.

## 3. Create the commissioner login

Create an auth user for the commissioner in the new Supabase project. Do not put the password in GitHub or this file.

After the user exists, add its UUID to:

`public.admins(user_id)`

The commissioner UI is protected by database authorization, not by the email string shown in browser code.

## 4. Add the backend Supabase secret to GitHub Actions

The browser uses the public `sb_publishable_...` key already stored in `app-config.js`.

The score-updater requires a modern Supabase **secret key**. Secret keys must never be committed.

In Supabase:

**Project Settings → API Keys → Secret keys**

Copy/create the backend secret key.

In GitHub:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

Create:

- Name: `SUPABASE_SECRET_KEY`
- Value: the `sb_secret_...` key from Supabase

The scheduled score workflow sends the secret on the `apikey` header only.

## 5. Week 1 stays closed until launch

Week 1 is intentionally seeded with:

- Opens: NULL
- Locks: Saturday, January 2, 2027 at 10:59 AM Central

The commissioner can set the opening timestamp from the site's Commissioner panel when the pool is ready for signups.

Do not open Week 1 until visual QA, auth testing, and commissioner testing are complete.

## 6. Normal weekly windows

Weeks 2–10 are seeded to:

- Open Monday at 5:00 AM Central
- Lock Tuesday at 5:59 PM Central

If a Tuesday game is moved to 5:30 PM Central, use the Commissioner panel to change that week's lock to 5:29 PM Central.

## 7. Score automation

`.github/workflows/update-scores.yml` runs the ESPN sync during Tuesday/Wednesday and Saturday/Sunday game windows.

The workbook/Supabase schedule remains authoritative for survivor-week membership. ESPN supplies:

- exact tip time when published;
- scores;
- final status;
- winner.

Midweek workbook rows may match an ESPN event on either Tuesday or Wednesday.

## 8. Before merging the build branch to main

Verify all of the following:

- GitHub validation workflow is green.
- GitHub Pages preview loads successfully.
- Grid shows 10 weeks.
- Week popup shows separate Midweek and Saturday sections.
- Week 1 shows all 16 teams eligible.
- Bye weeks correctly remove teams that lack a midweek game.
- Signup produces an immediate session and submits a Week 1 pick.
- Picks remain hidden from other users before lock.
- Team reuse is rejected.
- 2–0 displays green.
- 1–1 displays yellow and adds a strike.
- 0–2 displays red + strike-through and eliminates.
- A player with two prior strikes who loses midweek is immediately OUT while the pick remains yellow until Saturday.
- Third-strike 1–1 finishes yellow + strike-through.
- A temporary lone survivor on Tuesday is NOT declared champion before the whole week finishes.
- Commissioner can change a weekly lock time.
- Commissioner can edit/delete picks.
- Password reset returns to the GitHub Pages site.
- Score sync works with the GitHub secret.

Only after this checklist passes should `build/sec-basketball-2027` be merged to `main`.
