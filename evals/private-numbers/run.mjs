#!/usr/bin/env node
// Wording test for tailor-resume's "Is every number theirs to share?" check.
//
// Each case in cases.json is a short invented draft, labelled with the numbers
// that should prompt a question about sharing. One headless `claude -p` call per
// case plays the assistant, with the check as its only instruction, and replies
// with the numbers it would ask about and the question it would ask. When it asks
// something, a second call counts how many separate questions about sharing a
// number the user would have to answer. No tools, no web.
//
//   node evals/private-numbers/run.mjs
//   node evals/private-numbers/run.mjs --rubric my-wording.md
//   node evals/private-numbers/run.mjs --limit 2
//
// Options:
//   --rubric path      the wording to test (default: the check, read from skills/tailor-resume/SKILL.md)
//   --split s          dev, test or all (default: all)
//   --model m          model playing the assistant (default: sonnet)
//   --judge-model m    model counting the questions (default: haiku)
//   --concurrency n    calls at a time (default: 4)
//   --limit n          only the first n cases
//
// A run of all 34 cases costs roughly $0.07 to $0.35 of usage on your account
// (more the first time a wording is tried, less once it is cached).

import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const NO_TOOLS = "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Agent,Task,Skill,NotebookEdit,TodoWrite";

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};
const split = opt("split", "all");
const model = opt("model", "sonnet");
const judgeModel = opt("judge-model", "haiku");
const concurrency = Math.max(1, Number(opt("concurrency", 4)));
const limit = opt("limit") ? Number(opt("limit")) : Infinity;
if (!["dev", "test", "all"].includes(split)) { console.error("--split must be dev, test or all"); process.exit(2); }

// The wording under test. By default, the check as it stands in the skill, so the
// test always runs against what ships.
function skillCheck() {
  const skill = readFileSync(join(ROOT, "skills/tailor-resume/SKILL.md"), "utf8");
  const line = skill.split("\n").find((l) => l.includes("*Is every number theirs to share?*"));
  if (!line) { console.error("Could not find the \"Is every number theirs to share?\" check in skills/tailor-resume/SKILL.md. Pass --rubric."); process.exit(2); }
  return `Before handing over the draft, one of the checks: ${line.replace(/^\s*-\s*/, "")}`;
}
const rubricPath = opt("rubric");
const rubric = rubricPath ? readFileSync(rubricPath, "utf8") : skillCheck();
const rubricLabel = rubricPath || "skills/tailor-resume/SKILL.md, step 5";
const rubricSha = createHash("sha256").update(rubric).digest("hex");

const cases = JSON.parse(readFileSync(join(HERE, "cases.json"), "utf8"))
  .filter((c) => split === "all" || c.split === split)
  .slice(0, limit);

const stamp = new Date().toISOString().replace(/[:.]/g, "-").replace(/Z$/, "");
const outDir = join(HERE, "..", "runs", `${stamp}-private-numbers`);
mkdirSync(outDir, { recursive: true });

function renderCase(c) {
  const ctx = c.context;
  return [
    "# The situation", "",
    `Role: ${ctx.role}`,
    `Employer: ${ctx.employer}`, "",
    "Lines from the user's resume-base.md:",
    ...ctx.resume_base.map((l) => `- ${l}`), "",
    "Notes (story bank, Proof level lines, things the user said):",
    ...(ctx.notes.length ? ctx.notes.map((l) => `- ${l}`) : ["- (none)"]), "",
    `# The draft (${c.draft_kind})`, "",
    ...c.draft.map((l) => `- ${l}`),
  ].join("\n");
}

const TASK = `# Your task

You are the job-search assistant. You have just finished the draft above and are about to hand it to the user. Follow the reference file above.

Reply with JSON only, no other text, in this shape:
{"flagged": ["<each number you would ask about, copied exactly as it appears in the draft>"], "question": "<the question you would ask the user before handing over the draft, or an empty string>"}`;

const JUDGE = (question) => `Below is a message an assistant wrote to a job seeker before handing over a resume draft.

Count the separate questions in it that ask whether a number may be shared or is public: things the person would have to answer one by one. One question that names several numbers and can be answered with a single reply ("OK to use both, or should I leave them out?") counts as one. Two questions about two different numbers count as two. Questions about anything else (whether a number is accurate, wording, what to add) don't count.

Reply with JSON only: {"sharing_questions": <number>}

The message:
"""
${question}
"""`;

function claude(prompt, m) {
  const args = ["-p", prompt, "--output-format", "json", "--model", m, "--setting-sources", "project",
    "--strict-mcp-config", "--tools", "", "--disallowedTools", NO_TOOLS];
  return new Promise((res, rej) => {
    const p = spawn("claude", args, { cwd: HERE, stdio: ["ignore", "pipe", "pipe"] });
    let out = "", err = "";
    const timer = setTimeout(() => { p.kill(); rej(new Error("timeout")); }, 5 * 60 * 1000);
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", (e) => { clearTimeout(timer); rej(new Error(`could not run claude: ${e.message}`)); });
    p.on("close", () => {
      clearTimeout(timer);
      let j;
      try { j = JSON.parse(out); } catch { return rej(new Error(`claude returned no JSON: ${(out || err).slice(0, 300)}`)); }
      if (j.is_error) return rej(new Error(`claude reported an error: ${String(j.result).slice(0, 300)}`));
      res(j);
    });
  });
}

const jsonIn = (text) => {
  const m = String(text || "").match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
};

// A flag matches a label if either contains the other, ignoring case, $, commas and spacing.
const norm = (s) => String(s).toLowerCase().replace(/[$,]/g, "").replace(/\s+/g, " ").trim();
const matches = (a, b) => { const x = norm(a), y = norm(b); return x.length > 0 && y.length > 0 && (x.includes(y) || y.includes(x)); };

function score(c, flagged, sharingQuestions) {
  const expected = c.expected_flagged || [];
  const hits = expected.filter((e) => flagged.some((f) => matches(f, e)));
  const misses = expected.filter((e) => !hits.includes(e));
  const overAsks = flagged.filter((f) => !expected.some((e) => matches(f, e)));
  const asked = sharingQuestions > 0;
  const questionWhenNone = expected.length === 0 && asked;
  const noQuestionWhenExpected = expected.length > 0 && !asked;
  const multiQuestion = sharingQuestions > 1;
  return {
    hits, misses, overAsks, sharingQuestions, questionWhenNone, noQuestionWhenExpected, multiQuestion,
    pass: !misses.length && !overAsks.length && !questionWhenNone && !noQuestionWhenExpected && !multiQuestion,
  };
}

async function runCase(c) {
  let cost = 0;
  try {
    const out = await claude(`# Reference file\n\n${rubric}\n\n${renderCase(c)}\n\n${TASK}`, model);
    cost += out.total_cost_usd || 0;
    const j = jsonIn(out.result);
    if (!j) return { id: c.id, error: "unparseable reply", raw: out.result, cost };
    const reply = { flagged: Array.isArray(j.flagged) ? j.flagged.map(String) : [], question: String(j.question || "").trim() };
    let sharingQuestions = 0;
    if (reply.question) {
      const jo = await claude(JUDGE(reply.question), judgeModel);
      cost += jo.total_cost_usd || 0;
      const n = Number(jsonIn(jo.result)?.sharing_questions);
      if (!Number.isFinite(n)) return { id: c.id, error: "unparseable judge reply", raw: jo.result, reply, cost };
      sharingQuestions = n;
    }
    return { id: c.id, expected: c.expected_flagged, reply, score: score(c, reply.flagged, sharingQuestions), cost };
  } catch (e) {
    return { id: c.id, error: e.message, cost };
  }
}

// One retry, since a reply now and then comes back without its JSON.
async function runCaseWithRetry(c) {
  const first = await runCase(c);
  if (!first.error) return first;
  const second = await runCase(c);
  second.cost += first.cost;
  return second;
}

async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      const r = (results[i] = await fn(items[i]));
      console.log(`${r.id}: ${r.error ? "ERROR " + r.error : r.score.pass ? "pass" : "FAIL"}`);
    }
  }));
  return results;
}

console.log(`Testing ${rubricLabel} (sha256 ${rubricSha.slice(0, 12)}) on ${cases.length} cases with ${model}`);
const results = await pool(cases, concurrency, runCaseWithRetry);

const ok = results.filter((r) => !r.error);
const cost = results.reduce((s, r) => s + r.cost, 0);
const ids = (pred) => ok.filter(pred).map((r) => r.id);
const noneExpected = ok.filter((r) => !r.expected.length).length;
const summary = {
  rubric: rubricLabel, rubricSha256: rubricSha, model, judgeModel, split,
  cases: results.length, errors: results.length - ok.length,
  passed: ok.filter((r) => r.score.pass).length,
  noneExpected,
  questionWhenNone: ids((r) => r.score.questionWhenNone),
  missedNumbers: ok.reduce((s, r) => s + r.score.misses.length, 0),
  expectedNumbers: ok.reduce((s, r) => s + r.expected.length, 0),
  overAskedNumbers: ok.reduce((s, r) => s + r.score.overAsks.length, 0),
  noQuestionWhenExpected: ids((r) => r.score.noQuestionWhenExpected),
  moreThanOneQuestion: ids((r) => r.score.multiQuestion),
  costUsd: Number(cost.toFixed(4)),
};
writeFileSync(join(outDir, "results.json"), JSON.stringify({ summary, results }, null, 2));

const md = [
  `# Private numbers: ${stamp}`, "",
  `Wording: ${rubricLabel} (sha256 \`${rubricSha.slice(0, 12)}\`). Model ${model}, judge ${judgeModel}, ${results.length} cases, ${summary.errors} errors.`, "",
  `- Right: ${summary.passed}/${ok.length}`,
  `- Asked when it shouldn't: ${summary.questionWhenNone.length} of ${noneExpected} drafts ${summary.questionWhenNone.join(", ")}`,
  `- Missed: ${summary.missedNumbers} of ${summary.expectedNumbers} numbers`,
  `- Numbers asked about that needed no question: ${summary.overAskedNumbers}`,
  `- No question when one was needed: ${summary.noQuestionWhenExpected.length} ${summary.noQuestionWhenExpected.join(", ")}`,
  `- More than one question about sharing: ${summary.moreThanOneQuestion.length} ${summary.moreThanOneQuestion.join(", ")}`,
  `- Cost: $${summary.costUsd.toFixed(2)}`, "",
  "## Wrong", "",
  ...results.filter((r) => r.error || !r.score.pass).map((r) => r.error
    ? `- ${r.id}: error: ${r.error}`
    : `- ${r.id}: expected [${r.expected.join(", ")}], asked about [${r.reply.flagged.join(", ")}], ${r.score.sharingQuestions} question(s). "${r.reply.question || "(no question)"}"`),
  "",
].join("\n");
writeFileSync(join(outDir, "summary.md"), md);
console.log(`\n${md}\nSaved in ${outDir}`);
