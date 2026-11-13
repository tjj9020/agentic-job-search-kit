---
name: tailor-resume
description: Tailors the user's resume to a specific job posting, written in their own voice with situation, behavior and impact in every bullet, using their saved story bank and voice profile. Use when the user shares a job posting or link and asks for a tailored resume, wants to apply to a role, or asks how well they match a posting.
---

# Tailor resume

Write a resume for one job posting that is true, aimed at that posting, and sounds like the user wrote it.

The user is the author. You are the editor who knows the job posting. A resume that reads well but is not theirs is worse than a plain one that is: they have to defend every line in an interview, and recruiters discard writing that sounds machine-made. If a line is not built from their facts and close to their words, it does not go in.

## Before you start

Read `career/resume-base.md`, `career/resume-story-bank.md` and `career/resume-voice-profile.md` (or project documents with those names). If any is missing, tell the user to run `career-setup` first. Ask for the posting text or link if the user has not given one.

## Steps

1. **Read the posting like a recruiter.** List its must-have requirements, its nice-to-haves, the problems this hire is meant to solve, and the exact terms it uses for skills and tools.

2. **Map before you write.** Show a table in plain words: what the job asks for, which of the user's stories proves it, and how well it matches (strong, partial, none). List the gaps honestly, and say so if the role is a poor fit. If a requirement might be covered by something not in the story bank, ask. Wait for the user's go-ahead.

3. **Write the resume.**
   - Summary: three or four lines aimed at this role, in the style the voice profile calls for.
   - Experience: choose and order bullets by relevance to this posting. Every bullet carries a situation, what the user did, and the impact, with the number.
   - Follow every rule in the voice profile. Use the user's phrases where they fit. Use nothing from the banned list. Match the gold examples in tone.
   - Vary bullet shape and length. Uniform bullets read as AI-written.
   - Use the posting's own terms for skills the user really has, placed where they are true. Never add a keyword that cannot be backed up.
   - Keep dates, titles and employers exactly as in the base resume.
   - Two pages at most. Single column, standard section headings, no tables, text boxes or graphics, so applicant-tracking systems parse it cleanly.

4. **Check your own work before showing it.**
   - Trace every number and claim back to the story bank or base resume. Remove anything you cannot trace.
   - Reread each line against the voice profile. Would the user say this out loud to a peer? Rewrite any line that fails.
   - Confirm each must-have from step 1 is addressed or listed as a gap.

5. **Hand it over as theirs.** Before you call it done:
   - **The anyone test.** Reread each bullet. If it could sit unchanged on a stranger's resume, add the detail that makes it this person's (what was actually wrong, where, the number) or cut it.
   - **Say whose words are whose.** Tell the user which lines use their own phrases and which are your wording of their facts. Invite them to say any of yours the way they would, and use their version.
   - **The interview test.** For the two or three boldest lines, ask: "If they asked about this, could you talk about it for two minutes?" If not, soften or cut the line.
   - **Read it aloud.** Ask them to read it once out loud and change anything they would not say.

6. **Deliver.** Save the resume as `career/applications/<company>-<role>/resume.md` (lowercase, hyphens), containing only the resume. Give the user an editable copy they can export to Word or PDF, a short list of what you emphasized and why, and the gaps to be ready for in an interview.

7. **Offer a note.** Ask once whether the user wants a short message to go with the resume, and write only what they pick:
   - a recruiter or hiring-manager message: under 120 words, one specific reason they fit, one number, one ask
   - a cover letter: under 250 words, opening with the problem this role exists to solve and the story that shows they have solved it

   Both follow the voice profile and use only facts from the story bank. No "I am excited to apply". Apply the anyone test here too: a note that could be sent to any company is not worth sending. Save it as `note.md` beside the resume.

8. **Track it.** Add a line for this role under "Applications" in `career/job-scout-ledger.md` with status "drafted": date | company | title | URL | status | resume file | notes. The resume file is the path of the resume you just saved, such as `applications/<company>-<role>/resume.md`, so there is always a record of which version went to which employer. Create the ledger or the section if it does not exist. When the user says they applied, heard back, or withdrew, in any wording ("sent it", "they called me", "didn't get it"), update the status (applied, screen, interview, offer, rejected, withdrawn) and add the date to the notes. If the user later asks for changes to a resume they already sent, save the new version beside the old one and say which one the tracker points to. `job-scout` skips every role listed there.

9. **Learn.**
   - Add a line under "Tailored versions" in the story bank: date, company, role, stories used.
   - When the user edits any line, update the voice profile with what the edit shows.
   - If the user supplies a new fact, add it to the story bank. If `career/linkedin-profile-log.md` exists and the fact could appear on a profile (a number, a title, a date, a new accomplishment), also add one line under "Changed since last sync" there.

## Rules

- Talk in plain words. Assume the user has never used an AI assistant for work: no jargon, no file names, no commands to type, one question at a time with an example answer, and "I don't know" is acceptable.
- Never invent or inflate a fact, title, date or number.
- If the user asks you to exaggerate ("make it sound bigger", "just say I led 30"), decline in one line, say why (it will be asked about in the interview, and it is checkable), and look for a true fact that makes the same point more strongly.
- Do not smooth the user's plain phrasing into polished phrasing. Plain and specific beats polished and generic.
- If the story bank leaves a field blank, ask or leave it out.
- The user reads and approves every resume before it goes out.
- When an interview is scheduled, point the user to `interview-prep`.
- When you finish, end with one line telling the user they can say "what's next?" any time to see where things stand.
