#!/bin/bash
# PreToolUse hook on Read: refuse whole-file reads of the large files (see docs/AGENT_ROLES.md, Token budget, and the brief's token discipline).
input=$(cat)
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
has_range=$(printf '%s' "$input" | jq -r 'if (.tool_input.offset != null or .tool_input.limit != null) then "yes" else "no" end')
case "$path" in
  */data.js|*/maplibre-gl.js|*/data/*.geojson|*.tif)   # never read, not even a range: use jq, ogrinfo or a script that prints a summary
    echo "Never open this file: it is large generated data. Query it with jq or a script that prints a short summary." >&2
    exit 2 ;;
esac
[ "$has_range" = "yes" ] && exit 0
case "$path" in
  */docs/PROJECT_CONTEXT.md|*/docs/scope.md|*/docs/architecture-decisions.md|*/Review/builder-brief.md)
    echo "Large file: read only the lines you need (or the release digest). Use grep -n first, then Read with offset and limit." >&2
    exit 2 ;;
esac
exit 0
