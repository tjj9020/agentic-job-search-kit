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
//   node evals/run.mjs all --agent-model opus
//
// Options:
//   --stages a,b,c     setup, stories, tailor, tracking, followup, interview, linkedin (default: all)
//   --agent-model m    model for the agent under test (default: sonnet)
//   --user-model m     model for the simulated user and the grader (default: sonnet)
//   --max-turns n      cap per stage (default varies by stage)
//   --web              let the agent search the web (off by default, so runs are repeatable)
//   --keep             keep the temporary working folder
//
// Each run costs real usage on your account: a full persona is 60 to 120 turns.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { applications, format, personaConfig, runChecks } from "./check.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(`--${name}`); return i > -1 ? argv[i + 1] : fallback; };
const flag = (name) => argv.includes(`--${name}`);
const VALUE_OPTS = new Set(["--stages", "--agent-model", "--user-model", "--max-turns"]);
const target = argv.find((a, i) => !a.startsWith("--") && !VALUE_OPTS.has(argv[i - 1]));

if (!target) {
  console.error("usage: node evals/run.mjs <persona|all> [--stages setup,stories,tailor,tracking,followup,interview] [--agent-model m] [--user-model m]");
  console.error("personas: " + readdirSync(join(HERE, "personas")).map((f) => f.replace(/\.md$/, "")).join(", "));
  process.exit(2);
}

// Sonnet keeps test runs affordable. Override either side to test another model.
const DEFAULT_MODEL = "sonnet";
const DONE = "[[DONE]]";

const USER_RULES = `You are playing a real person in a conversation with a job-search assistant. Stay in character for the whole conversation. Your character sheet is below.

Rules:
- Reply only as this person would type. One short message. No narration, no quotation marks around your reply.
- Now and then you will get a message that starts with [Stage direction]. It is not from the assistant. It tells you what has happened in your life since the last message. Treat it as true, remember it, and reply with what you would type to the assistant next.
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

// A voice profile counts as approved only if a line says so without also saying "not yet".
const voiceApproved = (text) => text.split("\n").some((l) => /\bapproved\b/i.test(l) && !/\bnot\b|\bun-?approved\b|\bdraft\b|\bpending\b|\bawaiting\b|\buntil\b|\bonce\b|\bwhen\b/i.test(l));

// Each stage after the first begins with a stage direction to the simulated person:
// what has happened in their life. They then tell the assistant in their own words,
// so they never contradict an event the test introduced. Nothing is edited behind
// the assistant's back.
const STAGES = {
  setup: {
    done: (wd) => exists(wd, "career", "resume-base.md") && exists(wd, "career", "search-criteria.md"),
    max: 15,
  },
  stories: {
    direction: () => "You have more time now and want to carry on with whatever comes next.",
    done: (wd) => exists(wd, "career", "resume-story-bank.md") && voiceApproved(read(join(wd, "career", "resume-voice-profile.md"))),
    max: 70,
  },
  tailor: {
    direction: (posting) => `You found the job posting below and want a resume written for it. Ask for that in one short line. The posting is attached to your message automatically, so do not retype it.\n\n${posting}`,
    attachPosting: true,
    done: (wd) => appFile(wd, "resume.md"),
    max: 25,
  },
  tracking: {
    direction: () => "It is the next morning. Earlier today you sent in your application for that job, using the resume you were given. Tell the assistant.",
    done: (wd) => applications(read(join(wd, "career", "job-scout-ledger.md"))).some((a) => a.status === "applied"),
    max: 4,
  },
  // Three weeks pass with no reply. The assistant should suggest a follow-up.
  followup: {
    direction: () => "Three weeks have gone by since you applied. You have heard nothing from the employer. Come back and ask what you should do now, and mention that it has been about three weeks.",
    expectReply: /follow.?up|check in|check-in|nudge|reach out|short (note|message|email)|message to|email to|note to/i,
    max: 1,
  },
  interview: {
    direction: () => "Good news: the employer has called, and you have an interview for that job this Thursday. Tell the assistant and ask for help getting ready.",
    done: (wd) => appFile(wd, "brief.md") && applications(read(join(wd, "career", "job-scout-ledger.md"))).some((a) => a.status === "interview"),
    max: 25,
  },
  // Only for personas that have a LinkedIn profile on their sheet.
  linkedin: {
    only: (p) => Boolean(p.linkedin),
    direction: () => "You also want your LinkedIn profile fixed, because it no longer matches your resume. Ask for that.",
    done: (wd) => ((read(join(wd, "career", "linkedin-profile-log.md")).split(/^## Profile as agreed/m)[1] || "").split(/^## /m)[0].length > 200),
    max: 30,
  },
};

function read(p) { return existsSync(p) ? readFileSync(p, "utf8") : ""; }

function runPersona(name) {
  const personaPath = join(HERE, "personas", `${name}.md`);
  if (!existsSync(personaPath)) throw new Error(`no persona named ${name}`);
  const persona = personaConfig(personaPath);
  const stages = opt("stages", "setup,stories,tailor,tracking,followup,interview,linkedin").split(",");
  const work = mkdtempSync(join(tmpdir(), `jsk-${name}-`));
  const userDir = mkdtempSync(join(tmpdir(), `jsk-user-`));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runDir = join(HERE, "runs", `${stamp}-${name}`);
  mkdirSync(runDir, { recursive: true });

  // The agent under test: this repo as a plugin, file tools only, no shell, and no web unless --web is passed.
  const agent = session(
    ["--plugin-dir", REPO, "--permission-mode", "acceptEdits", "--allowedTools", `Read,Write,Edit,Glob,Grep,Skill${flag("web") ? ",WebSearch,WebFetch" : ""}`],
    work, opt("agent-model", DEFAULT_MODEL),
  );
  const opening = persona.opening || "help me with my job search";
  const posting = persona.posting ? read(join(REPO, persona.posting)) : "";
  // The simulated person: a character sheet and nothing else.
  const user = session(
    ["--system-prompt", `${USER_RULES}${read(personaPath)}\n\nYou have just opened the conversation by typing: "${opening}"`, "--disallowedTools", "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Agent,Task,Skill,NotebookEdit"],
    userDir, opt("user-model", DEFAULT_MODEL),
  );

  const transcript = [];
  let n = 0;
  const log = (role, stage, text) => {
    transcript.push({ n: ++n, role, stage, text });
    writeFileSync(join(runDir, "transcript.json"), JSON.stringify(transcript, null, 2));
    const label = { agent: "AGENT", user: "USER ", direction: "STAGE" }[role];
    console.log(`\n[${stage}] ${label}: ${text.length > 400 ? text.slice(0, 400) + " ..." : text}`);
  };

  const stageResults = [];
  for (const stageName of stages) {
    const stage = STAGES[stageName];
    if (!stage) throw new Error(`unknown stage ${stageName}`);
    if (stage.only && !stage.only(persona)) continue;
    const max = Number(opt("max-turns", stage.max));
    let message = opening;
    if (stage.direction) {
      const direction = stage.direction(posting);
      log("direction", stageName, direction);
      message = user.say(`[Stage direction] ${direction}\n\nReply with only what you would type to the assistant now.`);
      if (stage.attachPosting) message = `${message}\n\n${posting}`;
    }
    let turns = 0, reachedAt = 0, grace = stage.max <= 4 ? 0 : 2, outcome = "ran out of turns";
    while (turns < max) {
      log("user", stageName, message);
      const reply = agent.say(message);
      log("agent", stageName, reply);
      turns++;
      if (stage.expectReply) { outcome = stage.expectReply.test(reply) ? "reached its goal" : "the agent did not bring it up"; break; }
      // The stage runs two turns past its goal so the hand-off is on record,
      // but pace is measured to the turn the goal was first met.
      if (stage.done?.(work)) { reachedAt ||= turns; if (grace-- <= 0) { outcome = "reached its goal"; break; } }
      message = user.say(reply);
      if (message.includes(DONE)) { outcome = stage.done?.(work) ? "reached its goal" : "user thought it was finished, but the goal was not met"; break; }
    }
    if (outcome === "ran out of turns" && stage.done?.(work)) outcome = "reached its goal";
    if (stage.expectReply && outcome === "reached its goal") reachedAt = turns;
    stageResults.push({ stage: stageName, turns, reachedAt: reachedAt || null, outcome });
    console.log(`\n== ${stageName}: ${outcome} after ${turns} turns`);
    if (outcome !== "reached its goal") break; // later stages depend on this one
  }

  // Keep what was produced.
  if (existsSync(join(work, "career"))) cpSync(join(work, "career"), join(runDir, "career"), { recursive: true });
  const who = { agent: "Agent", user: "User", direction: "Stage direction (given to the simulated person; the agent never sees it)" };
  const md = transcript.map((t) => `**${who[t.role]}** (${t.stage}, turn ${t.n})\n\n${t.text}`).join("\n\n---\n\n");
  writeFileSync(join(runDir, "transcript.md"), md);

  // Hard checks.
  const ran = stageResults.filter((r) => r.outcome === "reached its goal").map((r) => r.stage);
  const expectStatus = ran.includes("interview") ? "interview" : ran.includes("tracking") ? "applied" : undefined;
  const checks = runChecks({
    career: join(runDir, "career"), personaPath, transcriptPath: join(runDir, "transcript.json"), expectStatus,
    stages: stageResults.map((r) => r.stage),
    setupTurns: stageResults.find((r) => r.stage === "setup")?.reachedAt ?? undefined,
  });

  // Graded review of the softer qualities.
  let grade = "(grader did not run)";
  try {
    const produced = existsSync(join(runDir, "career")) ? walk(join(runDir, "career")).map((f) => `=== ${f.slice(runDir.length + 1)} ===\n${read(f)}`).join("\n\n") : "(nothing was saved)";
    const grader = session(["--disallowedTools", "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Agent,Task,Skill,NotebookEdit"], userDir, opt("user-model", DEFAULT_MODEL));
    const scope = `# What this run covered\n\nStages run: ${stageResults.map((r) => `${r.stage} (${r.outcome})`).join(", ")}. Stages not run: ${Object.keys(STAGES).filter((k) => !stageResults.some((r) => r.stage === k)).join(", ") || "none"}. The conversation was stopped on purpose after the last stage listed. Do not mark the assistant down for work that belongs to a stage that was not run; write "not run" for those items and judge only what was in scope.\n\nHow the test works, so you judge fairly:\n- Entries marked "Stage direction" were given to the simulated person, not the assistant. They are events that really happened in this test (she applied, three weeks passed, she got an interview). The assistant was right to record them when she reported them.\n- The assistant under test ${flag("web") ? "could search the web" : "had no web access"}, could not create Word or PDF files, and had no browser. Saying so plainly and moving on is correct; do not count it as a failure.\n- Stages run in a fixed order chosen by the test. Do not mark the assistant down for that order.`;
    grade = grader.say(`${read(join(HERE, "grader.md"))}\n\n${scope}\n\n# The person (ground truth)\n\n${read(personaPath)}\n\n# The conversation\n\n${md}\n\n# What the assistant saved\n\n${produced}`);
  } catch (e) { grade = `(grader failed: ${e.message})`; }

  const failed = checks.filter((c) => !c.pass).length;
  const report = [
    `# ${name}`, "",
    `Run: ${stamp}. Models: agent ${opt("agent-model", DEFAULT_MODEL)}, simulated user and grader ${opt("user-model", DEFAULT_MODEL)}. Cost: agent $${agent.cost.toFixed(2)}, simulated user $${user.cost.toFixed(2)}.`, "",
    "## Stages", "", ...stageResults.map((s) => `- **${s.stage}:** ${s.outcome} (${s.reachedAt ? `goal met at turn ${s.reachedAt}` : "goal not met"}, ${s.turns} turns run)`), "",
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
