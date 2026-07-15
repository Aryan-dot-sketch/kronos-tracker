# Kronos Tracker — IST Time Engine

## Core Rule

All day counting, streaks, completion records, graphs, resets, and countdowns must use Indian Standard Time.

## Timezone

```text
Asia/Kolkata
```

## Kronos Day ID

Every day is stored as an IST day ID:

```text
YYYY-MM-DD
```

Example:

```text
2026-07-15
```

## Default Day Boundary

- Start: `12:00:00 AM IST`
- End: `11:59:59 PM IST`

## Reset Countdown

The app displays:

```text
Today closes in Xh Ym
```

This countdown points to the next IST midnight.

## Timestamp Storage

- Human-visible day grouping: IST day ID
- Exact events: ISO timestamp

Examples:

```text
dateId: 2026-07-15
completedAt: 2026-07-15T15:40:20.000Z
```

The timestamp is converted to IST for display.

## Missed Task Detection

If a task remains incomplete after its IST date passes, it becomes a missed/recovery task and can be:

- Moved to today
- Split into smaller tasks
- Skipped

## Future Student Study Day Mode

Future option:

```text
Study day ends at 2:30 AM IST
```

This is not enabled as the default because strict IST mode is better for clean streaks and discipline.

