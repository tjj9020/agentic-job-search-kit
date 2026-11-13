# Agentic Job Search Kit

A job-search helper you talk to in plain English. It looks for jobs that fit you every morning, writes a resume for each one in your own words, and gets you ready for the interview.

You don't need to know anything about AI. There are no commands to learn and no special way to phrase things. You say what you want, it asks you questions one at a time, and it remembers your answers.

![How it works: say "help me with my job search." First it gets to know you through your resume, a conversation and your writing. It remembers your resume, what you want, your stories, your voice and your tracker. Then you just ask for a job report, a tailored resume or interview prep, and it learns from your corrections.](docs/how-it-works.svg)

## It has to be yours

Everyone can generate a resume now, and hiring managers can tell. A page of polished lines that could describe anybody gets skipped, and if it gets you an interview, you are the one who has to explain it.

So this kit treats you as the author. It writes only from what you tell it. Every number comes from you. It asks you to say things your way and keeps your wording. Before it calls a resume done it checks, line by line:

- Could this line sit on a stranger's resume? If so, it adds the detail that makes it yours, or cuts it.
- Could you talk about this for two minutes if asked? If not, it goes.
- Would you say this out loud? If not, you change it.

Ask it to make something sound bigger than it was, and it will say no and look for something true that is stronger.

## What it's like

> **You:** Help me with my job search.
>
> **It:** Glad to. First I need your resume. Drag the file into this chat or paste the text. If you don't have one, tell me about your last job and we'll build from there.
>
> **You:** *(drops in resume)*
>
> **It:** Got it, saved exactly as written. We'll make it stronger together later. First, four quick questions so I can start looking for jobs. What kind of job do you want next? For example: "the same job at a bigger company" or "I want to move into management."

It keeps going like that. After your resume and four questions it knows enough to start sending you a job report each morning.

Want to see finished results first? The [worked example](examples/README.md) shows a made-up candidate's job report, tailored resume and interview brief.

## Get started

### 1. Add it to your AI app

**Claude desktop app** (no typing commands)

1. Open **Customize**, then **Plugins**.
2. Choose **Add marketplace**, then add from a repository.
3. Paste `https://github.com/tjj9020/agentic-job-search-kit` and press **Sync**.
4. Install **job-search-kit** from the list.

Menu names move around between versions of the app. If yours looks different, look for "Add marketplace" under Plugins.

**Claude Code** (in a terminal)

```bash
claude plugin marketplace add tjj9020/agentic-job-search-kit
claude plugin install job-search-kit@tjj9020
```

<details>
<summary><strong>Other AI tools</strong> (Codex, GitHub Copilot, Gemini, Cursor, ChatGPT and more)</summary>

**Codex**

```bash
codex plugin marketplace add tjj9020/agentic-job-search-kit
codex plugin add job-search-kit@tjj9020
```

**GitHub Copilot**

```bash
copilot plugin marketplace add tjj9020/agentic-job-search-kit
copilot plugin install job-search-kit@tjj9020
```

In VS Code, run **Chat: Install Plugin From Source** and enter `https://github.com/tjj9020/agentic-job-search-kit`.

**Gemini CLI**

```bash
gemini skills install https://github.com/tjj9020/agentic-job-search-kit.git --path skills
```

**Cursor, Windsurf and others**

```bash
npx skills@latest add tjj9020/agentic-job-search-kit
```

Take all six skills when it asks.

**ChatGPT, Grok, or any chat app without an installer**

Create a project, attach the six `SKILL.md` files from the [`skills/`](skills) folder, and say "Help me with my job search." Keep everything in that one project so it remembers you between chats.

Install it one way only. Installing it twice gives you two copies of everything.

</details>

### 2. Say "Help me with my job search"

That's it. Any wording works: "I need a new job," "where do I start," "I got laid off last week."

The first time, it will:

1. Ask for your resume. Drag it in, paste it, or just describe your work if you don't have one.
2. Ask what you want: what kind of job, where, the least you'd accept in pay, and anything you won't do.
3. Offer to send you a job report every morning. You are a few minutes in at this point.

Over the next sitting or two it asks about your best work and reads a few things you wrote yourself (emails, reports, anything written without AI help). That is how it learns to write a resume that sounds like you. You can stop any time and nothing is lost.

Each time you come back, it shows you where you are and suggests one next step:

```
Your job search

Getting to know you
  [x] Your resume
  [x] What you want
  [ ] Your stories      4 of 7 done, 6 questions left
  [ ] Your voice        not started

Running
  Daily job report      on, last one today
  Applications          3 active: 1 interview, 2 waiting (1 quiet for 16 days)
  LinkedIn              2 updates since you last changed it

Next: finish your stories (about 40 minutes). After that I can write resumes for specific jobs.
Say "yes" to continue, or tell me what you'd rather do.
```

### 3. Then just ask

| Say something like | What you get |
| --- | --- |
| "What's new today?" | The best three to five open jobs for you, why you fit each one, and what the pay looks like |
| "Tailor my resume to this job" (paste the link or the text) | A resume written for that job, plus a short note to the recruiter if you want one |
| "I applied to that one" | It keeps track, and reminds you if two weeks go by with no reply |
| "Which resume did I send them?" | Every resume is kept with the job it was written for, so you always know which version went where |
| "I have an interview Thursday" | The questions they are likely to ask, which of your stories answers each, and a one-page brief |
| "Skip sales jobs" or "more remote roles" | Tomorrow's report follows your feedback |
| "That doesn't sound like me" | It rewrites the line and writes more like you from then on |
| "Fix up my LinkedIn" | A headline, About section and job descriptions that match your resume and sound like you. You approve each change and paste it in yourself. |
| "Is my LinkedIn still up to date?" | It remembers what your profile should say and tells you what to change when your resume or stories change |
| "What's next?" | Where you are and the one thing worth doing now |

## Good to know

- **Rough answers are fine.** Type the way you talk. It will ask a follow-up if it needs more.
- **"I don't know" is a fine answer.** It will offer a few options or come back to it later.
- **It never makes things up.** If it doesn't have a fact, it asks you. Every number on your resume comes from something you told it.
- **It never applies for you** or messages anyone. You read everything and you send it. The same goes for LinkedIn: it drafts, you paste, and it never posts or connects for you.
- **Tell it when it's wrong.** Every correction makes the next draft better.
- **Your information is yours.** Your resume and pay expectations are saved in a folder called `career` on your computer, or in your project if you use a chat app. Don't post that folder anywhere public.

## Why it works this way

**Most AI resumes sound like AI.** They say "spearheaded" and "leveraged," and every line has the same shape. Recruiters spot it in seconds. This kit reads writing you did yourself, learns your habits, and keeps a list of words you would never say. Writing made with AI is left out, so it doesn't learn the wrong voice.

**Most AI tools make things up.** Asked to make you look good, they round numbers up and invent results, and you find out in the interview. This kit works only from your resume and what you tell it. When it doesn't know something, it writes down a question instead of guessing.

**Job sites are mostly noise.** Many listings are expired or the wrong level. This kit checks that each job is still open on the employer's own site, scores it against what you asked for, and tells you about the few worth your time. If nothing is good enough, it says so.

**Every application starts from zero.** Tailoring a resume takes an hour, so most people send the same one everywhere. This kit shows you how your experience matches the job, where the gaps are, and then writes the resume once you agree.

**Interviews catch people off guard.** This kit predicts the questions, matches each to a story you already told it, and helps you plan an honest answer for anything you're missing.

## For developers

<details>
<summary>Skills, files and how to change them</summary>

`job-search` is the entry point. It reads the state of the documents, shows the status board, recommends one next step and calls the right skill. Every skill is plain Markdown and can also be called by name.

| Skill | What it does |
| --- | --- |
| [`job-search`](skills/job-search/SKILL.md) | Entry point and router |
| [`career-setup`](skills/career-setup/SKILL.md) | Saves the resume, interviews for search criteria, builds the story bank and voice profile, imports existing documents |
| [`job-scout`](skills/job-scout/SKILL.md) | Searches, verifies, scores and researches roles, then sends one fit report |
| [`tailor-resume`](skills/tailor-resume/SKILL.md) | Maps a posting to stories, writes the resume and optional note, logs the application |
| [`interview-prep`](skills/interview-prep/SKILL.md) | Predicts questions, maps them to stories, plans gap answers, writes a brief |
| [`linkedin-pass`](skills/linkedin-pass/SKILL.md) | Aligns a LinkedIn profile with the resume, records the agreed text, and updates only what changed afterward. The user approves and applies every change. |

The skills share five documents in a `career/` folder (or the project's files):

| Document | Shown to the user as | Holds |
| --- | --- | --- |
| `resume-base.md` | Your resume | The resume, word for word. The source of facts. |
| `search-criteria.md` | What you want | Target roles, location, pay floor, culture criteria, deal-breakers |
| `resume-story-bank.md` | Your stories | Each accomplishment as situation, behavior, impact, with proof and the user's own words |
| `resume-voice-profile.md` | Your voice | Rules, preferred and banned words, approved examples |
| `job-scout-ledger.md` | Your tracker | Roles evaluated, applications and status, feedback |

`linkedin-profile-log.md` holds the agreed LinkedIn profile, changes waiting for the user to paste in, and facts that changed since the last sync.

Each job the user applies to also gets a folder, `career/applications/<company>-<role>/`, holding `resume.md` (the version sent), `note.md` (the recruiter note or cover letter, if any) and `brief.md` (the interview brief). The tracker's resume column points at that `resume.md`.

Plugin installs from a third-party marketplace do not auto-update by default in Claude Code. Run `claude plugin marketplace update tjj9020` to update.

Simulated end-to-end tests live in [`evals/`](evals/README.md): a model plays a first-time user from the first message to an interview brief, and the output is checked for invented facts, filler, jargon and correct application tracking. A [worked example](examples/README.md) shows every document and is checked on each pull request.

To change a skill or cut a release, see [CONTRIBUTING.md](CONTRIBUTING.md). Versions are in [CHANGELOG.md](CHANGELOG.md).

</details>

## License

MIT. See [LICENSE](LICENSE).
