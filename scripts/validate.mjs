import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const plugin = path.join(repo, "plugins", "pstack");
const failures = [];

function fail(message) {
  failures.push(message);
}

function readJson(relativePath) {
  const absolutePath = path.join(repo, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return null;
  }
}

const manifests = [
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "plugins/pstack/plugin.json",
  "plugins/pstack/.codex-plugin/plugin.json",
  "plugins/pstack/.claude-plugin/plugin.json",
  "plugins/pstack/.cursor-plugin/plugin.json",
];

for (const manifest of manifests) readJson(manifest);

const skillsDir = path.join(plugin, "skills");
const skills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skill of skills) {
  const file = path.join(skillsDir, skill, "SKILL.md");
  if (!fs.existsSync(file)) {
    fail(`skills/${skill}: missing SKILL.md`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    fail(`skills/${skill}/SKILL.md: missing YAML frontmatter`);
    continue;
  }
  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name) fail(`skills/${skill}/SKILL.md: missing name`);
  if (!description) fail(`skills/${skill}/SKILL.md: missing description`);
}

function walk(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(absolutePath));
    else result.push(absolutePath);
  }
  return result;
}

for (const file of walk(plugin).filter((candidate) => candidate.endsWith(".md"))) {
  const text = fs.readFileSync(file, "utf8");
  const linkPattern = /\[[^\]]*\]\((?!https?:|#|mailto:)([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const target = match[1].split("#", 1)[0];
    if (
      !target ||
      target === "url" ||
      target.includes("<") ||
      target.includes(">") ||
      target.includes("{") ||
      target.includes("}")
    ) continue;
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) {
      fail(`${path.relative(repo, file)}: broken link ${match[1]}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`FAIL ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Validated ${manifests.length} JSON files and ${skills.length} skills.\n`);
