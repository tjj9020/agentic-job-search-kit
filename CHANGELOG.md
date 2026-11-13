# job-search-kit

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
