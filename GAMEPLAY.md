# SEC Survivor Basketball 2027 — Gameplay Specification

This document is the canonical gameplay specification for the 2027 SEC men's basketball survivor pool.

## Season structure

- 10 survivor weeks.
- Each player selects exactly one SEC team per week.
- A player may select each SEC school at most once during the entire season.
- Only SEC conference games matter; there are no football-style nonconference, G5, or FCS restrictions.
- Week 1 is a special Saturday-only week on January 2, 2027.
- Weeks 2–10 normally contain one midweek SEC game per team (Tuesday or Wednesday) plus one Saturday SEC game.
- Each SEC team has exactly one week in Weeks 2–10 where it does not play a midweek game. That team is ineligible to be selected that week, like a football bye.

## Pick windows

### Week 1
- Signup and the Week 1 selection are the same flow.
- Signup/picks may open whenever the commissioner is ready.
- Week 1 locks and reveals at **10:59 AM Central on Saturday, January 2, 2027**.
- The first games begin at 11:00 AM Central.

### Weeks 2–10
- Picks open every Monday at **5:00 AM Central**.
- Picks normally lock and reveal every Tuesday at **5:59 PM Central**.
- The commissioner can override an individual week's lock time, e.g. to **5:29 PM** when a Tuesday game tips at 5:30 PM.
- Picks remain hidden from other players until the week's lock/reveal time.
- A player may change a pick freely until that week's lock.
- Failure to submit a pick by the lock time causes immediate elimination.

## Weekly result

### Week 1 special rule
There is no midweek game.

- Selected team wins Saturday: player survives cleanly; pick displays **green**; no strike.
- Selected team loses Saturday: player survives but receives **one strike**; pick displays **yellow**.
- No player can be eliminated by a game result in Week 1.

### Weeks 2–10
The selected team's two conference games determine the weekly result.

- **2–0:** clean survival; no strike; final pick display is **green**.
- **1–1:** player survives and receives **one strike**; final pick display is **yellow**.
- **0–2:** player is automatically eliminated; final pick display is **red with strike-through**.

## Strikes

- A 1–1 week adds one strike.
- Three strikes eliminate the player.
- Strike count should be derived from weekly results rather than maintained as an independent mutable counter.

### Immediate third-strike elimination
If a player enters a week with two strikes and the selected team loses its midweek game, the player is immediately eliminated on Tuesday/Wednesday because every possible final weekly result is eliminating:

- Saturday win -> 1–1 -> strike #3.
- Saturday loss -> 0–2 -> direct elimination.

The pick cell itself remains **yellow** while Saturday is pending, but should also receive **strike-through** to show that the player is already OUT. After Saturday:

- if the team wins, the cell remains yellow + strike-through;
- if the team loses, the cell becomes red + strike-through.

## In-progress display

For Weeks 2–10:

- Midweek win, Saturday pending: keep the team's normal team-color appearance. Do not turn green yet.
- Midweek loss, Saturday pending: turn the pick **yellow** immediately.
- If that midweek loss mathematically produces the player's third strike, also strike through the yellow pick and eliminate the player immediately.

## Elimination conditions

A player is eliminated at the earliest occurrence of:

1. missing the weekly pick deadline;
2. finishing a Week 2–10 selection 0–2;
3. reaching strike #3, including the mathematically certain third-strike condition after a midweek loss while already carrying two strikes.

## Pool-ending rule

Individual players may be eliminated before Saturday, but **the pool itself can end only after the entire survivor week has concluded**.

After all relevant games for the week are final:

- exactly one player remains -> that player wins the pool;
- zero players remain -> the pool ends with no winner;
- more than one remains -> proceed to the next week.

Never declare a winner based on a temporary midweek state.

Example: Bill and Tim are the only players alive entering a week, each with two strikes. Bill loses midweek and is immediately eliminated. Tim has not won yet. Tim must still survive the completed week; if Tim is also eliminated by Saturday, the pool ends with zero survivors.

## Cancellations and postponements

Rare weather/cancellation/postponement cases are handled manually by the commissioner on a case-by-case basis. The application should provide safe commissioner correction/override tools rather than inventing an automatic universal ruling.

## Visual semantics

- Normal team color: selection is still unresolved after a midweek win.
- Green: completed clean survival (2–0, or Week 1 Saturday win).
- Yellow: strike week / cannot finish 2–0.
- Yellow + strike-through: strike-result pick belonging to a player who is eliminated, especially strike #3.
- Red + strike-through: 0–2 elimination.
- Missed pick: clearly marked OUT / no pick, with elimination styling.

## Schedule source

The commissioner's Excel schedule grid is the authoritative survivor schedule definition. ESPN should be used to resolve/verify actual game metadata and results, not to silently redefine which games belong to each survivor week.
