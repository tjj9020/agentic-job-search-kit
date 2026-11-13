---
name: career-setup
description: One-time setup for an AI-assisted job search. Saves the user's resume as a fact source, interviews them for search criteria, builds a story bank of accomplishments, and builds a voice profile of how they write. Use when the user wants to set up their job search, build a story bank, capture their writing style, or says "continue the story bank" or "continue career setup".
---

# Career setup

Build the four documents every other skill in this kit depends on. This takes about two hours of the user's time across three phases: about 20 minutes for the first, and the rest for the story bank and voice profile. The user can stop at any point; when they return, read the documents that exist and resume at the first unfinished phase.

## Where the documents live

Keep all documents in a `career/` folder in the working directory. If there is no file system, keep them as project documents or files with the same names. Read them at the start of every session. Save after every few answers so nothing is lost.

| Document | Holds |
| --- | --- |
| `resume-base.md` | The user's current resume, extracted word for word. The source of facts. |
| `search-criteria.md` | Candidate profile, hard filters, scoring preferences, deal-breakers |
| `resume-story-bank.md` | Each accomplishment as situation, behavior, impact, with proof and the user's own words |
| `resume-voice-profile.md` | How the user writes: rules, words, approved examples |

These documents hold the user's resume and pay expectations. If the working directory is a git repository, add `career/` to `.gitignore` before saving anything, and tell the user you did. Never commit or publish these files unless the user asks.

## Rules for every phase

- Facts come only from the user or their documents. If you don't know, ask.
- A blank field means unknown. Never fill it yourself.
- Mark anything unconfirmed as an open question instead of smoothing it over.
- Ask one to three questions per turn. Push back on vague answers.
- Be direct. Say where the resume is weak.

## Before Phase 1: import what already exists

If the user says they already have a story bank, a voice profile or similar notes from another tool, ask for the files or their location once. Copy them into `career/` under the names above, convert them to the formats in this skill without changing any fact, and list what is missing against each phase. Then start at the first phase that is not complete. Do not re-interview the user for anything an imported document already answers.

## Phase 1: Resume and search criteria

Keep this phase to about 20 minutes. Its job is to get the user to a working job search, not to fix the resume.

1. **Save the resume.** Ask for the current resume if it is not attached. Extract its text exactly and save it as `resume-base.md`. Do not rewrite, improve or reorder anything, and add nothing to the file except the source file name and the date at the top.
2. **Audit it quietly.** Find every claim with no number or no before-and-after, any date gaps, overlaps or inconsistencies, and anything a skeptical hiring manager would ask the user to prove. Save the full list under "Open questions" in `resume-story-bank.md`, grouped by role, creating the file if needed. Do not ask these now. Tell the user only: the three weakest spots in one line each, how many questions were saved, and that Phase 2 works through them one story at a time. If a date or title looks wrong, ask about that now, since the search criteria depend on it.
3. **Interview for search criteria.** Cover:
   - target titles and levels, including stretch and adjacent roles
   - location: cities, remote, hybrid, travel limits
   - compensation floor (base and total) and what they would trade for it
   - industries and company stages wanted, and ones to skip
   - what they want more of, and what they refuse to do again
   - culture: three or four things that must be true, and how they would recognize them
   - deal-breakers that reject a role immediately
   - how recent a posting must be
4. **Save `search-criteria.md`** with: a 150-word candidate profile (facts from the resume only), hard filters, scoring preferences, and deal-breakers. Revise until the user approves it.
5. **Offer the fast path.** Phase 1 takes about 20 minutes and is all `job-scout` needs. Tell the user they can start the daily search now and come back for Phases 2 and 3, which `tailor-resume` and `interview-prep` depend on. If they want to keep going, continue.

## Phase 2: Story bank

Ask the user to attach anything that documents their work: performance reviews, promotion cases, project write-ups, proposals, dashboards.

Save `resume-story-bank.md`. Use this format for every story:

```
### Short story name
Role / employer / dates:
Situation: what was broken, missing or at risk, in concrete terms
Behavior: what the user personally did and decided, including options rejected
Impact: the result, with numbers and before-and-after where they exist
Proof level: hard number, estimate, or qualitative
Skills / tags: the kinds of job requirements this story proves
Candidate's own words: phrases they actually said or wrote, quoted exactly
```

How to run the interview:

1. Seed one story per resume bullet and from any attached documents. Leave unknown fields blank. Attach each open question saved in Phase 1 to its story, and ask it when you reach that story.
2. Interview one story at a time, starting with the stories most relevant to the target roles.
3. For each story, dig for: what was actually broken before they started, the decision that was theirs and not the team's, what they chose not to do and why, the number, and who would vouch for it.
4. When the user describes something in a vivid or plain way, save the exact phrase under "Candidate's own words". Those phrases feed the voice profile.
5. Confirm every number back before saving it. Record a range or a guess as an estimate.
6. Where a resume claim and an answer disagree, flag it and ask which is right.

After the resume stories, look for gaps. Ask for a story on each of these if none exists, adapted to the user's field and level: a failure and what changed after, winning budget or headcount, saying no to something, growing someone into a bigger role, a hard trade-off between speed and quality, and a result achieved through influence without authority.

End the document with three sections: "Open questions" (numbered), "Story gaps", and "Tailored versions" (empty for now).

## Phase 3: Voice profile

Ask for three to five writing samples the user wrote themselves. Older documents from before they used AI are the best source.

Save `resume-voice-profile.md`. Read the "Candidate's own words" lines in the story bank first.

1. **Check the samples.** For each sample, ask whether the user wrote it alone or with AI help. Exclude anything AI-assisted as a voice source; its facts are still usable. List the sources kept and excluded.
2. **Find the rules.** Write 8 to 12 observed rules about how the user writes, each with a quoted example from their own text. Look at: how they open, where they put numbers, whether they name specific systems or abstract them, how they show judgment, verb choice, adjectives, sentence length, how they credit a team, and how candid they are about limits. Describe what they do, not what good writing is.
3. **Style picks.** Take one real accomplishment and write it in pairs, one pair at a time, asking which sounds like them: plain verbs vs. elevated verbs; situation first vs. result first; dry and factual vs. warmer and more personal; a summary that opens with the problem they solve vs. one that opens with their title. Record each pick.
4. **Talk it out.** Ask the user to describe two or three accomplishments the way they would tell a peer, typed or dictated without polishing. Add phrases worth keeping to a "Candidate's phrases" list.
5. **Words.** Start a banned list with common resume filler: spearheaded, leveraged, orchestrated, championed, synergy, robust, seamless, cutting-edge, passionate, results-driven, proven track record, transformative, innovative. Ask what else they never say, and what words they do use. The test for any word: would they say it out loud to a peer?
6. **Gold examples.** Write six resume bullets and one summary from the story bank. The user approves, edits or rejects each. Save the approved ones as "Gold examples". Study the edits and update the rules to match.
7. **Notes on the current resume.** Say plainly where the base resume does not sound like the user and what makes it read as templated, such as every bullet having the same shape and length.

Give the profile a version number and a status line. It is not final until the user approves it. From then on, whenever the user edits a line you wrote, update the profile.

## When a phase ends

Say in one line what was saved. Then tell the user what it unlocked and what comes next: after Phase 1, the daily job scout; after Phase 3, tailored resumes and interview prep. If the `job-search` skill is available, call the Skill tool with "job-search" so the user sees their status board.
