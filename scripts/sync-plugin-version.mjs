#!/usr/bin/env node
// Keeps .claude-plugin/plugin.json on the same version as package.json.
// Plugin installs only update when plugin.json's version changes, so the two
// must never drift. Runs after `changeset version`. With --check it writes
// nothing and exits 1 on a mismatch.

import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const pluginUrl = new URL(".claude-plugin/plugin.json", root);

const { version } = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const text = readFileSync(pluginUrl, "utf8");
const current = JSON.parse(text).version;

if (current === version) {
  console.log(`plugin.json is at ${version}, in sync`);
  process.exit(0);
}

if (process.argv.includes("--check")) {
  console.error(`plugin.json is at ${current} but package.json is at ${version}. Run: node scripts/sync-plugin-version.mjs`);
  process.exit(1);
}

// Replace just the version value so the file's formatting is untouched.
const next = text.replace(/("version"\s*:\s*")[^"]*"/, `$1${version}"`);
if (JSON.parse(next).version !== version) {
  console.error("No version field found in plugin.json");
  process.exit(1);
}
writeFileSync(pluginUrl, next);
console.log(`plugin.json ${current} -> ${version}`);
