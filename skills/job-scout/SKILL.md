---
name: job-scout
description: Runs an agentic job search. Searches job boards, filters against the user's criteria, verifies postings are live, scores each role out of 100, researches the best few, and delivers one fit report while tracking evaluated roles in a ledger. Use when the user asks to find jobs, asks what is new today, wants a daily or morning job report, gives feedback on the jobs they were shown ("skip sales jobs", "more remote"), or says they applied to one.
---

# Job scout

Find new roles that fit the user, research only the best few, and deliver one report. Built as a funnel to keep cost down: follow the caps.

## Before the first run

Requires `career/search-criteria.md` and `career/resume-base.md` (or project documents with those names). Phase 1 of `career-setup` creates both; the story bank and voice profile are not needed here. If they are missing, tell the user to run `career-setup` first.

Create `career/job-scout-ledger.md` if it does not exist:

```
# Job Scout Ledger

## Feedback from me
(Add lines any time, such as "skip fintech", "more early-stage companies" or "applied to X". Every run obeys them.)

## Applications
Format: date | company | title | URL | status | resume file | notes
Status is one of: drafted, applied, screen, interview, offer, rejected, withdrawn

## Evaluated roles
Format: date | company | title | URL | score/100 | status (reported, or skipped: reason)
```

If the ledger exists but has no "Applications" section, add one above "Evaluated roles".

## Feedback in plain words

When the user says something like "skip sales jobs", "more remote roles" or "I applied to that one", write it into the ledger yourself: preferences under "Feedback from me", applications under "Applications". Confirm in one line. Never ask the user to edit the ledger.

## Scheduling

If the tool has scheduled tasks, offer to run this every morning at a time the user chooses. A scheduled run usually starts with no memory of earlier chats, so its instructions must stand alone: embed the user's 150-word candidate profile, hard filters and scoring preferences from `search-criteria.md` directly in them, along with the steps below. Show the user the instructions and the defaults before creating the task, then run it once as a test.

If the tool has no scheduler, run this whenever the user asks.

A scheduled run is unattended: ask no questions, make reasonable calls and note them in the report.

## The run

1. **Discover.** Read the ledger, including the feedback section. Run up to 10 searches across the major job boards, public applicant-tracking boards (Greenhouse, Lever, Ashby, Workday) and local sources for the user's area, using their target titles.
2. **Triage.** Drop anything already in the ledger, including every role under "Applications", and anything that fails a hard filter: location, level, pay floor when posted, deal-breakers, feedback.
3. **Verify.** Confirm each remaining posting is live and recent, preferably on the employer's own careers page. Aggregator copies are often stale. If it cannot be confirmed, skip it and record why.
4. **Score** each verified role out of 100. Use the weights in `search-criteria.md` if the user set them; otherwise:

   | Criterion | Points |
   | --- | --- |
   | Role and scope fit | 25 |
   | Skills and domain fit | 20 |
   | Compensation | 15 |
   | Culture fit against the user's criteria | 15 |
   | Company trajectory and growth for the user | 15 |
   | Location and logistics | 10 |

5. **Research.** Only for the top 3 to 5 roles scoring 70 or higher: the business, how it has grown, culture evidence, pay and benefits.
6. **Report.** One report, best role first. Open with a one-line count of roles found, verified and reported. For each finalist:
   - title, company, score, link to the posting, location with any caveats
   - the business in two sentences, and its growth in two sentences
   - the role: scope, team, reporting line, mandate
   - why the user fits: three bullets, each tying a specific achievement to a specific requirement in the posting
   - gaps or risks: one or two honest bullets
   - culture, with how strong the evidence is
   - pay and benefits, labeled "posted" or "estimate" with confidence
   - the six scores
   - next move: one concrete action

   End with "Also seen": up to five near misses, one line each with the reason, then a list of sources. If any application has sat at "applied" for more than 14 days, add one line listing them so the user can follow up. Where the tool can produce files, make the report a single self-contained HTML page that reads well on a phone, and notify the user when it is ready.
7. **Update the ledger.** Add one line per role evaluated today and remove "Evaluated roles" lines older than 60 days. Leave the feedback and "Applications" sections untouched.

## Rules

- Talk in plain words. Assume the user has never used an AI assistant for work: no jargon, no file names, no commands to type, one question at a time with an example answer, and "I don't know" is acceptable.
- Every claim about a company or role must come from something retrieved during this run.
- Mark estimates as estimates. Never invent a posting, a salary or a culture claim.
- If nothing scores 70, say so and list the near misses. Do not pad the report.
- Paraphrase postings; do not copy them at length.
- When you finish, end with one line telling the user they can say "what's next?" any time to see where things stand. Skip this in an unattended scheduled run.
