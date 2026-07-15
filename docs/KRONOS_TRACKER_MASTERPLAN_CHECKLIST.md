# Kronos Tracker — Masterplan Checklist

> **Status file:** This is the living checklist for Kronos Tracker.  
> We will edit this file after every completed step by changing `[ ]` to `[x]`, adding notes, and updating decisions.

---

## Project Identity

- **Product Name:** Kronos Tracker
- **Core Idea:** A premium IST-based daily goal, checklist, time, streak, and performance tracker.
- **Primary Use Case:** JEE Mains preparation and serious daily discipline.
- **Secondary Use Cases:** NEET, UPSC, boards, fitness, coding, career goals, personal goals.
- **Design Style:** Cream, classic, premium, calm, elegant, focused.
- **Most Important Rule:** All counting, streaks, deadlines, reset logic, graphs, and time-based analytics must be based on **IST — Indian Standard Time**.

---

## Tagline Options

- [x] Command your time. Compound your streak.
- [x] Your daily mission control for serious goals.
- [x] Track time. Build discipline. Reach the target.
- [x] Time, targets, streaks — mastered.
- [x] A premium command center for your goals.

---

# Global Product Rules

## IST Time Rules

- [x] A live IST clock must be visible inside the app.
- [x] Every task completion must store completion time in IST.
- [x] Every day must be identified using an IST-based date ID such as `2026-07-15`.
- [x] Default Kronos day starts at `12:00 AM IST`.
- [x] Default Kronos day ends at `11:59:59 PM IST`.
- [x] Streak calculation must use IST day boundaries.
- [x] Daily checklist reset must happen according to IST.
- [x] Exam countdown must be calculated using IST.
- [x] Daily mission closing timer must show time remaining before IST reset.
- [x] Graphs and heatmaps must use IST dates.
- [x] Future optional mode: Student Study Day cutoff, such as `2:30 AM IST`.

## Streak Rules

- [x] Define what counts as a successful day.
- [x] Recommended rule: all critical tasks completed plus at least 70% weighted completion.
- [x] Daily streak must increase only after a successful IST day.
- [x] Perfect day streak should require 100% task completion.
- [x] Time streak should track minimum study hours completed daily.
- [x] Subject streak should track Physics, Chemistry, and Maths consistency.
- [x] Comeback streak should motivate recovery after a missed day.

## Scoring Rules

- [x] Daily completion score should use weighted task completion.
- [x] Time score should compare planned time vs actual focused time.
- [x] Priority score should check if important tasks were completed.
- [x] Subject balance score should prevent over-focusing on one subject.
- [x] Focus score should combine completion, time, priority, consistency, and review.
- [x] Risk level should indicate whether user is on track, slightly behind, or in danger.

---

# Phase 0 — Product Clarity and Rules

> **Purpose:** Finalize how Kronos Tracker should behave before design or development.

## 0.1 Core Purpose

- [x] Decide if Kronos Tracker is universal or only JEE-focused.
- [x] Recommended: Universal goal tracker with a powerful JEE mode.
- [x] Define primary user persona.
- [x] Define secondary user personas.
- [x] Write the one-sentence product promise.
- [x] Define what makes Kronos Tracker different from a normal to-do app.

## 0.2 Goal System Rules

- [x] Define main target structure.
- [x] Define monthly milestone structure.
- [x] Define weekly target structure.
- [x] Define daily mission structure.
- [x] Define task structure.
- [x] Define study session structure.
- [x] Decide if one user can have multiple active goals.
- [x] Decide if one goal should be marked as primary.

## 0.3 IST Time Logic

- [x] Confirm strict IST mode as default.
- [x] Define daily reset time.
- [x] Define countdown-to-reset behavior.
- [x] Define exam deadline timestamp format.
- [x] Define completion timestamp behavior.
- [x] Define how missed days are detected.
- [x] Define future Student Study Day mode.

## 0.4 Streak Logic

- [x] Define daily streak rule.
- [x] Define perfect day streak rule.
- [x] Define time streak rule.
- [x] Define subject streak rule.
- [x] Define comeback streak rule.
- [x] Define streak break behavior.
- [x] Define longest streak tracking.

## 0.5 MVP Scope

- [x] Finalize MVP must-have features.
- [x] Finalize features to avoid in MVP.
- [x] Define first version success criteria.
- [x] Define what should be manually editable by the user.

## Phase 0 Deliverables

- [x] Final product rules document.
- [x] Streak logic document.
- [x] IST time logic document.
- [x] Goal hierarchy document.
- [x] MVP feature list.

---

# Phase 1 — Brand and UI/UX Design

> **Purpose:** Make Kronos Tracker look and feel premium before coding.

## 1.1 Brand Identity

- [x] Finalize brand personality.
- [x] Finalize tagline.
- [x] Finalize logo direction.
- [x] Finalize icon direction.
- [x] Finalize visual mood.
- [x] Define tone of voice for messages and empty states.

## 1.2 Color Palette

- [x] Background: warm cream `#F7F1E8`.
- [x] Card background: soft ivory `#FFFDF8`.
- [x] Primary text: deep charcoal `#1E1E1E`.
- [x] Secondary text: warm grey `#6F6A60`.
- [x] Premium accent: muted gold `#B88A44`.
- [x] Success: elegant green `#4F7D5A`.
- [x] Warning: amber `#C8872B`.
- [x] Danger: soft red `#B85C5C`.
- [x] Dark mode background: rich black-brown `#15120E`.
- [x] Define chart colors.
- [x] Define heatmap colors.
- [x] Define priority colors.

## 1.3 Typography

- [x] Select premium heading font style.
- [x] Select clean body font style.
- [x] Select numeric/stat font style.
- [x] Define font sizes.
- [x] Define font weights.
- [x] Define spacing between headings, cards, and sections.

## 1.4 Design System Components

- [x] Button component.
- [x] Icon button component.
- [x] Input field component.
- [x] Select/dropdown component.
- [x] Checkbox component with premium animation.
- [x] Task card component.
- [x] Goal card component.
- [x] Stat card component.
- [x] Progress ring component.
- [x] Streak badge component.
- [x] Timer card component.
- [x] Graph card component.
- [x] Calendar day component.
- [x] Heatmap square component.
- [x] Modal component.
- [x] Empty state component.
- [x] Toast/notification component.

## 1.5 Wireframes

- [x] Dashboard page wireframe.
- [x] Today page wireframe.
- [x] Main Goal page wireframe.
- [x] Calendar page wireframe.
- [x] Analytics page wireframe.
- [x] JEE Tracker page wireframe.
- [x] Review page wireframe.
- [x] Settings page wireframe.
- [x] Mobile layout wireframes.

## 1.6 High-Fidelity UI Screens

- [x] Dashboard high-fidelity design.
- [x] Today high-fidelity design.
- [x] Goal high-fidelity design.
- [x] Analytics high-fidelity design.
- [x] Calendar high-fidelity design.
- [x] JEE Tracker high-fidelity design.
- [x] Review high-fidelity design.
- [x] Settings high-fidelity design.
- [x] Mobile Today screen design.
- [x] Mobile Dashboard screen design.

## Phase 1 Deliverables

- [x] Brand identity direction.
- [x] Final color palette.
- [x] Typography system.
- [x] Component design system.
- [x] Wireframes.
- [x] High-fidelity UI screens.

---

# Phase 2 — Product Architecture

> **Purpose:** Define how the app should be structured internally before development.

## 2.1 User Data Blueprint

- [x] User name.
- [x] Email/login field for future.
- [x] Timezone preference.
- [x] Default IST mode.
- [x] Study day cutoff setting.
- [x] Theme setting.
- [x] Notification preferences.
- [x] Backup/export preferences.

## 2.2 Goal Data Blueprint

- [x] Goal ID.
- [x] Goal name.
- [x] Goal type.
- [x] Deadline date.
- [x] Deadline time in IST.
- [x] Target score/percentile/result.
- [x] Start date.
- [x] Current level.
- [x] Progress percentage.
- [x] Subjects/categories.
- [x] Milestones.
- [x] Risk level.
- [x] Notes.

## 2.3 Task Data Blueprint

- [x] Task ID.
- [x] Task title.
- [x] Description.
- [x] IST date ID.
- [x] Priority.
- [x] Difficulty.
- [x] Category.
- [x] Subject.
- [x] Chapter.
- [x] Estimated time.
- [x] Actual time.
- [x] Status.
- [x] Completion timestamp in IST.
- [x] Repeat rule.
- [x] Notes.
- [x] Rollover status.
- [x] Missed reason.

## 2.4 Study Session Data Blueprint

- [x] Session ID.
- [x] Linked task ID.
- [x] Linked goal ID.
- [x] Subject.
- [x] Chapter.
- [x] Start time in IST.
- [x] End time in IST.
- [x] Duration.
- [x] Focus quality rating.
- [x] Distraction note.
- [x] Session summary.

## 2.5 Streak Data Blueprint

- [x] Current streak.
- [x] Longest streak.
- [x] Perfect day streak.
- [x] Subject streaks.
- [x] Time streak.
- [x] Comeback streak.
- [x] Last successful day.
- [x] Missed days.
- [x] Frozen/protected days for future.

## 2.6 Analytics Data Blueprint

- [x] Daily completion score.
- [x] Time score.
- [x] Priority score.
- [x] Subject balance score.
- [x] Focus score.
- [x] Weekly average.
- [x] Monthly average.
- [x] Heatmap intensity.
- [x] Mock score trend.
- [x] Best study window.
- [x] Weakest study window.

## 2.7 Mock Test Data Blueprint

- [x] Mock ID.
- [x] Mock date in IST.
- [x] Total score.
- [x] Physics score.
- [x] Chemistry score.
- [x] Mathematics score.
- [x] Attempted questions.
- [x] Correct questions.
- [x] Wrong questions.
- [x] Accuracy.
- [x] Silly mistakes.
- [x] Concept errors.
- [x] Time-pressure errors.
- [x] Weak chapters.
- [x] Main lesson learned.

## 2.8 Chapter Tracker Blueprint

- [x] Subject.
- [x] Chapter name.
- [x] Status.
- [x] Theory progress.
- [x] Practice progress.
- [x] PYQ progress.
- [x] Revision stage.
- [x] Strength level.
- [x] Last revised date.
- [x] Next revision date.

## Phase 2 Deliverables

- [x] User data blueprint.
- [x] Goal data blueprint.
- [x] Task data blueprint.
- [x] Study session blueprint.
- [x] Streak blueprint.
- [x] Analytics blueprint.
- [x] JEE data blueprint.

---

# Phase 3 — MVP Version 1

> **Purpose:** Build the first usable version later when coding starts.

## 3.1 App Shell

- [x] Create main app layout.
- [x] Add left sidebar.
- [x] Add top bar.
- [x] Add main content area.
- [x] Add right insight panel.
- [x] Add responsive mobile layout.
- [x] Add base theme styling.

## 3.2 Live IST Clock

- [x] Show current IST date.
- [x] Show current IST time.
- [x] Show seconds optionally.
- [x] Show countdown to daily reset.
- [x] Show current Kronos day ID.
- [x] Ensure all displayed dates use IST.

## 3.3 Main Goal Setup

- [x] Add goal creation form.
- [x] Add goal name.
- [x] Add goal type.
- [x] Add deadline.
- [x] Add target score/percentile.
- [x] Add daily study time target.
- [x] Add subjects/categories.
- [x] Save goal locally in MVP.
- [x] Display goal on dashboard.

## 3.4 Daily Checklist

- [x] Add task creation.
- [x] Add task editing.
- [x] Add task deletion.
- [x] Add checkbox completion.
- [x] Add task priority.
- [x] Add task difficulty.
- [x] Add estimated time.
- [x] Add task category.
- [x] Add optional subject.
- [x] Store completion time in IST.
- [x] Filter tasks by status.
- [x] Filter tasks by priority.

## 3.5 Basic Streak

- [x] Calculate successful day.
- [x] Show current streak.
- [x] Show longest streak.
- [x] Detect missed day.
- [x] Show streak badge.
- [x] Update streak based on IST.

## 3.6 Basic Graphs

- [x] Daily completion graph.
- [x] Weekly completion graph.
- [x] Simple calendar heatmap.
- [x] Study time progress card.
- [x] Goal countdown card.

## 3.7 Local Data Storage

- [x] Store goals locally.
- [x] Store tasks locally.
- [x] Store daily scores locally.
- [x] Store streak data locally.
- [x] Store settings locally.
- [x] Add reset demo data option.

## Phase 3 Deliverables

- [x] Working MVP shell.
- [x] Premium dashboard.
- [x] Live IST clock.
- [x] Main goal setup.
- [x] Daily checklist.
- [x] Basic streak.
- [x] Basic graphs.
- [x] Local data persistence.

---

# Phase 4 — Advanced Daily Execution

> **Purpose:** Make the daily workflow more useful, realistic, and powerful.

## 4.1 Task Categories

- [x] Study task.
- [x] Habit task.
- [x] Revision task.
- [x] Mock test task.
- [x] Practice task.
- [x] Health task.
- [x] Personal task.
- [x] Custom category.

## 4.2 Timer System

- [x] Stopwatch timer.
- [x] Pomodoro timer.
- [x] Task-linked timer.
- [x] Start/pause/resume timer.
- [x] Save study sessions.
- [x] Compare planned vs actual time.
- [x] Show total focused time today.

## 4.3 Rollover System

- [x] Detect missed tasks after IST day closes.
- [x] Move task to tomorrow.
- [x] Split missed task into smaller tasks.
- [x] Add missed task to backlog.
- [x] Mark task as skipped.
- [x] Add missed reason.
- [x] Show unresolved backlog.

## 4.4 End-of-Day Review

- [x] What went well today?
- [x] What went wrong today?
- [x] What distracted me?
- [x] What did I learn?
- [x] Tomorrow’s first priority.
- [x] Energy level.
- [x] Mood rating.
- [x] Sleep target.
- [x] Review completion timestamp in IST.

## Phase 4 Deliverables

- [x] Advanced task categories.
- [x] Timer system.
- [x] Study session logs.
- [x] Rollover system.
- [x] End-of-day review.

---

# Phase 5 — Analytics Expansion

> **Purpose:** Make Kronos Tracker feel like a serious performance dashboard.

## 5.1 Completion Analytics

- [x] Daily trend.
- [x] Weekly trend.
- [x] Monthly trend.
- [x] Best day.
- [x] Worst day.
- [x] Average completion percentage.
- [x] Critical task completion rate.

## 5.2 Time Analytics

- [x] Planned vs actual study time.
- [x] Average daily study time.
- [ ] Best study hours.
- [ ] Weakest study hours.
- [x] Subject-wise study time.
- [ ] Study time by task type.
- [ ] Early vs late completion trend.

## 5.3 Streak Analytics

- [x] Current daily streak.
- [x] Longest daily streak.
- [x] Perfect day streak.
- [x] Subject streaks.
- [x] Time streak.
- [x] Comeback streak.
- [x] Streak calendar.

## 5.4 Heatmap Expansion

- [x] Daily intensity based on score.
- [x] Perfect day marker.
- [x] Missed day marker.
- [ ] Rest day marker for future.
- [x] Click day to view details.
- [x] Month and year navigation.

## 5.5 Insight Cards

- [x] Weekly performance insight.
- [x] Subject imbalance insight.
- [ ] Weak task type insight.
- [ ] Productivity time insight.
- [x] Missed review insight.
- [x] Streak risk insight.
- [x] Improvement insight.

## Phase 5 Deliverables

- [x] Full analytics page.
- [x] Better graphs.
- [x] Expanded heatmap.
- [x] Insight cards.
- [ ] Time pattern tracking.

---

# Phase 6 — JEE Mode

> **Purpose:** Make Kronos Tracker extremely useful for JEE preparation.

## 6.1 JEE Subject Dashboard

- [x] Physics dashboard.
- [x] Chemistry dashboard.
- [x] Mathematics dashboard.
- [x] Subject progress percentage.
- [x] Subject streak.
- [x] Subject study time.
- [x] Subject weak areas.
- [x] Subject recent tasks.

## 6.2 Chapter Tracker

- [x] Add Physics chapter list.
- [x] Add Chemistry chapter list.
- [x] Add Mathematics chapter list.
- [x] Add chapter status.
- [x] Add theory progress.
- [x] Add practice progress.
- [x] Add PYQ progress.
- [x] Add revision stage.
- [x] Mark chapter weak/strong/mastered.

## 6.3 Revision System

- [x] Revision 1 tracking.
- [x] Revision 2 tracking.
- [x] Revision 3 tracking.
- [x] Final revision tracking.
- [x] Formula revision tracking.
- [x] PYQ revision tracking.
- [x] Next revision reminder.

## 6.4 Mock Test Tracker

- [x] Add mock result entry.
- [x] Add total score.
- [x] Add Physics score.
- [x] Add Chemistry score.
- [x] Add Mathematics score.
- [x] Add attempted questions.
- [x] Add correct questions.
- [x] Add wrong questions.
- [x] Add accuracy.
- [x] Add silly mistakes.
- [x] Add time management note.
- [x] Add weak chapters.
- [x] Show mock score trend.
- [x] Show subject score trend.
- [x] Show accuracy trend.

## 6.5 Mistake Notebook

- [x] Concept error category.
- [x] Calculation error category.
- [x] Silly mistake category.
- [x] Formula forgotten category.
- [x] Time pressure category.
- [x] Misread question category.
- [x] Guesswork error category.
- [x] Link mistake to subject.
- [x] Link mistake to chapter.
- [x] Show repeated mistake patterns.

## Phase 6 Deliverables

- [x] JEE dashboard.
- [x] Subject tracker.
- [x] Chapter tracker.
- [x] Revision planner.
- [x] Mock test tracker.
- [x] Mistake notebook.

---

# Phase 7 — Premium UX Polish

> **Purpose:** Make the site feel like a best-in-class premium product.

## 7.1 Animation Polish

- [x] Smooth card transitions.
- [x] Premium checkbox animation.
- [ ] Streak glow.
- [x] Progress ring animation.
- [x] Heatmap hover detail.
- [ ] Timer pulse animation.
- [x] Soft page transitions.
- [ ] Minimal milestone confetti.

## 7.2 Empty States

- [ ] Empty dashboard state.
- [x] Empty task list state.
- [x] Empty analytics state.
- [x] Empty mock tracker state.
- [x] Empty chapter tracker state.
- [x] Empty review state.

## 7.3 Dark Mode

- [x] Define dark mode palette.
- [x] Add dark dashboard.
- [x] Add dark cards.
- [x] Add dark charts.
- [x] Add dark heatmap.
- [x] Add dark checklist.
- [x] Ensure readability.

## 7.4 Mobile Optimization

- [x] Bottom navigation.
- [x] Quick task check.
- [x] Quick start timer.
- [x] Quick add task.
- [x] Mobile dashboard cards.
- [x] Mobile heatmap view.
- [x] Mobile review form.

## Phase 7 Deliverables

- [ ] Premium animations.
- [x] Premium empty states.
- [x] Dark mode.
- [x] Mobile optimization.
- [x] Luxury UI refinement.

---

# Phase 8 — Smart Planning and AI Layer

> **Purpose:** Personal coaching intelligence and automated scheduling algorithms.

## 8.1 AI Daily Planner

- [x] Read main goal.
- [x] Read deadline.
- [x] Read weak areas.
- [x] Read available hours.
- [x] Read previous performance.
- [x] Suggest today’s tasks.
- [x] Suggest priority order.
- [x] Suggest realistic study time blocks.

## 8.2 AI Weekly Review

- [x] Summarize completed tasks.
- [x] Summarize missed tasks.
- [x] Summarize study time.
- [x] Identify ignored subjects.
- [x] Identify weak chapters.
- [x] Suggest next week’s focus.

## 8.3 AI Recovery Plan

- [x] Detect 2–3 weak days.
- [x] Generate realistic recovery plan.
- [x] Avoid overload.
- [x] Prioritize critical tasks.
- [x] Split backlog.

## 8.4 AI Weakness Coach

- [x] Detect repeated mistakes.
- [x] Detect weak topics.
- [x] Detect poor accuracy areas.
- [x] Suggest targeted practice.
- [x] Suggest revision tasks.

## Phase 8 Deliverables

- [x] AI daily planner.
- [x] AI weekly review.
- [x] AI recovery plan.
- [x] AI weakness detection.

---

# Phase 9 — Accounts, Sync, and Backup

> **Purpose:** Make Kronos Tracker reliable for long-term use.

## 9.1 User Accounts

- [ ] Signup.
- [ ] Login.
- [ ] Profile.
- [ ] Forgot password.
- [ ] Account settings.

## 9.2 Cloud Sync

- [ ] Sync goals.
- [ ] Sync tasks.
- [ ] Sync streaks.
- [ ] Sync analytics.
- [ ] Sync settings.
- [ ] Multi-device support.

## 9.3 Backup and Export

- [ ] Export data as JSON.
- [ ] Export progress as PDF.
- [ ] Export tasks as CSV.
- [ ] Import backup.
- [ ] Backup history.

## 9.4 Privacy

- [ ] Private by default.
- [ ] Data deletion option.
- [ ] Clear privacy note.
- [ ] No public sharing unless user enables it.
- [ ] Secure storage planning.

## Phase 9 Deliverables

- [ ] User accounts.
- [ ] Cloud sync.
- [ ] Backup/export.
- [ ] Privacy controls.

---

# Phase 10 — Final Launch Version

> **Purpose:** Prepare Kronos Tracker as a polished product.

## 10.1 Final Testing

- [ ] Test IST clock accuracy.
- [ ] Test daily reset accuracy.
- [ ] Test streak accuracy.
- [ ] Test task completion.
- [ ] Test graph calculations.
- [ ] Test heatmap calculations.
- [ ] Test goal countdown.
- [ ] Test mobile layout.
- [ ] Test data saving.
- [ ] Test mock tracker.

## 10.2 Performance Optimization

- [ ] Fast initial loading.
- [ ] Smooth interactions.
- [ ] Lightweight charts.
- [ ] Optimized mobile performance.
- [ ] Avoid unnecessary clutter.

## 10.3 Landing Page

- [ ] Hero section.
- [ ] Product promise.
- [ ] Feature highlights.
- [ ] JEE use case section.
- [ ] Streak system section.
- [ ] Analytics section.
- [ ] Screenshots/mockups.
- [ ] Call to action.

## 10.4 Beta Launch

- [ ] Share with small group.
- [ ] Collect feedback on UI.
- [ ] Collect feedback on checklist.
- [ ] Collect feedback on JEE tracker.
- [ ] Collect feedback on analytics.
- [ ] Fix major issues.

## 10.5 Full Launch

- [ ] Final polish.
- [ ] Final copywriting.
- [ ] Final responsive testing.
- [ ] Launch.
- [ ] Track user feedback.

## Phase 10 Deliverables

- [ ] Fully tested app.
- [ ] Optimized performance.
- [ ] Landing page.
- [ ] Beta feedback completed.
- [ ] Final launch.

---

# MVP Must-Have Checklist

These are the features that exist in the working production system.

- [x] Premium dashboard.
- [x] Live IST clock.
- [x] Main goal setup & universal domain subject manager.
- [x] Deadline countdown ticker.
- [x] Daily checklist.
- [x] Task priority grouping.
- [x] Task estimated time.
- [x] Task completion timestamp in IST.
- [x] Completion percentage.
- [x] Basic streak & subject streaks.
- [x] Study time tracker.
- [x] Weekly graph.
- [x] Calendar heatmap.
- [x] End-of-day review.
- [x] Local data saving & Supabase cloud backend integration.
- [x] Mobile responsive layout.

---

# Page Checklist

## Dashboard Page

- [x] Live IST clock.
- [x] Today closes in timer.
- [x] Main mission card.
- [x] Exam countdown ticker down to seconds.
- [x] Current streak card.
- [x] Today’s completion card.
- [x] Study time card.
- [x] Checklist preview.
- [x] Weekly performance preview.
- [x] Calendar heatmap preview.
- [x] Weak area alert.
- [x] Quick add task button.

## Today Page

- [x] Full daily checklist.
- [x] Task filters and live search.
- [x] Priority grouping.
- [x] Subject grouping.
- [x] Study timer.
- [x] Completion percentage.
- [x] Time left today.
- [x] Rollover recovery backlog.

## Main Goal Page

- [x] Goal name.
- [x] Goal deadline date and time.
- [x] Days left.
- [x] Target score/percentile.
- [x] Current progress.
- [x] Universal subject/module manager.
- [x] Monthly milestones.
- [x] Weekly targets.
- [x] Risk level.
- [x] Strategy notes.

## Calendar Page

- [x] Month view.
- [x] Completed day markers.
- [x] Missed day markers.
- [x] Perfect day markers.
- [x] Score details modal on tile click.
- [x] Exam countdown display.

## Analytics Page

- [x] Daily completion graph.
- [x] Weekly performance graph.
- [x] Monthly performance graph.
- [x] Study hours graph.
- [x] Dynamic subject balance chart.
- [x] Streak metrics.
- [x] Heatmap.
- [x] Smart insight cards.
- [x] AI Smart Planner & Coaching Assistant suite.

## Syllabus & Domain Tracker Page

- [x] Subject/Module dashboard cards.
- [x] Master chapter/module tracker.
- [x] PYQ / Practice problem tracker.
- [x] Revision pipeline planner.
- [x] Mock test tracker.
- [x] Mistake notebook.

## Review Page

- [x] Daily reflection questions.
- [x] Completion summary.
- [x] Missed task summary.
- [x] Distraction log.
- [x] Energy rating.
- [x] Mood rating.
- [x] Tomorrow’s first priority.
- [x] Save review with IST timestamp.

## Settings Page

- [x] Profile settings.
- [x] Goal settings.
- [x] IST mode setting.
- [x] Future study day cutoff setting.
- [x] Theme setting.
- [x] Data export/import setting.
- [x] Clear data to start fresh.

---

# Edit Log

Use this section to record progress after each step.

| Date | Change | Status |
|---|---|---|
| 2026-07-15 | Created Kronos Tracker masterplan checklist. | Done |
| 2026-07-15 | Built first frontend MVP prototype in `kronos-tracker/` with premium UI, IST clock, checklist, streak, charts, timer, JEE tracker, review, local storage. | Done |
| 2026-07-15 | Phase Build Sprint 1: added task editing, filters, Kronos day ID, Pomodoro, rollover recovery, expanded review, analytics intelligence, JEE subject dashboard, revision planner, expanded mock tracker, and mistake notebook. | Done |
| 2026-07-15 | Phase Build Sprint 2: High-end typography stack (`Plus Jakarta Sans`, `Cormorant Garamond`, `JetBrains Mono`), classic gold/cream luxury UI, SVG vector icons, live ticking exam countdown, task search filter, interactive day inspection modal, milestones/weekly targets manager, JSON & CSV export/import suite, custom chapter addition, and mistake notebook deletion. | Done |
| 2026-07-15 | Phase Build Sprint 3: Universal domain customization (dynamic subject/module manager, no hardcoded JEE/PCM assumption, custom subject add/delete, dynamic donut/balance charts for any domain), clean onboarding canvas, full 13-table Supabase PostgreSQL schema, and Phase 8 AI Smart Planning & Coaching Suite. | Done |

---

# Next Step

Recommended next step:

- [ ] Create the exact screen-by-screen blueprint for Kronos Tracker.
- [ ] Start with the Dashboard page layout.
- [ ] Then define Today page.
- [ ] Then define Main Goal page.
- [ ] Then define Analytics page.
- [ ] Then define JEE Tracker page.
- [ ] Then define Calendar, Review, and Settings pages.
