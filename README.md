# Agentic Job Search Kit

Four skills that give your AI assistant a daily job search and a resume writer that sounds like you.

You spend about two hours up front telling it what you have done and how you write. After that, it searches for roles every day, tells you why each one fits, and writes a resume tailored to any posting, in your voice, using only facts you confirmed.

## What is in the kit

| Skill | What it does | When you use it |
| --- | --- | --- |
| [`career-setup`](skills/career-setup/SKILL.md) | Saves your resume, interviews you for search criteria, builds your story bank and voice profile | Once, at the start |
| [`job-scout`](skills/job-scout/SKILL.md) | Searches job boards, verifies postings, scores each role out of 100, researches the best few, sends one report | Daily, on a schedule or on demand |
| [`tailor-resume`](skills/tailor-resume/SKILL.md) | Maps a posting to your stories and writes a resume for it in your voice | Every time you apply |
| [`linkedin-pass`](skills/linkedin-pass/SKILL.md) | Brings your LinkedIn profile in line with your resume | Optional |

The skills share five small documents, kept in a `career/` folder or in your project's documents:

| Document | Holds |
| --- | --- |
| `resume-base.md` | Your current resume, word for word. The source of facts. |
| `search-criteria.md` | Target roles, location, pay floor, culture criteria, deal-breakers |
| `resume-story-bank.md` | Each accomplishment as situation, behavior, impact, with proof and your own words |
| `resume-voice-profile.md` | How you write: rules, preferred and banned words, examples you approved |
| `job-scout-ledger.md` | Roles already evaluated, plus your feedback to steer the search |

## What you need

- An AI assistant with web search and somewhere to keep files between chats (a project, a workspace or a folder).
- Your current resume.
- Three to five things you wrote yourself without AI help: emails, proposals, reviews, announcements.

## Install

**If your tool supports Agent Skills** (Claude, Claude Code, Cursor, Codex, GitHub Copilot and others that read `SKILL.md`): copy the four folders under `skills/` into your tool's skills location. Check your tool's documentation for where that is and how to turn skills on. Then say "set up my job search".

**If it does not, or you are not sure:** open a skill's `SKILL.md`, copy everything below the top block between the `---` lines, and paste it as your first message in a new chat. Each one works as a plain prompt. Use one project or workspace for all of them so the documents carry over.

## Order

1. `career-setup`. Three phases: resume and criteria, story bank, voice profile. You can stop and resume.
2. `job-scout`. Ask it to run every morning if your tool has scheduled tasks. If not, run it when you want a report.
3. `tailor-resume`. Paste a posting or a link.
4. `linkedin-pass`, if you want it.

## Keeping it sharp

- **Steer the scout.** Add a line under "Feedback from me" in the ledger ("skip agencies", "applied to X"). The next run obeys it.
- **Edit the resume lines you don't like.** Each edit teaches the voice profile. After three or four tailored resumes, first drafts need little change.
- **Answer the open questions.** The story bank lists what it could not confirm. Every answer becomes a stronger bullet.
- **Add wins as they happen**, while the numbers are fresh.
- **Never give it AI-written samples as your voice.** It will learn the AI's habits and hand them back to you.
- **Read every resume before it goes out.** The skills forbid invented facts, but you are the one signing it.

## Three rules built into every skill

1. The AI never invents a fact.
2. A blank stays blank until you fill it.
3. Nothing AI-written is used as a sample of your voice.

## License

MIT. See [LICENSE](LICENSE).
