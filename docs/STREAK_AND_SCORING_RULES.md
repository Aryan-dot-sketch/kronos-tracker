# Kronos Tracker — Streak and Scoring Rules

## Successful Day Rule

A day is successful when:

1. Weighted completion score is at least the configured threshold.
2. All critical tasks are completed.

Default threshold:

```text
70%
```

## Task Weights

| Priority | Weight |
|---|---:|
| Critical | 5 |
| High | 3 |
| Medium | 2 |
| Low | 1 |

## Completion Score

```text
completed task weight / total task weight × 100
```

## Time Score

```text
actual focused minutes / planned daily minutes × 100
```

Capped at 100%.

## Focus Score

Current MVP formula:

```text
completion score × 0.55 + time score × 0.25 + critical-task bonus
```

Critical-task bonus:

```text
20 points if all critical tasks are complete
```

## Streak Types

### Current MVP

- Daily streak
- Longest streak
- Subject streaks
- Comeback message after weak day

### Future

- Perfect day streak
- Time streak
- Planned rest day protection
- Advanced recovery streak

## Streak Break

A streak breaks when an IST day ends without meeting the successful day rule.

## Missed Day Recovery

Missed tasks do not disappear. They are moved to a recovery backlog and can be moved, split, or skipped.

