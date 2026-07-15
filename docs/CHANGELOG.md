# Kronos Tracker — Changelog

This file records all planning, architecture, and implementation updates.

## 2026-07-15 — Full Premium Polish & Complete Features (Sprint 2)

- **Typography & Font System:** Integrated `Plus Jakarta Sans` for body/UI, `Cormorant Garamond` for editorial luxury serif headings/stat numbers, and `JetBrains Mono` for clocks and numeric tickers.
- **Embedded SVG System:** Replaced Unicode glyphs with vector SVG icons across navigation items, buttons, task checks, and search bars.
- **Goal Breakdown Architecture:** Implemented full CRUD for Monthly Milestones and Weekly Targets with interactive checkbox toggles.
- **Live Exam Ticker:** Upgraded countdown display to calculate exact remaining days, hours, minutes, and seconds in IST.
- **Day Inspection System:** Created custom `dayDetailDialog` modal for deep inspection of any date tile clicked on the heatmap or calendar.
- **Task Search Engine:** Added real-time search filtering across task titles, subjects, and notes on Today & Dashboard pages.
- **Data Export & Import Suite:** Added CSV export for Tasks and Mock Tests, alongside JSON state export and a JSON restore modal parser.
- **Syllabus Expansion:** Added custom chapter entry modal to JEE Tracker, with theory/practice/PYQ initial progress.
- **Mistake & Mock Controls:** Added deletion capabilities and expanded error category pattern counters in the Mistake Notebook.
