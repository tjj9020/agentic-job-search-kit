#!/usr/bin/env node
// Deterministic checks on what the kit produced. No AI involved: these either
// hold or they don't. Used by run.mjs after a simulated session, and runnable
// on its own against any career/ folder:
//
//   node evals/check.mjs --career examples/jordan-rivera/career
//   node evals/check.mjs --career <dir> --persona evals/personas/<name>.md --transcript <run>/transcript.json

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

// Filler that marks a resume as machine-written. A voice profile can add more.
const DEFAULT_BANNED = [
  "spearheaded", "leveraged", "leveraging", "orchestrated", "championed", "synergy", "synergies",
  "robust", "seamless", "seamlessly", "cutting-edge", "passionate", "results-driven",
  "proven track record", "transformative", "innovative", "fast-paced environment", "dynamic",
  "detail-oriented", "team player", "go-getter", "think outside the box", "best-in-class",
  "world-class", "utilize", "utilized", "delve", "i am excited to apply", "i am writing to express",
];

// Words an agent should never say to someone who is new to AI.
const JARGON = [
  /\bSKILL\.md\b/i, /\bskills?\b(?= (tool|file|folder))/i, /\bplugin\b/i, /\bmarkdown\b/i, /\bprompt(s|ing)?\b/i,
  /\bcontext window\b/i, /\bfrontmatter\b/i, /\b[a-z-]+\.(md|json|yaml)\b/i, /(^|\s)\/[a-z]+(-[a-z]+)+\b/,
  /\bstory bank\b/i, /\bvoice profile\b/i, /\bledger\b/i, /\bphase [123]\b/i, /\.gitignore/i,
];

/** Every number in the text, reduced to its digits ("$9.4M" -> "9.4", "1,400+" -> "1400"). */
export function numbers(text) {
  return [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => ({
    raw: m[0],
    value: m[0].replace(/,/g, "").replace(/\.$/, ""),
    percent: text.slice(m.index + m[0].length, m.index + m[0].length + 2).trimStart().startsWith("%"),
    at: text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 25).replace(/\s+/g, " ").trim(),
  }));
}

/** Parse the ```json block at the top of a persona file. */
export function personaConfig(path) {
  const m = read(path).match(/```json\n([\s\S]*?)\n```/);
  return m ? JSON.parse(m[1]) : {};
}

function bannedFromVoiceProfile(voice) {
  const words = [];
  for (const line of voice.split("\n")) {
    const m = line.match(/^(?:Banned|.*additions?)[^:]*:\s*(.+)$/i);
    if (!m) continue;
    for (const part of m[1].split(/[,;]/)) {
      const w = part.replace(/["“”.()]/g, "").replace(/\bTest\b.*$/, "").trim().toLowerCase();
      if (w && w.length > 2 && w.split(" ").length <= 4 && !w.includes("default list")) words.push(w);
    }
  }
  return words;
}

export function runChecks({ career, personaPath, transcriptPath }) {
  const results = [];
  const add = (id, pass, detail = "") => results.push({ id, pass, detail });
  const persona = personaPath ? personaConfig(personaPath) : {};

  const base = read(join(career, "resume-base.md"));
  const criteria = read(join(career, "search-criteria.md"));
  const stories = read(join(career, "resume-story-bank.md"));
  const voice = read(join(career, "resume-voice-profile.md"));
  const ledger = read(join(career, "job-scout-ledger.md"));

  // 1. The documents exist.
  for (const [name, text] of [["resume", base], ["search criteria", criteria], ["story bank", stories], ["voice profile", voice]]) {
    add(`exists: ${name}`, text.length > 0, text.length ? "" : "missing");
  }

  // 2. The base resume is the user's text, not a rewrite.
  if (persona.resume_must_contain) {
    const missing = persona.resume_must_contain.filter((s) => !base.includes(s));
    add("base resume kept word for word", missing.length === 0, missing.length ? `missing lines: ${missing.join(" | ")}` : "");
  }

  // 3. Each tailored resume.
  const appsDir = join(career, "applications");
  const apps = existsSync(appsDir) ? readdirSync(appsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  const banned = [...new Set([...DEFAULT_BANNED, ...bannedFromVoiceProfile(voice)])];
  const sources = `${base}\n${stories}\n${criteria}`;
  const known = new Set(numbers(sources).map((n) => n.value));

  for (const app of apps) {
    const resume = read(join(appsDir, app, "resume.md"));
    const note = read(join(appsDir, app, "note.md"));
    if (!resume) { add(`${app}: resume saved`, false, "no resume.md"); continue; }
    add(`${app}: resume saved`, true);

    // Every number on the resume traces to something the user confirmed.
    // A percentage may also be the complement of a confirmed one (2.1% wrong = 97.9% right).
    const untraced = numbers(resume).filter((n) => {
      if (known.has(n.value)) return false;
      if (n.percent) {
        const c = String(Math.round((100 - Number(n.value)) * 100) / 100);
        if (known.has(c)) return false;
      }
      return true;
    });
    add(`${app}: every number traces to the user's own facts`, untraced.length === 0,
      untraced.map((n) => `"${n.raw}" in "...${n.at}..."`).join("; "));

    // No filler, in the resume or the note.
    const lower = `${resume}\n${note}`.toLowerCase();
    const hits = banned.filter((w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(lower));
    add(`${app}: no filler or banned words`, hits.length === 0, hits.join(", "));

    // Bullets are not all one shape (the main machine-written tell).
    const bullets = resume.split("\n").filter((l) => /^\s*[-*•]\s+/.test(l)).map((l) => l.trim().split(/\s+/).length);
    if (bullets.length >= 4) {
      const spread = Math.max(...bullets) - Math.min(...bullets);
      add(`${app}: bullets vary in length`, spread >= 8, `word counts: ${bullets.join(", ")}`);
    }

    // The application was tracked.
    add(`${app}: application logged in the tracker`, /## Applications[\s\S]*\|/.test(ledger) && ledger.split("## Applications")[1]?.split("\n## ")[0].split("\n").some((l) => l.includes("|") && !/^Format|^Status/.test(l.trim())), "");
  }
  if (persona.expects_application) add("a tailored resume was produced", apps.length > 0, apps.length ? "" : "no applications/ folder");

  // 4. Things the user said were NOT true never appear anywhere.
  if (persona.must_not_appear) {
    // Only what would be sent out: the saved resume may legitimately quote the old claim.
    const all = apps.flatMap((a) => readdirSync(join(appsDir, a)).map((f) => read(join(appsDir, a, f)))).join("\n").toLowerCase();
    const found = persona.must_not_appear.filter((s) => all.includes(s.toLowerCase()));
    add("no inflated or invented claims in anything to be sent", found.length === 0, found.join(" | "));
  }

  // 5. Unknowns stayed unknown.
  if (persona.unknown_facts) {
    const all = [stories, ...apps.map((a) => read(join(appsDir, a, "resume.md")))].join("\n").toLowerCase();
    const found = persona.unknown_facts.filter((s) => all.includes(s.toLowerCase()));
    add("facts the user did not know were not filled in", found.length === 0, found.join(" | "));
  }

  // 6. The conversation itself.
  if (transcriptPath && existsSync(transcriptPath)) {
    const turns = JSON.parse(read(transcriptPath)).filter((t) => t.role === "agent");
    const jargon = [];
    let multi = 0;
    for (const t of turns) {
      for (const re of JARGON) { const m = t.text.match(re); if (m) jargon.push(`turn ${t.n}: "${m[0].trim()}"`); }
      // Count questions outside quoted examples. More than two means the user got a questionnaire.
      const q = (t.text.replace(/["“][^"”]*["”]/g, "").match(/\?/g) || []).length;
      if (q > 2) multi++;
    }
    add("agent used plain words (no jargon, file names or commands)", jargon.length === 0, jargon.slice(0, 8).join("; "));
    add("agent asked one question at a time", multi <= Math.ceil(turns.length * 0.1), `${multi} of ${turns.length} turns asked more than two questions`);
  }

  return results;
}

export function format(results) {
  const lines = results.map((r) => `${r.pass ? "PASS" : "FAIL"}  ${r.id}${r.pass || !r.detail ? "" : `\n      ${r.detail}`}`);
  const failed = results.filter((r) => !r.pass).length;
  lines.push("", failed ? `${failed} of ${results.length} checks failed` : `All ${results.length} checks passed`);
  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (name) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };
  const career = arg("career");
  if (!career) { console.error("usage: node evals/check.mjs --career <dir> [--persona <file>] [--transcript <file>]"); process.exit(2); }
  const results = runChecks({ career, personaPath: arg("persona"), transcriptPath: arg("transcript") });
  console.log(format(results));
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}
