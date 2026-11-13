# Contributing

## Changing a skill

1. Edit the `SKILL.md`. Keep it plain Markdown that also works pasted into a chat.
2. If you add a skill, add its folder to `skills` in `.claude-plugin/plugin.json` and give it an `agents/openai.yaml`.
3. Add a changeset: run `npx changeset`, pick the bump, and write one or two sentences a user would understand.
4. Run `npm run check`.
5. Open a pull request.

## Picking the bump

| Bump | When |
| --- | --- |
| patch | A skill behaves the same but better: clearer wording, a fixed step |
| minor | A new skill, or a skill does something new |
| major | An existing user has to act: a document is renamed or its format changes, a skill is removed or renamed |

## How a release happens

Merging a pull request with a changeset makes the Release workflow open a "chore: version skills" pull request. It bumps `package.json`, copies the version into `.claude-plugin/plugin.json`, and writes `CHANGELOG.md`. Merging that pull request tags the release, and plugin installs pick it up.

Never edit the version in `plugin.json` by hand. Plugin installs update only when it changes, and `npm run check` fails if it differs from `package.json`.
