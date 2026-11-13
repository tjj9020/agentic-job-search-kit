# job-search-kit

## 0.6.0

### Minor Changes

- [#17](https://github.com/tjj9020/agentic-job-search-kit/pull/17) [`8683cac`](https://github.com/tjj9020/agentic-job-search-kit/commit/8683cac6d047dcc15a2b02054c71d00109979a25) Thanks [@tjj9020](https://github.com/tjj9020)! - Getting started is much shorter. After your resume, it asks four questions (what job, where, lowest pay, anything you won't take) and your job search is ready. The other questions come later, one at a time, tied to real jobs it shows you. It no longer opens with a critique of your resume, never asks two questions at once, and uses your own words for your work instead of trade terms you didn't use.

## 0.5.0

### Minor Changes

- [#12](https://github.com/tjj9020/agentic-job-search-kit/pull/12) [`2786e23`](https://github.com/tjj9020/agentic-job-search-kit/commit/2786e236f7514888d9ed8e5799918dcdbbf67036) Thanks [@tjj9020](https://github.com/tjj9020)! - Resumes now have to pass three tests before they are handed over: could this line sit on a stranger's resume, could you talk about it for two minutes, and would you say it out loud. The kit tells you which lines are your words and which are its wording, and it refuses requests to exaggerate. Tailored resumes, notes and interview briefs are saved in one folder per job. Added `evals/`: simulated first-time users that run the whole kit end to end, with checks for invented numbers, filler words and jargon.

### Patch Changes

- [#14](https://github.com/tjj9020/agentic-job-search-kit/pull/14) [`de1f4ab`](https://github.com/tjj9020/agentic-job-search-kit/commit/de1f4ab4ab7b4732fbc6b55dc218d2826798df85) Thanks [@tjj9020](https://github.com/tjj9020)! - Ask "which resume did I send them?" and it finds that job in your tracker and shows the exact version you sent, with the date and current status.

## 0.4.1

### Patch Changes

- [#8](https://github.com/tjj9020/agentic-job-search-kit/pull/8) [`1570377`](https://github.com/tjj9020/agentic-job-search-kit/commit/15703773669fcb73185057305fb06c46d9e271de) Thanks [@tjj9020](https://github.com/tjj9020)! - Prepared the repository for outside contributions: a security policy, contribution guide, issue and pull request templates, code owners, Dependabot, pinned workflow actions, and a check that rejects scripts or hidden text inside skills. No change to how the skills behave.

## 0.4.0

### Minor Changes

- [#6](https://github.com/tjj9020/agentic-job-search-kit/pull/6) [`dd959ab`](https://github.com/tjj9020/agentic-job-search-kit/commit/dd959ab971c00bc1f6d0e61e87d925db37128bfe) Thanks [@tjj9020](https://github.com/tjj9020)! - The kit now assumes no AI experience. Every skill talks in plain words, asks one question at a time with an example answer, accepts "I don't know", never asks you to type a command or edit a file, and builds a resume from conversation if you don't have one. Say "skip sales jobs" or "I applied to that one" and it updates your tracker itself. The README and diagram are rewritten around what you say, not which skill runs, and add install steps for the Claude desktop app.

## 0.3.0

### Minor Changes

- [#3](https://github.com/tjj9020/agentic-job-search-kit/pull/3) [`b5145db`](https://github.com/tjj9020/agentic-job-search-kit/commit/b5145dbf68a56f5bdf0cee64d3f1fc5d61ae5bdb) Thanks [@tjj9020](https://github.com/tjj9020)! - Added `interview-prep`, which predicts the questions for a specific role and maps each to a story from your story bank. `tailor-resume` now offers a short recruiter note or cover letter in your voice and records each application in the ledger, and `job-scout` skips roles you already applied to. `career-setup` now tells you the job scout is ready after the first 20 minutes. Added a worked example with a fictional candidate under `examples/`.

- [#4](https://github.com/tjj9020/agentic-job-search-kit/pull/4) [`9dd05bc`](https://github.com/tjj9020/agentic-job-search-kit/commit/9dd05bca0ccf99eedbc7aa9b486eb345599d3092) Thanks [@tjj9020](https://github.com/tjj9020)! - Added `job-search`, a single entry point. Run `/job-search` and it reads your documents, shows a short status board, recommends one next step and takes you there, so you never have to pick between the other skills. `career-setup` no longer opens with a full resume audit: it names the three weakest spots, saves the rest as open questions for the story bank, and imports a story bank or voice profile you already have.

## 0.2.0

- Installable as a plugin for Claude Code, Codex and GitHub Copilot, and through skills.sh for other agents.
- README rewritten with per-agent install steps and a how-it-works diagram.

## 0.1.0

- First version: `career-setup`, `job-scout`, `tailor-resume` and `linkedin-pass`.
