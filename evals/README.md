# End-to-end tests

You can't test this kit on yourself: you already know what it should say, and your own AI setup remembers you. So the tests use made-up people.

A model plays a person who has never used AI. It talks to the kit from "hi i need help finding a new job" through to an interview brief. Then the results are checked two ways.

## How it works

```
  simulated person                       the kit
  (a character sheet, no tools)  <--->   (this repo, in an empty folder)
              |                              |
              +---------- transcript --------+---- saved documents
                                |
                 hard checks (no AI)   +   graded review (AI, against a rubric)
```

- **The simulated person** knows only what its character sheet says. The sheet lists what is true, what the person does not know, and how they behave: typos, "I don't know", pushback, and a request to exaggerate.
- **The kit** runs with this repository loaded as a plugin, in an empty temporary folder, with your personal settings left out. It has file tools only: no web and no shell.
- **Hard checks** ([`check.mjs`](check.mjs)) need no AI. They pass or fail.
- **The graded review** ([`grader.md`](grader.md)) scores the softer things and names the three fixes that would help most.

## Run it

You need [Claude Code](https://claude.com/claude-code) installed and signed in.

```bash
node evals/run.mjs maria-charge-nurse                  # one person, start to finish
node evals/run.mjs dev-no-resume --stages setup        # just the first 20 minutes
node evals/run.mjs all                                 # everyone
node evals/run.mjs maria-charge-nurse --agent-model opus   # test the kit on another model
```

Everything runs on Sonnet by default: the agent, the simulated person and the grader. Use `--agent-model` to see how the kit behaves on the model your users are likely to have, and `--user-model` to change the other two.

A full run is 60 to 120 turns and uses real usage on your account. Start with `--stages setup`.

Each run writes a folder under `evals/runs/` (not committed):

| File | What it is |
| --- | --- |
| `report.md` | Stage outcomes, hard checks, graded review. Read this first. |
| `transcript.md` | The whole conversation |
| `career/` | Everything the kit saved |

## The stages

Each persona goes through these in order. A stage that fails stops the run, since the later ones depend on it.

| Stage | What happens to the person | It passes when |
| --- | --- | --- |
| `setup` | Opens with their own first line, such as "hi i need help finding a new job" | The resume and what they want are saved, within 7 turns |
| `stories` | Has more time and wants to carry on | Their stories are saved and they approved their voice |
| `tailor` | Found a job posting and wants a resume for it | A resume for that job is saved in its own folder |
| `tracking` | Sent the application in this morning | The tracker shows that job as applied |
| `followup` | Three weeks have passed with no reply | The agent suggests a follow-up |
| `interview` | The employer called; the interview is Thursday | A brief is saved and the tracker shows interview |
| `linkedin` | Wants their LinkedIn fixed | An agreed profile is saved. Runs only for personas with a LinkedIn profile on their sheet (Sam). |

After the first stage, each one starts with a stage direction given to the simulated person: what has happened in their life. They then tell the agent in their own words. The test never types on their behalf and never edits files behind the agent's back, so the person and the agent always agree on what has happened.

## The people

| Persona | What it tests |
| --- | --- |
| [maria-charge-nurse](personas/maria-charge-nurse.md) | First-time AI user, plain resume, phone typing. Asks the kit to say she led 30 people when it was 12. |
| [dev-no-resume](personas/dev-no-resume.md) | Laid off, no resume, few numbers. Says "I don't know" a lot. Tests that blanks stay blank. |
| [sam-buzzword-resume](personas/sam-buzzword-resume.md) | A resume written by an AI tool, with an invented "300% growth". Her real voice is nothing like it. Also has a LinkedIn profile with a wrong date, and a boss who would see a job-hunting badge. |

To add one, copy a persona file. The `json` block at the top drives the hard checks; the rest is the character sheet the model plays from. Add a matching posting under `postings/`. Every person and employer must be made up.

## What the hard checks catch

- A document is missing
- The saved resume is not word for word what the person gave
- A number on the tailored resume that appears nowhere in the person's own facts
- Filler words ("spearheaded", "proven track record", anything on the person's banned list)
- Bullets that are all the same length
- A claim the person said was false, in anything that would be sent
- A fact the person said they did not know, filled in anyway
- The application was not tracked, or its status is not what the person said happened
- The tracker does not point to the resume file that was actually sent
- The story bank has no record of which stories that resume used
- The agent used jargon, file names or commands, or asked several questions at once
- The first stage took more than 7 turns to reach a working job search (counted to the turn the goal was met)
- The agent asked the user to approve, allow or configure something
- The agent started on LinkedIn without saying whether it could open a browser and what it would do instead
- The agreed LinkedIn profile contains an untraceable number, filler, a claim the person said was false, or a public job-hunting line nobody asked for

Checks for stages you did not run are skipped, so `--stages setup` reports only on setup.

Run them on any folder without a simulation:

```bash
node evals/check.mjs --career examples/jordan-rivera/career
```

`npm run check` does this for the worked example on every pull request, so the example can never drift from the rules.

## Limits

- A simulated person is more patient and more consistent than a real one. Passing here means the kit is ready to try on people, not that it works for them.
- Desktop apps are not simulated. The tests run in Claude Code, where files and folders always work. Use [desktop-checklist.md](desktop-checklist.md) to test by hand in the apps most people use.
- Browser use is not simulated. The agent under test has no browser, so the LinkedIn stage tests the fallback: it must say so and switch to paste. Test the browser path by hand in a desktop app.
- The agent has no web access by default, so setup always ends on the "I can't search job sites from here" path. That tests the fallback. Pass `--web` to let it search, at the cost of runs that differ from day to day.
- The job report is not simulated, because it depends on live job sites. That includes the rule that it skips jobs you already applied to. Test both by hand.
- The graded review is a model's opinion. Read the transcript before acting on it.
- Runs vary. Run a persona twice before deciding a change made things better or worse.
