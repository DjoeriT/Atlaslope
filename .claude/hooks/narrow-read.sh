#!/bin/bash
# PreToolUse hook on Read: refuse whole-file reads of the large files (see docs/AGENT_ROLES.md, Token budget).
input=$(cat)
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
has_range=$(printf '%s' "$input" | jq -r 'if (.tool_input.offset != null or .tool_input.limit != null) then "yes" else "no" end')
[ "$has_range" = "yes" ] && exit 0
case "$path" in
  */docs/PROJECT_CONTEXT.md)   # add large data files here as they appear
    echo "Large file: read only the lines you need. Use grep -n first, then Read with offset and limit." >&2
    exit 2 ;;
esac
exit 0
