#!/bin/bash
# PostToolUse hook: after the publish workflow is started (or a release-N tag is pushed by hand), remind the session to update docs/PROJECT_CONTEXT.md.
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
wf=$(printf '%s' "$input" | jq -r '.tool_input.workflow_id // .tool_input.resource_id // empty')
started=no
printf '%s' "$cmd" | grep -qE '^\s*(gh workflow run publish|git push[^;&|]*origin[^;&|]*release-[0-9]+)' && started=yes
[ "${wf%.yml}" = "publish" ] && started=yes
[ "$started" = yes ] || exit 0
msg="A release was started. When the publish run is green: note \"live: release-N on <hash>\" in project memory and carry that line into the next slice PR (docs/PROJECT_CONTEXT.md). No separate records PR (owner card, 17 Oct 2026). Mark what is verified [V]."
jq -n --arg m "$msg" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $m}}'
