# Kronos Tracker — Supabase Backend Plan

The current MVP stores data in browser localStorage. Supabase will be added in a later phase.

## Future Supabase Tables

- `profiles`
- `goals`
- `tasks`
- `study_sessions`
- `daily_scores`
- `streaks`
- `reviews`
- `jee_chapters`
- `mock_tests`
- `mistakes`
- `settings`

## Backend Priorities

1. Auth and user profile
2. Goal sync
3. Daily checklist sync
4. Study sessions sync
5. Streak and score persistence
6. JEE tracker data
7. Mock test data
8. Review history
9. Row Level Security policies
10. Vercel deployment environment setup

## Important Rule

All persisted dates should use IST day IDs such as `2026-07-15`, while timestamps should be stored in ISO format.
