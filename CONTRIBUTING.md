# Contributing

Thanks for helping. Bug reports from real job searches are the most useful thing you can send: open an [issue](https://github.com/tjj9020/agentic-job-search-kit/issues/new/choose) and say what you typed and what happened. Remove personal details first; issues are public.

## What fits

- A skill that misbehaved, got stuck, used jargon, or made something up
- Clearer wording for people who are new to AI
- Install steps that are wrong or missing for an AI app
- A new capability, if it needs no new accounts, no automation of job sites, and no extra documents. Open an issue to discuss it before you build it.

## What doesn't

- Auto-applying, mass messaging, or scraping job sites
- Scripts or programs inside a skill. Skills are instructions only.
- Anything that sends a user's documents somewhere else

## Making a change

1. Fork the repository and create a branch.
2. Edit the `SKILL.md`. Keep it plain Markdown that also works when pasted into a chat, and keep the user-facing language free of jargon.
3. If you add a skill, add its folder to `skills` in `.claude-plugin/plugin.json` and give it an `agents/openai.yaml`.
4. Try it in an agent. For anything beyond wording, run a simulated user against it: `node evals/run.mjs maria-charge-nurse` (see [evals/README.md](evals/README.md)). Say what you tested in the pull request.
5. Add a changeset: run `npx changeset`, pick the bump, and write one or two sentences a user would understand. Skip this for changes that touch only docs, `examples/`, `evals/` or `.github/`.
6. Run `npm run check`. It verifies the plugin version, the skill folders, that skills hold no scripts or hidden text, and that the [worked example](examples/README.md) still passes the output checks. If you change the format of a document a skill writes, update the example to match.
7. Open a pull request against `main`.

The check on a first-time contributor's pull request waits for the maintainer to approve it before it runs. That is normal.

## Testing with simulated users

`evals/` runs a simulated first-time user against the kit in Claude Code. See [evals/README.md](evals/README.md).

- Everything runs on Sonnet by default. Runs use real usage on your account, so start with `--stages setup`.
- Run a persona before and after your change, and say in the pull request what moved. Results vary, so one run is weak evidence.
- If your change adds a behavior, add a check for it in `evals/check.mjs` or a trap in a persona, so it stays fixed.
- Personas and postings must be entirely made up.

## Who this is for

Most users are not developers. They use a desktop or web app, have never opened a terminal, and may be using AI for real work for the first time. Design for them first:

- A skill must work when installed by uploading a ZIP, with no shell and no file system.
- Never assume a tool exists (a browser, a scheduler, web search, a folder). Check, say what is possible here, and offer another way.
- What the user receives should be something they can use as it is: a Word document, not a Markdown file.

The simulated tests run in Claude Code, so they do not cover desktop apps. For changes that affect how the kit starts, saves or delivers files, walk through [evals/desktop-checklist.md](evals/desktop-checklist.md) by hand.

## How pull requests are reviewed

Skills are instructions an AI agent follows on someone's computer, next to their resume. So review is strict about a few things:

- A skill never tells the agent to run commands, install anything, fetch instructions from a web address, or read outside the `career/` folder.
- A skill never sends the user's information anywhere.
- No hidden text: no HTML comments, invisible characters, or instructions tucked into examples.
- Every person, company and number in an example is made up.
- The three rules stay intact: never invent a fact, a blank stays blank, nothing AI-written counts as the user's voice.

Changes to `.github/`, `scripts/`, `package.json` and `.claude-plugin/` get the same scrutiny, since they decide what runs in CI and what gets installed.

## Picking the bump

| Bump | When |
| --- | --- |
| patch | A skill behaves the same but better: clearer wording, a fixed step |
| minor | A new skill, or a skill does something new |
| major | An existing user has to act: a document is renamed or its format changes, a skill is removed or renamed |

## How a release happens

Merging a pull request with a changeset makes the Release workflow open a "chore: version skills" pull request. It bumps `package.json`, copies the version into `.claude-plugin/plugin.json`, and writes `CHANGELOG.md`. Merging that pull request tags the release, and plugin installs pick it up.

Dependabot opens monthly pull requests for GitHub Actions and npm packages. They need no changeset. For npm packages and minor action updates, merge once the check passes. For a major version of an action (v1 to v2), read its release notes first: the check on a pull request does not run the Release workflow, so a breaking change there only shows up after merging.

Never edit the version in `plugin.json` by hand. Plugin installs update only when it changes, and `npm run check` fails if it differs from `package.json`.

## Security problems

Do not open a public issue. See [SECURITY.md](SECURITY.md).

## Maintainer setup

Repository settings live in code so they can be reviewed and reapplied. As the owner, run:

```bash
bash scripts/apply-repo-settings.sh
```

It applies:

| Setting | Value |
| --- | --- |
| `main` | Pull request required, 1 approving review from a code owner, stale approvals dismissed, conversations resolved, the `check` job must pass, no force pushes, no deletion. The owner can bypass through a pull request. |
| Release tags (`v*`) | Cannot be moved or deleted |
| Security | Dependabot alerts and security updates, private vulnerability reporting, secret scanning with push protection |
| Actions | Only GitHub's own actions and `changesets/action`; read-only token by default; every outside contributor's run needs approval |
| General | Wiki off, merged branches deleted, no rebase merges |

The rulesets are in [`.github/rulesets/`](.github/rulesets) and can also be imported by hand under Settings > Rules > Rulesets > Import.
