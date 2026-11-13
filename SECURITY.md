# Security

## Reporting a problem

Report security problems privately through [GitHub's private vulnerability reporting](https://github.com/tjj9020/agentic-job-search-kit/security/advisories/new). Do not open a public issue.

Include what you found, how to reproduce it, and which AI app you used. You should hear back within 7 days.

## What counts as a security problem here

These skills are instructions that an AI agent follows on someone's computer, with access to their resume and pay expectations. So a security problem is anything that could make an agent act against the person using it. For example:

- Skill text that tells the agent to send the user's documents or answers anywhere, or to fetch and follow instructions from a web address
- Skill text that tells the agent to run commands, install software, or read files outside the `career/` folder
- Hidden or disguised instructions in a skill, example, or document (invisible characters, HTML comments, text addressed to the agent in a file that looks like data)
- A way for a job posting or web page the agent reads to make it ignore the skill's rules, such as inventing facts on a resume
- A problem in the release or check workflows that lets an outside pull request change what gets published

Bugs where a skill is merely unhelpful or wrong belong in a normal issue.

## How this repository is protected

- Skills may contain only Markdown and one metadata file. `npm run check` rejects anything else, so a contribution cannot add a script.
- Every change to `main` goes through a pull request reviewed by the maintainer, and the check must pass.
- Workflows run with read-only access by default and use pinned versions of every action. Pull requests from forks get no secrets and no write access.
- Releases are tagged, and tags cannot be moved or deleted.

## If you use this kit

- Install it from this repository only: `tjj9020/agentic-job-search-kit`.
- Your documents live in a `career/` folder on your computer. Do not publish that folder.
- Read every resume and message before you send it.
