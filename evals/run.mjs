#!/usr/bin/env node
// End-to-end test: a simulated person talks to the kit, start to finish.
//
// Two headless Claude Code sessions talk to each other:
//   - the AGENT has this repository loaded as a plugin and works in an empty
//     temporary folder, exactly as a new user's agent would
//   - the USER is a model playing a persona from evals/personas/. It sees only
//     what the agent says, knows only what its persona file says, and has no tools
//
// Afterwards, check.mjs runs hard checks on the files, and a third session
// grades the softer things against evals/grader.md.
//
//   node evals/run.mjs maria-charge-nurse
//   node evals/run.mjs dev-no-resume --stages setup
//   node evals/run.mjs all --user-model haiku
//
// Options:
//   --stages a,b,c     setup, stories, tailor, interview (default: all four)
//   --agent-model m    model for the agent under test
//   --user-model m     model for the simulated user and the grader
//   --max-turns n      cap per stage (default varies by stage)
//   --keep             keep the temporary working folder
//
// Each run costs real usage on your account: a full persona is 60 to 120 turns.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format, personaConfig, runChecks } from "./check.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(`--${name}`); return i > -1 ? argv[i + 1] : fallback; };
const flag = (name) => argv.includes(`--${name}`);
const VALUE_OPTS = new Set(["--stages", "--agent-model", "--user-model", "--max-turns"]);
const target = argv.find((a, i) => !a.startsWith("--") && !VALUE_OPTS.has(argv[i - 1]));

if (!target) {
  console.error("usage: node evals/run.mjs <persona|all> [--stages setup,stories,tailor,interview] [--agent-model m] [--user-model m]");
  console.error("personas: " + readdirSync(join(HERE, "personas")).map((f) => f.replace(/\.md$/, "")).join(", "));
  process.exit(2);
}

const DONE = "[[DONE]]";

const USER_RULES = `You are playing a real person in a conversation with a job-search assistant. Stay in character for the whole conversation. Your character sheet is below.

Rules:
- Reply only as this person would type. One short message. No stage directions, no quotation marks around your reply.
- You know only what the sheet says. If asked something the sheet does not cover, say you are not sure. Never invent a fact, a number, an employer or a date.
- Do not volunteer facts. Answer what was asked, the way a person would: sometimes incompletely.
- Follow every instruction under "Things to do during the conversation" at the moment it applies.
- When asked for your resume or writing samples, paste them exactly as written on the sheet.
- If the assistant offers to continue or asks whether to go on, agree, unless the sheet says otherwise.
- You do not know what a skill, prompt, plugin, file path or command is. If asked to type a command or open a file, be confused.
- When the assistant has clearly finished what you came for in this part of the conversation and is only asking what you want to do next, reply with exactly ${DONE} and nothing else.

Character sheet:

`;

function claude(args, cwd) {
  const r = spawnSync("claude", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 });
  if (r.error) throw new Error(`could not run claude: ${r.error.message}`);
  let out;
  try { out = JSON.parse(r.stdout); } catch { throw new Error(`claude returned no JSON:\n${(r.stdout || r.stderr).slice(0, 500)}`); }
  if (out.is_error) throw new Error(`claude reported an error: ${String(out.result).slice(0, 300)}`);
  return out;
}

function session(baseArgs, cwd, model) {
  let id;
  let cost = 0;
  return {
    say(message) {
      const args = ["-p", message, "--output-format", "json", "--setting-sources", "project"];
      if (model) args.push("--model", model);
      if (id) args.push("--resume", id);
      args.push(...baseArgs);
      const out = claude(args, cwd);
      id = out.session_id;
      cost += out.total_cost_usd || 0;
      return String(out.result || "").trim();
    },
    get cost() { return cost; },
  };
}

const exists = (wd, ...p) => existsSync(join(wd, ...p));
const appFile = (wd, name) => {
  const dir = join(wd, "career", "applications");
  return existsSync(dir) && readdirSync(dir).some((d) => existsSync(join(dir, d, name)));
};

const STAGES = {
  setup: {
    open: (p) => p.opening || "help me with my job search",
    done: (wd) => exists(wd, "career", "resume-base.md") && exists(wd, "career", "search-criteria.md"),
    max: 30,
  },
  stories: {
    open: () => "ok lets keep going with the rest",
    done: (wd) => exists(wd, "career", "resume-story-bank.md") && /approved/i.test(read(join(wd, "career", "resume-voice-profile.md"))),
    max: 70,
  },
  tailor: {
    open: (p) => `can you write my resume for this job\n\n${read(join(REPO, p.posting))}`,
    done: (wd) => appFile(wd, "resume.md"),
    max: 25,
  },
  interview: {
    open: () => "i got an interview for that job, its on thursday. help",
    done: (wd) => appFile(wd, "brief.md"),
    max: 25,
  },
};

function read(p) { return existsSync(p) ? readFileSync(p, "utf8") : ""; }

function runPersona(name) {
  const personaPath = join(HERE, "personas", `${name}.md`);
  if (!existsSync(personaPath)) throw new Error(`no persona named ${name}`);
  const persona = personaConfig(personaPath);
  const stages = opt("stages", "setup,stories,tailor,interview").split(",");
  const work = mkdtempSync(join(tmpdir(), `jsk-${name}-`));
  const userDir = mkdtempSync(join(tmpdir(), `jsk-user-`));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runDir = join(HERE, "runs", `${stamp}-${name}`);
  mkdirSync(runDir, { recursive: true });

  // The agent under test: this repo as a plugin, file tools only, no web, no shell.
  const agent = session(
    ["--plugin-dir", REPO, "--permission-mode", "acceptEdits", "--allowedTools", "Read,Write,Edit,Glob,Grep,Skill"],
    work, opt("agent-model"),
  );
  // The simulated person: a character sheet and nothing else.
  const user = session(
    ["--system-prompt", USER_RULES + read(personaPath), "--disallowedTools", "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Agent,Task,Skill,NotebookEdit"],
    userDir, opt("user-model"),
  );

  const transcript = [];
  let n = 0;
  const log = (role, stage, text) => {
    transcript.push({ n: ++n, role, stage, text });
    writeFileSync(join(runDir, "transcript.json"), JSON.stringify(transcript, null, 2));
    console.log(`\n[${stage}] ${role === "agent" ? "AGENT" : "USER "}: ${text.length > 400 ? text.slice(0, 400) + " ..." : text}`);
  };

  const stageResults = [];
  for (const stageName of stages) {
    const stage = STAGES[stageName];
    if (!stage) throw new Error(`unknown stage ${stageName}`);
    const max = Number(opt("max-turns", stage.max));
    let message = stage.open(persona);
    let turns = 0, grace = 2, outcome = "ran out of turns";
    while (turns < max) {
      log("user", stageName, message);
      const reply = agent.say(message);
      log("agent", stageName, reply);
      turns++;
      if (stage.done(work) && grace-- <= 0) { outcome = "reached its goal"; break; }
      message = user.say(reply);
      if (message.includes(DONE)) { outcome = stage.done(work) ? "reached its goal" : "user thought it was finished, but the goal was not met"; break; }
    }
    if (outcome === "ran out of turns" && stage.done(work)) outcome = "reached its goal";
    stageResults.push({ stage: stageName, turns, outcome });
    console.log(`\n== ${stageName}: ${outcome} after ${turns} turns`);
    if (outcome !== "reached its goal") break; // later stages depend on this one
  }

  // Keep what was produced.
  if (existsSync(join(work, "career"))) cpSync(join(work, "career"), join(runDir, "career"), { recursive: true });
  const md = transcript.map((t) => `**${t.role === "agent" ? "Agent" : "User"}** (${t.stage}, turn ${t.n})\n\n${t.text}`).join("\n\n---\n\n");
  writeFileSync(join(runDir, "transcript.md"), md);

  // Hard checks.
  const checks = runChecks({ career: join(runDir, "career"), personaPath, transcriptPath: join(runDir, "transcript.json") });

  // Graded review of the softer qualities.
  let grade = "(grader did not run)";
  try {
    const produced = existsSync(join(runDir, "career")) ? walk(join(runDir, "career")).map((f) => `=== ${f.slice(runDir.length + 1)} ===\n${read(f)}`).join("\n\n") : "(nothing was saved)";
    const grader = session(["--disallowedTools", "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Agent,Task,Skill,NotebookEdit"], userDir, opt("user-model"));
    grade = grader.say(`${read(join(HERE, "grader.md"))}\n\n# The person (ground truth)\n\n${read(personaPath)}\n\n# The conversation\n\n${md}\n\n# What the assistant saved\n\n${produced}`);
  } catch (e) { grade = `(grader failed: ${e.message})`; }

  const failed = checks.filter((c) => !c.pass).length;
  const report = [
    `# ${name}`, "",
    `Run: ${stamp}. Cost: agent $${agent.cost.toFixed(2)}, simulated user $${user.cost.toFixed(2)}.`, "",
    "## Stages", "", ...stageResults.map((s) => `- **${s.stage}:** ${s.outcome} (${s.turns} turns)`), "",
    "## Hard checks", "", "```", format(checks), "```", "",
    "## Graded review", "", grade, "",
  ].join("\n");
  writeFileSync(join(runDir, "report.md"), report);
  console.log(`\n${"=".repeat(60)}\n${report}\nSaved to ${runDir}`);

  if (!flag("keep")) { rmSync(work, { recursive: true, force: true }); rmSync(userDir, { recursive: true, force: true }); }
  else console.log(`Working folder kept at ${work}`);
  return failed === 0 && stageResults.every((s) => s.outcome === "reached its goal");
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}

const names = target === "all" ? readdirSync(join(HERE, "personas")).map((f) => f.replace(/\.md$/, "")) : [target];
let ok = true;
for (const name of names) {
  try { ok = runPersona(name) && ok; } catch (e) { console.error(`\n${name}: ${e.message}`); ok = false; }
}
process.exit(ok ? 0 : 1);
