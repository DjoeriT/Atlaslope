#!/bin/bash
# Usage: Tools/check.sh          (add "quick" to skip the build and the UI tests; "ui" to also run the Playwright UI tests: always before a release)
set -u
cd "$(dirname "$0")/.."
failed=()

run() {   # run "name" "summary grep pattern" command...
  local name=$1 pattern=$2; shift 2
  printf '\n== %s\n' "$name"
  local out code
  out=$("$@" 2>&1); code=$?
  printf '%s\n' "$out" | grep -E "$pattern" | tail -3
  if [ "$code" -ne 0 ]; then
    printf 'FAILED (exit %s): %s\n' "$code" "$name"; printf '%s\n' "$out" | tail -25; failed+=("$name")
  fi
}

run "Typecheck" "error|Found [0-9]+ error" npx tsc --noEmit
run "Unit tests" "Tests +[0-9]+|passed|failed" npx vitest run --reporter=dot
run "Data ledger" "." bash -c '
  missing=0
  for f in $(git ls-files data | grep -vE "SOURCES.md|\.gitkeep"); do
    grep -q -- "$(basename "$f")" data/SOURCES.md || { echo "not in data/SOURCES.md: $f"; missing=1; }
  done
  [ $missing -eq 0 ] && echo "every data file has a source entry"; exit $missing'

if [ "${1:-}" != "quick" ]; then
  run "Build" "built in|error" npx vite build
  run "Production build has no debug flags" "." bash -c '
    [ -d dist ] || { echo "no dist/"; exit 1; }
    if grep -rEl "fixture=|fresh=1" dist/assets 2>/dev/null; then echo "debug flags found in dist/"; exit 1; fi
    echo "clean"'
  if [ "${1:-}" = "ui" ]; then
    run "UI tests" "passed|failed|flaky" npx playwright test
  fi
fi

echo
if [ ${#failed[@]} -eq 0 ]; then echo "ALL CHECKS PASSED"; else echo "FAILED: ${failed[*]}"; exit 1; fi
