#!/bin/bash
# PostToolUse hook: after the publish workflow is started (or a release-N tag is pushed by hand), remind the session to update docs/PROJECT_CONTEXT.md.
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
wf=$(printf '%s' "$input" | jq -r '.tool_input.workflow_id // .tool_input.resource_id // empty')
started=no
printf '%s' "$cmd" | grep -qE '^\s*(gh workflow run publish|git push[^;&|]*origin[^;&|]*release-[0-9]+)' && started=yes
[ "${wf%.yml}" = "publish" ] && started=yes
[ "$started" = yes ] || exit 0
msg="A release was started. When the publish run is green: update docs/PROJECT_CONTEXT.md (snapshot date, releases section with tag, commit, live URL, tester note, and what this release changed). Mark what is verified [V]. Sweep the file and the memory notes for anything this release made untrue. Land it through a pull request."
jq -n --arg m "$msg" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $m}}'
