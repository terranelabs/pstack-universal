#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd -P)
plugin_dir="$repo_root/plugins/pstack"

node "$script_dir/validate.mjs"
node --test "$script_dir/validate.test.mjs"

if command -v claude >/dev/null 2>&1; then
  claude plugin validate --strict "$plugin_dir"
else
  printf 'SKIP Claude plugin validation: claude is not installed.\n'
fi

if [[ -d "$plugin_dir/skills/poteto-mode/scripts" ]]; then
  if command -v bun >/dev/null 2>&1; then
    npm --prefix "$plugin_dir/skills/poteto-mode/scripts" test
  else
    printf 'SKIP bundled TypeScript tests: bun is not installed.\n'
  fi
fi
