import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));

test("ignores installed dependency docs and still validates authored docs", () => {
  const fixture = mkdtempSync(join(tmpdir(), "pstack-validation-"));
  try {
    cpSync(repo, fixture, {
      recursive: true,
      filter: (source) => ![".git", "node_modules"].includes(basename(source)),
    });
    const dependency = join(fixture, "plugins/pstack/skills/poteto-mode/scripts/node_modules/validation-fixture");
    mkdirSync(dependency, { recursive: true });
    writeFileSync(join(dependency, "README.md"), "[Omitted package example](missing-example.js)\n");

    const run = () => spawnSync(process.execPath, [join(fixture, "scripts/validate.mjs")], { encoding: "utf8" });
    const installed = run();
    assert.equal(installed.status, 0, installed.stderr);

    appendFileSync(join(fixture, "plugins/pstack/README.md"), "\n[Missing authored file](missing-authored-file.md)\n");
    const broken = run();
    assert.equal(broken.status, 1, broken.stderr);
    assert.ok(broken.stderr.includes("plugins/pstack/README.md: broken link missing-authored-file.md"), broken.stderr);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
