# Kronos Tracker

Premium IST-based goal, checklist, streak, time, and performance tracker.

## Current Build

This is the first working frontend MVP prototype.

### Included

- Premium cream/classic dashboard UI
- Live IST clock
- Daily reset countdown based on IST
- Main goal card and editable goal form
- JEE Mains countdown
- Daily checklist with task creation, completion, delete, priority, subject, difficulty, estimated time
- IST completion timestamps
- Streak and longest streak calculation
- Weighted completion score
- Study time score
- Focus score
- Focus timer and quick `+25m` logging
- Weekly graph
- Calendar heatmap
- Subject balance chart
- Analytics page
- JEE chapter tracker
- Mock test tracker
- End-of-day review
- Theme toggle
- Local browser storage
- Export/reset data controls

## Files

```text
kronos-tracker/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Notes

- No backend yet.
- No login yet.
- Data is stored in browser `localStorage`.
- All day IDs, streaks, reset countdowns, completion records, and display time are built around IST.
