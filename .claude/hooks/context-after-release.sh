#!/bin/bash
# PostToolUse hook: after the publish workflow is started (or a release-N tag is pushed by hand), remind the session what to do when it ends.
# Updated 20 Oct 2026 (owner): it used to ask for a "live: release-N" line, which CLAUDE.md forbids since 18 Oct (the tag is the record).
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
wf=$(printf '%s' "$input" | jq -r '.tool_input.workflow_id // .tool_input.resource_id // empty')
started=no
printf '%s' "$cmd" | grep -qE '^\s*(gh workflow run publish|git push[^;&|]*origin[^;&|]*release-[0-9]+)' && started=yes
[ "${wf%.yml}" = "publish" ] && started=yes
[ "$started" = yes ] || exit 0
msg="A release was started. Wait for the run's completion notification (no polling). When it is green: check the live site, then send the owner one message (release N live, tag, hash, URL, checks, what was not verified) and the tester note. Write no \"live on release-N\" line anywhere: the tag is the record (CLAUDE.md). The tester note and handoff belong in the slice PR; a wrong record is fixed in the next slice's PR, not a records PR (owner card, 17 Oct 2026). Mark what is verified [V]."
jq -n --arg m "$msg" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $m}}'
