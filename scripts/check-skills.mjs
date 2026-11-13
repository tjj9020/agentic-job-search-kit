#!/usr/bin/env node
// Checks that the plugin manifest and the skills on disk agree:
// every skill folder is listed in plugin.json, every listed path exists,
// and each SKILL.md has a name matching its folder plus a description.

import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const plugin = JSON.parse(readFileSync(new URL(".claude-plugin/plugin.json", root), "utf8"));
const listed = new Set(plugin.skills.map((p) => p.replace(/^\.\/skills\//, "")));
const onDisk = readdirSync(new URL("skills/", root), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const errors = [];
for (const name of onDisk) {
  if (!listed.has(name)) errors.push(`skills/${name} is not listed in plugin.json`);
  const file = new URL(`skills/${name}/SKILL.md`, root);
  if (!existsSync(file)) { errors.push(`skills/${name} has no SKILL.md`); continue; }
  const front = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!front) { errors.push(`skills/${name}/SKILL.md has no frontmatter`); continue; }
  const field = (key) => front[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1].trim();
  if (field("name") !== name) errors.push(`skills/${name}/SKILL.md name is "${field("name")}", expected "${name}"`);
  if (!field("description")) errors.push(`skills/${name}/SKILL.md has no description`);
  if (!existsSync(new URL(`skills/${name}/agents/openai.yaml`, root))) errors.push(`skills/${name} has no agents/openai.yaml`);
}
// Skills are instructions, not programs. Anything other than Markdown and the
// Codex metadata file is rejected, so a contribution cannot smuggle in a script.
const allowed = (rel) => rel.endsWith(".md") || /^[^/]+\/agents\/openai\.yaml$/.test(rel);
const walk = (dir, base = "") =>
  readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(`${dir}${d.name}/`, `${base}${d.name}/`) : [`${base}${d.name}`],
  );
for (const rel of walk("skills/")) {
  if (!allowed(rel)) errors.push(`skills/${rel} is not allowed: skills may contain only .md files and agents/openai.yaml`);
}

// No hidden text: an agent reads what a reviewer cannot see.
const hidden = /<!--|[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u{E0000}-\u{E007F}]/u;
for (const rel of walk("skills/").filter((r) => r.endsWith(".md"))) {
  const text = readFileSync(new URL(`skills/${rel}`, root), "utf8");
  if (hidden.test(text)) errors.push(`skills/${rel} contains an HTML comment or invisible characters`);
}

for (const name of listed) {
  if (!onDisk.includes(name)) errors.push(`plugin.json lists skills/${name}, which does not exist`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${onDisk.length} skills OK`);
