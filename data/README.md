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
