# SEC Survivor Basketball 2027

A mobile-first survivor pool application for SEC men’s college basketball. Players select one eligible SEC team each week, and that selection applies to both of the team’s conference games during the survivor week.

The application is being adapted from the completed SEC Survivor Football platform, with basketball-specific scheduling, eligibility, strike tracking, elimination rules, and automated score ingestion.

> Development status: In progress. The application code and database schema are being prepared before a dedicated Supabase project becomes available.

---

## Technologies

### Backend and Data

* Supabase PostgreSQL
* Supabase Auth
* Row-Level Security
* PL/pgSQL stored procedures

### Automation

* GitHub Actions
* Python
* ESPN scoreboard data

### Front End

* JavaScript
* HTML
* CSS

### Deployment

* GitHub Pages

---

## Game Format

The survivor competition lasts 10 weeks during SEC conference play.

Each player:

* Selects one eligible SEC team per week
* Uses that selection for both of the team’s SEC games that week
* Cannot select the same team more than once during the season
* Receives a strike for a 1-1 week
* Is eliminated by an 0-2 week
* Is eliminated upon receiving a third total strike
* Is eliminated for failing to submit a pick before the deadline

Only teams playing the required number of SEC conference games during the survivor week are eligible.

---

## Week Structure

A standard survivor week runs from Monday through Sunday.

### Week 1

Week 1 runs from Monday, December 28, 2026, through Sunday, January 3, 2027.

Because SEC conference play contains only one qualifying game during that opening week:

* Teams with one SEC game are eligible
* A 1-0 result is safe
* An 0-1 result adds one strike
* No player can be eliminated based solely on the Week 1 game result
* The signup and pick deadline is Saturday, January 2, 2027, at 11:00 AM Central

### Weeks 2–10

For each standard week:

* Eligible teams must play exactly two SEC conference games
* A 2-0 result is safe
* A 1-1 result adds one strike
* An 0-2 result causes immediate elimination
* The standard pick deadline is Tuesday at 6:00 PM Central

Weekly deadlines will be stored in the database so the commissioner can adjust an individual week when necessary without changing application code.

---

## Eligibility Rules

A team is eligible only when it has the required number of SEC conference games within that Monday-through-Sunday survivor week.

For Weeks 2–10:

* Two SEC games: eligible
* One SEC game and one nonconference game: not eligible
* One SEC game only: not eligible
* No SEC games: not eligible

Each SEC team is expected to have one conference minibye during the season. A team on its minibye cannot be selected that week.

Eligibility will be enforced by the database rather than trusted solely to the browser.

---

## Elimination Logic

A player is eliminated when any of the following occurs:

* The selected team finishes 0-2 during a standard week
* The player accumulates three total strikes
* The player fails to submit a pick before the deadline

A player who enters a week with two strikes is eliminated immediately after the selected team loses its first game. Even if the team wins its second game and finishes 1-1, that result would create the player’s third strike.

Eliminated players cannot submit additional picks.

---

## Standings

Standings are ordered by:

1. Active players before eliminated players
2. Fewest strikes
3. Last name alphabetically
4. First name alphabetically

The standings will display each player’s weekly selections, game results, strike total, and elimination status.

---

## Planned Architecture

```text
ESPN Scoreboard Data
        │
        ▼
GitHub Actions
        │
        ▼
Supabase PostgreSQL
        │
        ▼
Server-Side Business Logic
        │
        ▼
JavaScript Front End
        │
        ▼
GitHub Pages
```

---

## Planned Database Structure

The basketball application will use its own dedicated Supabase project so that its users, authentication records, data, API credentials, and administrative settings remain completely separate from the football application.

Planned core entities include:

* Players
* Survivor weeks
* Games
* Weekly picks
* Team eligibility
* Strike history
* Commissioner settings
* Administrators

Season-wide and weekly configuration will be stored in database tables rather than scattered throughout the front-end code.

---

## Engineering Concepts Demonstrated

* Relational schema design
* Server-enforced business rules
* Authentication and session management
* Row-Level Security
* Stored procedures
* Scheduled data ingestion
* Idempotent database upserts
* Time-zone-aware deadlines
* Configurable season and weekly settings
* Client-side UX filtering backed by database enforcement
* Automated standings and elimination calculations

---

## Development Plan

1. Replace football branding and documentation
2. Create the basketball season configuration
3. Design the basketball-specific database schema
4. Convert the front end from 13 football weeks to 10 basketball weeks
5. Build team eligibility and strike logic
6. Adapt ESPN score ingestion for men’s college basketball
7. Configure GitHub Actions
8. Connect a dedicated Supabase project
9. Run preseason simulations and rule testing
10. Deploy the production application
