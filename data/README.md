# 2027 SEC Basketball schedule input

The commissioner's workbook is **2027 SEC Basketball Schedule Grid.xlsx**.

The uploaded workbook uses sheet **SEC** and this layout:

- Row 1: survivor-week headers.
- Row 2: date labels.
- Column A: the 16 SEC schools.
- Week 1 has one column: Saturday, January 2, 2027.
- Weeks 2–10 each have two columns: a midweek date label and a Saturday date label.
- A midweek date shown as Tuesday represents the midweek slot; an SEC game may actually be Tuesday or Wednesday.
- A blank midweek cell is that team's one midweek bye and makes that team ineligible for that survivor week.
- Opponent text beginning with `at ` means the listed SEC team is away. Opponent text without `at ` means the listed SEC team is home.

The importer must validate reciprocal conference matchups and must never silently invent a missing matchup.

The original XLSX should be stored in this `data/` folder before the season initializer is run.


## Preserved normalized schedule

Because the original Excel workbook is a binary attachment rather than a normal text file, the repository also stores `data/normalized-schedule.json` as a durable reconstruction copy of the 2027 survivor schedule loaded into Supabase.

The source workbook used for this build was:

- Filename: `2027 SEC Basketball Schedule Grid.xlsx`
- SHA-256: `f85cf6ad9fe0fedb4db5956f88aa8546e6f490a95a96f89cc5d79b2dbc37412b`

If a future workbook with the same filename is supplied, compare its SHA-256 before assuming it is the same source file.
