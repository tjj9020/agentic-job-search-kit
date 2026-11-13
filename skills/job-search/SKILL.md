---
name: job-search
description: The single entry point to the job search kit. Checks where the user is (setup, daily search, applications, interviews), shows a short status board, recommends one next step and takes them there. Use when the user says "job search", asks what to do next, wants to start or continue their job search, or is unsure which skill they need.
---

# Job search

This is the front door. The user should never have to remember the other skills or work out where they left off. Each time: read the state, show the board, recommend one next step, then go and do it.

## 1. Read the state

Look for the documents in `career/` in the working directory, or as project documents with the same names. Read whichever exist. Do not ask the user what they have done; find out.

| Document | Done when |
| --- | --- |
| `resume-base.md` | it exists |
| `search-criteria.md` | it exists and says the user approved it |
| `resume-story-bank.md` | every role on the resume has at least one story with a situation, a behavior and an impact |
| `resume-voice-profile.md` | its status line says approved |
| `job-scout-ledger.md` | it exists (the scout has run at least once) |

From the ledger, also read the "Applications" section: how many are active, the status of each, and whether any has sat at "applied" for more than 14 days. If the tool lists scheduled tasks, check whether a daily scout is scheduled.

If none of the documents exist, ask once whether the user already has a story bank, voice profile or similar notes from another tool. If they do, `career-setup` imports them.

## 2. Show the board

Always the same shape, so the user learns to read it at a glance. Use plain names, not file names. Keep it to this:

```
Your job search

Setup
  [x] Resume saved
  [x] Search criteria
  [ ] Story bank        4 of 7 stories complete, 6 open questions
  [ ] Voice profile     not started

Running
  Daily scout           on, last report today
  Applications          3 active: 1 interview, 2 applied (1 quiet for 16 days)

Next: finish your story bank (about 40 minutes). It unlocks tailored resumes.
```

Mark a line `[x]` only when it meets the "done when" test above. Show the "Running" block only once the search criteria exist.

## 3. Recommend one next step

Pick the first rule that applies. State it as the "Next:" line with a rough time, then offer up to three alternatives as a numbered list. The user answers with a number or in their own words.

1. An interview is scheduled and no brief exists for it: **prepare for that interview**.
2. No resume saved or no search criteria: **start setup** (about 20 minutes to the first milestone).
3. Criteria done and the scout has never run: **run the job scout now**, and offer to schedule it daily.
4. Story bank not done: **continue the story bank**. Say how many stories are left.
5. Voice profile not approved: **build the voice profile**.
6. An application has been quiet for more than 14 days: **draft a follow-up**.
7. Everything is set up: ask what they want today, and list: see new roles, tailor a resume to a posting, prepare for an interview, update LinkedIn.

If the user arrived with something specific (a posting link, "I have an interview Thursday", "what's new today"), skip the recommendation and go straight to it. If it needs a document they don't have yet, say which one, how long it takes, and offer the shortest path.

## 4. Go there

Call the Skill tool with the matching skill. Do not describe the skill to the user or ask them to run it.

| Step | Skill |
| --- | --- |
| Setup, story bank, voice profile, importing existing documents | `career-setup` |
| New roles, scheduling the daily search | `job-scout` |
| A resume, recruiter note or cover letter for a posting | `tailor-resume` |
| An upcoming interview | `interview-prep` |
| LinkedIn profile | `linkedin-pass` |

A follow-up on a quiet application needs no other skill: draft a three-line message in the user's voice from the voice profile, and update the application's notes in the ledger when they send it.

## 5. Close the loop

When a step finishes or the user stops, say in one line what changed, then give the new "Next:" line. Show the full board again only if they ask or if several things changed.

## Rules

- One recommendation, not a menu of everything. The alternatives are there for when the user disagrees.
- Never show more than the board and the next step before the user has chosen. Details belong to the skill that does the work.
- Report state from the documents, not from memory of earlier chats.
