// Tests for the tracker parsing in check.mjs. run.mjs decides whether the
// tracking and interview stages are done from applications(), so a status the
// parser misreads stops a full persona run early (issue #45).
//
//   node --test evals/check.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applications, runChecks, statusWord } from "./check.mjs";

const EXAMPLE = new URL("../examples/jordan-rivera/career", import.meta.url).pathname;

test("statusWord reads the first word of a status cell", () => {
  const cases = {
    "applied": "applied",
    "Applied": "applied",
    "applied 2026-11-18": "applied",
    "applied (2026-11-18, per Maria)": "applied",
    "**applied**": "applied",
    "2026-11-18 applied": "applied",
    "interview Thursday": "interview",
    "not applied": "not",
    "": "",
  };
  for (const [cell, word] of Object.entries(cases)) assert.equal(statusWord(cell), word, `cell "${cell}"`);
});

test("applications() gives the status word and keeps what was written", () => {
  const ledger = [
    "## Applications",
    "Format: date | company | title | URL | status | resume file | notes",
    "Status is one of: drafted, applied, screen, interview, offer, rejected, withdrawn",
    "2026-11-17 | Example Health | Charge Nurse | https://example.com/1 | applied (2026-11-18, per Maria) | applications/example-health-charge-nurse/resume.md |",
    "",
    "## Evaluated roles",
  ].join("\n");
  const [line, ...rest] = applications(ledger);
  assert.equal(rest.length, 0);
  assert.equal(line.status, "applied");
  assert.equal(line.statusText, "applied (2026-11-18, per Maria)");
});

// The worked example with its one status cell replaced, checked as run.mjs would.
function checkExampleWithStatus(cell, expectStatus) {
  const career = mkdtempSync(join(tmpdir(), "jsk-check-test-"));
  try {
    cpSync(EXAMPLE, career, { recursive: true });
    const path = join(career, "job-scout-ledger.md");
    const ledger = readFileSync(path, "utf8");
    const changed = ledger.replace(/\| interview \|/, `| ${cell} |`);
    assert.notEqual(changed, ledger, "the example ledger no longer has an interview status to replace");
    writeFileSync(path, changed);
    const results = runChecks({ career, expectStatus });
    const result = (suffix) => results.find((r) => r.id.endsWith(suffix));
    return { known: result("tracker status is a known value"), follows: result("status follows what the user said happened") };
  } finally {
    rmSync(career, { recursive: true, force: true });
  }
}

test("a status with a date or a note passes the tracker checks", () => {
  for (const [cell, expected] of [["applied 2026-11-18", "applied"], ["applied (2026-11-18, per Maria)", "applied"], ["interview Thursday 2026-11-26", "interview"]]) {
    const { known, follows } = checkExampleWithStatus(cell, expected);
    assert.ok(known.pass, `"${cell}" should be a known status: ${known.detail}`);
    assert.ok(follows.pass, `"${cell}" should count as ${expected}: ${follows.detail}`);
  }
});

test("a status that does not start with a known word still fails", () => {
  const { known, follows } = checkExampleWithStatus("not applied", "applied");
  assert.equal(known.pass, false);
  assert.equal(follows.pass, false);
  assert.match(follows.detail, /found "not applied"/);
});

test("a status for the wrong stage still fails", () => {
  const { known, follows } = checkExampleWithStatus("applied 2026-11-18", "interview");
  assert.ok(known.pass);
  assert.equal(follows.pass, false);
});
