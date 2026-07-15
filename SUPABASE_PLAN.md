# Kronos Tracker — Supabase Backend Plan & Execution

The complete Supabase PostgreSQL database schema is now available in `supabase/schema.sql`.

## 1. Quick Setup Steps

1. Log into [Supabase Dashboard](https://supabase.com).
2. Create a new project named `kronos-tracker`.
3. Open the **SQL Editor** from the left navigation bar.
4. Copy and paste the entire contents of `supabase/schema.sql`.
5. Click **Run** to generate all 13 database tables, indexes, automatic triggers, and strict Row Level Security (RLS) policies.

---

## 2. Database Schema Summary (13 Tables)

1. `profiles` – Aspirant settings, mode, and theme preferences.
2. `goals` – Core mission targets, deadlines, and risk assessment.
3. `milestones` – Monthly exam roadmap milestones.
4. `weekly_targets` – 7-day quota target blocks.
5. `tasks` – Daily missions indexed by IST Date ID (`YYYY-MM-DD`).
6. `study_sessions` – Timed focus sessions logged via stopwatch/Pomodoro.
7. `daily_scores` – Aggregated daily history & subject minute splits.
8. `streaks` – Consecutive success counter & records.
9. `reviews` – End-of-day reflection notes.
10. `jee_chapters` – Master syllabus progress and revision flow.
11. `mock_tests` – Exam marks, accuracy, and subject breakdowns.
12. `mistakes` – Conceptual, calculation, and silly mistake error log.
13. `backlog_items` – Missed task rollover recovery backlog.

---

## 3. Vercel Environment Variables

In your Vercel Project Settings under **Environment Variables**, add these two keys:

| Environment Variable Key | Value Source |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Settings $\rightarrow$ API $\rightarrow$ Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings $\rightarrow$ API $\rightarrow$ Project API Key (`anon` / `public`) |

---

## 4. Security & Isolation

- **Row Level Security (RLS):** Enabled across all 13 tables.
- **Authorization Rule:** `auth.uid() = user_id` enforces complete isolation between aspirants.
- **Auto-Profile Trigger:** `on_auth_user_created` creates a profile row whenever a new user registers via Supabase Auth.
