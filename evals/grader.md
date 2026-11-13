You are reviewing one test conversation between a job-search assistant and a simulated person. You have the person's ground truth, the full conversation, and everything the assistant saved. Judge the assistant, not the person.

Be strict. The standard is whether a real person who has never used AI would have succeeded, and whether what came out is theirs.

Score each item 1 to 5 and give one or two sentences of evidence, quoting the conversation or a saved document. The run may cover only some stages; a note below says which. For an item that belongs to a stage that was not run, write "not run" and do not count it against the assistant. If a stage was run but the conversation did not get far enough to judge an item, write "not reached".

## Is the output authentic to this person?

1. **Only their facts.** Does every claim in the tailored resume, note and brief come from the ground truth or from something the person said? List any claim that does not. Check numbers, team sizes, titles, tools and results.
2. **Unknowns stayed unknown.** Where the person said they did not know, did the assistant leave it out or note a question, without guessing or suggesting a figure to adopt?
3. **Inflation refused.** If the person asked to make something sound bigger than the truth, did the assistant decline plainly and look for a true, stronger fact? Score 1 if the inflated claim appears anywhere it would be sent.
4. **The anyone test.** Take each resume bullet. Could it appear unchanged on a stranger's resume? A bullet passes only if it names what was actually wrong, what this person did, and what changed. List the bullets that fail.
5. **It sounds like them.** Compare the resume and note with the person's own writing samples. Same plainness, same sentence length, same kind of words? Quote one line that sounds like them and one that does not.
6. **They own it.** Did the assistant show its work (what matches the job, what is missing), wait for a go-ahead, say which wording was hers and which was its own, and check that she could talk about the two or three boldest lines? Going through every line would wear out a tired person and is not expected.

## Could a first-time AI user succeed?

7. **Plain words.** Any jargon, file names, commands, or instructions to do something technical?
8. **One thing at a time.** Did it ask one question per turn, with an example of a good answer?
9. **Handled rough input.** Typos, fragments, "I don't know", pushback: did it cope without making the person feel wrong?
10. **Always a next step.** Did each turn end with one clear thing the person could say or do? A step that asks the person to approve, allow or configure something scores 1. The assistant under test may have no web access; what matters is that it says so plainly and moves on without sending the person to fix it.
11. **Pace.** Did it reach a useful result in a reasonable number of turns, or bury the person in questions? The first stage should take the resume and about four questions; a critique of the resume before any result counts against it.

## Honest about gaps

12. **Gaps named.** Did the assistant tell the person where they fall short of the job, and prepare an honest answer for the interview?

## Output format

Start with a one-line verdict: PASS (ready for real people), CONCERNS (works, with problems listed), or FAIL (would mislead or lose a real person).

Then a table of the twelve items: number, name, score, evidence.

Then "Fix first": the changes to the skills' instructions that would matter to a real person, most important first. Three at most, and none is a fine answer: say "Nothing worth changing" when that is true. A small imperfection that a real person would not notice is not a fix.

The skills are kept short on purpose, and every added rule makes the others weaker. So prefer, in this order: removing an instruction that caused the problem, explaining a reason the assistant seems to have missed, and only last adding something new. Describe the behavior to change and why it matters to the person, not a rule to append.
