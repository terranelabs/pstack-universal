#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s [--copy] <project-root>\n' "$0" >&2
}

mode=link
if [[ ${1:-} == "--copy" ]]; then
  mode=copy
  shift
fi

if [[ $# -ne 1 ]]; then
  usage
  exit 64
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd -P)
source_dir="$repo_root/plugins/pstack/skills"
project_root=$(CDPATH= cd -- "$1" && pwd -P)
target_dir="$project_root/.agents/skills"

if [[ ! -d "$source_dir" ]]; then
  printf 'Missing pstack skills directory: %s\n' "$source_dir" >&2
  exit 1
fi

mkdir -p "$target_dir"

installed=0
skipped=0
for source_path in "$source_dir"/*; do
  [[ -d "$source_path" ]] || continue
  skill_name=${source_path##*/}
  target_path="$target_dir/$skill_name"

  if [[ -L "$target_path" ]]; then
    existing=$(readlink "$target_path")
    if [[ "$existing" == "$source_path" ]]; then
      skipped=$((skipped + 1))
      continue
    fi
    printf 'Refusing to replace existing link: %s -> %s\n' "$target_path" "$existing" >&2
    exit 1
  fi

  if [[ -e "$target_path" ]]; then
    printf 'Refusing to overwrite existing path: %s\n' "$target_path" >&2
    exit 1
  fi

  if [[ "$mode" == copy ]]; then
    cp -R "$source_path" "$target_path"
  else
    ln -s "$source_path" "$target_path"
  fi
  installed=$((installed + 1))
done

printf 'Installed %d pstack skills into %s (%s mode); %d already present.\n' \
  "$installed" "$target_dir" "$mode" "$skipped"
