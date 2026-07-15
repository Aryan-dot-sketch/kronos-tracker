# Kronos Tracker — Product Specification

## Product Promise

Kronos Tracker is a premium IST-based mission control dashboard that helps serious students and goal-driven users convert daily time into measurable progress, streaks, analytics, and long-term target achievement.

## Positioning

Kronos Tracker is a universal goal tracker with a powerful JEE mode. It is not a basic to-do app. It combines:

- Goal planning
- Daily checklist execution
- IST time tracking
- Streaks
- Study sessions
- Performance analytics
- JEE-specific chapter, mock, revision, and mistake tracking

## Primary Persona

A serious JEE aspirant who needs a premium dashboard to track daily discipline, study time, weak topics, mocks, revision, and streaks.

## Secondary Personas

- NEET aspirant
- UPSC aspirant
- Board exam student
- Coding learner
- Fitness goal user
- Career goal user

## Goal Hierarchy

```text
Main Target
  ↓
Monthly Milestones
  ↓
Weekly Targets
  ↓
Daily Missions
  ↓
Tasks
  ↓
Study Sessions
```

## First Version Success Criteria

The MVP is successful if the user can:

1. Open a premium dashboard.
2. See live IST time and current Kronos day.
3. Create/edit a main goal.
4. Add/edit/complete/delete daily tasks.
5. Track study time.
6. See completion score and streak.
7. See graphs and heatmap.
8. Use basic JEE tracking.
9. Save end-of-day review.
10. Keep data in browser localStorage until Supabase is added.

## MVP Scope

### Included

- Dashboard
- Today page
- Goal page
- Calendar page
- Analytics page
- JEE tracker page
- Review page
- Settings page
- Local persistence

### Excluded for now

- Supabase backend
- Login/auth
- AI planner
- Cloud sync
- Notifications
- Mobile native app

