---
name: linkedin-pass
description: Brings the user's LinkedIn profile in line with their resume and keeps it that way. The first time, it audits the profile and drafts a headline, About section, role descriptions and skills in the user's own voice. After that, it updates only what has changed. The user approves every change; it is applied in a browser while they watch when one is available, and by paste when not. Use when the user asks to fix, update, check, rewrite or sync their LinkedIn profile, or asks whether their LinkedIn matches their resume.
---

# LinkedIn pass

Recruiters check LinkedIn against the resume, so the two should agree, and stay agreed as the user's stories change. Draft the changes; the user approves each one. Then either you make the edit in a browser while they watch, or they paste it in.

## Before you start

Read `career/resume-base.md`, `career/resume-story-bank.md`, `career/resume-voice-profile.md` and `career/search-criteria.md` (or project documents with those names). If the voice profile is not approved yet, say that this works best after they have told you about their best work and how they write, and offer to do that first. If they want LinkedIn now anyway, go ahead with what exists.

Then read `career/linkedin-profile-log.md` if it exists:

- **It does not exist:** this is the first pass. Follow "First pass".
- **It exists:** follow "Keeping it in sync".

## Can you open a browser here?

Before anything else, work out how changes will reach LinkedIn, and tell the user. Never leave them guessing about what you can do.

Look at the tools you actually have. A browser tool is one that can open a web page, read it, click and type, in a browser where the user is signed in to their own accounts. Desktop apps often have one; a terminal usually does not.

- **You have a browser tool.** Say so, and offer it: "I can open LinkedIn in a browser here and make the changes while you watch. You approve each one before I save it. Or I can give you the text to paste in yourself. Which would you like?" Use the browser only if they say yes.
- **You have no browser tool.** Say so plainly, and say what happens instead: "I can't open a browser from here, so I'll give you each piece of text and you paste it into LinkedIn. It takes about ten minutes." If they are in a terminal, add that the desktop app can do the clicking for them if they would rather, and that pasting works just as well.
- **You are not sure.** Try one harmless step: open the LinkedIn home page. If it works, you have one. If it fails, say it did not work and switch to pasting.

### Rules for using the browser

- The user signs in themselves. Never ask for, type or store a password or a security code. If LinkedIn shows a sign-in page, a security check or a "verify it's you" step, stop and ask the user to complete it.
- Only while the user is present. Never edit the profile in an unattended or scheduled run.
- Read first. Open their profile and read it, so they do not have to copy and paste it.
- One change at a time: show before and after, wait for a yes, make the edit, then read the page back and confirm it saved as approved.
- If LinkedIn offers to share an edit with their network, turn that off before saving.
- Edit the profile only. No posts, comments, reactions, connection requests, messages, follows or settings changes.
- Do not delete anything LinkedIn says cannot be undone (a skill with endorsements, a role, a recommendation) without telling the user exactly what will be lost and getting a second yes.

### When the browser does not work

Say what happened in plain words and move on. Do not retry more than twice, and never go quiet.

- Not signed in: "LinkedIn is asking you to sign in. Can you do that in the browser window? I'll wait."
- A field will not accept the text, or the page looks different from what you expected: "LinkedIn isn't letting me change that one. Here is the text; could you paste it in yourself?" Then carry on with the next change.
- The browser stops responding or the tool errors: "I've lost the browser. I'll give you the rest as text to paste." Finish the job that way.

Whatever happens, the user ends the sitting knowing which changes are on LinkedIn and which are still theirs to paste. Record both in the log.

## The record

Keep everything in `career/linkedin-profile-log.md`, in this shape:

```
# LinkedIn profile

Last synced: <date, or "never">

## Profile as agreed
The text the user approved, section by section: headline, About, each role, skills (top five first).

## Waiting on you
Approved changes the user has not yet said they put on LinkedIn. One per line.

## Changed since last sync
Facts that changed after the last sync and may affect the profile. Other skills add lines here.

## History
date | what changed | the user's decision
```

"Profile as agreed" is what LinkedIn should say. It is not proof of what LinkedIn does say: only the user can confirm that.

## First pass

1. **Get the current profile.** If you are using the browser, open their profile and read it yourself. Otherwise ask the user to share it, and say exactly how: "Open your LinkedIn profile, select everything on the page, copy it and paste it here. Or use More, then Save to PDF, and drop the file in." If they have no LinkedIn profile, offer to draft one from scratch.
2. **Audit.** Compare it with the resume. Tell the user, in plain words, the two or three things that matter most: mismatched titles, dates or employers first, then weak or empty sections. Where the profile and resume disagree, ask which is right, one at a time. If the resume was wrong, correct the base resume too.
3. **Draft, in the user's voice,** one section at a time:
   - a headline that says what they do and for whom, with the kinds of jobs they are targeting
   - an About section that opens with the kind of problem they fix, in the first person
   - a short description for each recent role: what was wrong, what they did, what changed, with the real numbers
   - one or two plain lines for older roles
4. **Skills.** Propose which to add, which to remove, and the top five to pin, based on the jobs they want. Note that LinkedIn only offers its own skill names, so the nearest match is fine.
5. **Review, one change at a time.** Show before and after. The user says yes, no, or how they would put it. Use their wording when they give it. Save each approved section under "Profile as agreed".
6. **Apply or hand over.** If you are using the browser, make each approved change, confirm it saved, and tell the user as each one lands. List under "Waiting on you" only what could not be applied. Otherwise give the approved text in the order LinkedIn asks for it, and say how to apply it: "On your profile, tap the pencil next to that section, paste this in, and save. If LinkedIn asks to share the change with your network, turn that off." List each section under "Waiting on you".
7. **Close.** Set "Last synced" to today, clear "Changed since last sync", and add a History line.

## Keeping it in sync

1. **Deal with "Waiting on you" first**, if it has anything. With the browser, offer to apply those now. Without it, ask: "Last time I gave you a new About section. Did you get a chance to put it on LinkedIn?" Remove what they confirm. Keep what they have not done, and offer the text again.
2. **Work through "Changed since last sync".** For each line, find the part of "Profile as agreed" it affects. If nothing on the profile depends on it, drop the line without bothering the user. Otherwise draft the new wording for only that part and show before and after.
3. **Also check for drift** if the list is empty but the user asked for a check: compare "Profile as agreed" with the current resume, stories and target jobs, and raise only real differences.
4. **Approve, hand over and close** as in steps 5 to 7 above.

If nothing needs changing, say so in one line. Do not rewrite a profile that already matches.

## Limits

- Talk in plain words. Assume the user has never used an AI assistant for work: no jargon, no file names, no commands to type, one question at a time with an example answer, and "I don't know" is acceptable.
- Every change reaches LinkedIn one of two ways: the user pastes it in, or you make it in a browser while they watch, after they said yes to using the browser and yes to that change. Say at the start which way it will be.
- Keep "notify network" off for edits.
- Do not post, connect with or message anyone on the user's behalf.
- Do not add a public "looking for work" line or turn on a public "open to work" badge unless asked. Some users are searching quietly.
- Never invent a fact. Everything comes from the resume, the story bank or the user.
- Apply the anyone test to every line: if it could sit unchanged on a stranger's profile, add the detail that makes it this person's or cut it. Decline requests to exaggerate, and offer a true, stronger fact.
- When you finish, end with one line telling the user they can say "what's next?" any time to see where things stand.
