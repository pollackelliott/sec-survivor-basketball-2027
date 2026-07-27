# Survivor

A configurable survivor pool application supporting multiple
conferences, sports, and seasons.

The project is designed around a reusable engine that powers independent
survivor pools through configuration rather than duplicated code.

Current supported configurations include:

-   SEC Football
-   Big Ten Football
-   SEC Basketball
-   Big Ten Basketball

Each deployment supplies its own:

-   Conference
-   Sport
-   Season
-   Ruleset
-   Schedule
-   Branding
-   Backend configuration

while sharing the same rendering engine, player model, and survivor
logic.

------------------------------------------------------------------------

## Why This Project Exists

Survivor began as a single SEC Football application built for one
specific league. As additional pools---including Big Ten Football and
SEC Basketball---were planned, it became clear that maintaining separate
repositories would require duplicating nearly every feature, bug fix,
and architectural improvement.

Rather than continuing to copy and modify the same application each
season, this project represents an ongoing refactor toward a single
configurable survivor platform. The goal is to make each pool a
configuration of the same application instead of an independent
codebase.

From a software engineering perspective, the project focuses on reducing
duplication, separating business rules from presentation, and designing
extensible architecture that can support new conferences, sports, and
rule sets with minimal code changes.

------------------------------------------------------------------------

## Design Goals

-   One codebase for every survivor pool
-   Configuration over duplication
-   Mobile-first interface
-   Server-side enforcement of pool rules
-   Conference-agnostic architecture
-   Extensible rulesets for different sports

------------------------------------------------------------------------

## Current Architecture

``` text
Configuration
        │
        ▼
Data Access
        │
        ▼
Survivor Engine
        │
        ▼
Player Evaluation
        │
        ▼
Presentation
        │
        ▼
UI
```

------------------------------------------------------------------------

## Planned Configuration Layers

``` text
POOL_CONFIG
│
├── APP_CONFIG
├── CONFERENCE_CONFIG
├── RULESET
└── SEASON_CONFIG
```

This separation keeps permanent concepts (conference membership, sport
rules, branding) independent from season-specific data such as
schedules, deadlines, and backend configuration.

------------------------------------------------------------------------

## Roadmap

-   [x] Config-driven branding
-   [x] Config-driven rules page
-   [x] Configurable conference profiles
-   [ ] Configurable rulesets
-   [ ] Generic team-week evaluation
-   [ ] Generic player evaluation
-   [ ] Multiple deployment profiles
-   [ ] Reconnect Supabase backend
-   [ ] Production deployments

------------------------------------------------------------------------

## Long-Term Vision

The long-term objective is a reusable survivor engine capable of
powering multiple independent deployments from a shared codebase. Each
deployment should be selectable through configuration alone, allowing
the same application to serve different conferences, sports, and seasons
without modifying rendering or business logic.

Ultimately, changing from one pool to another should be as simple as
selecting a different configuration profile.
