#!/bin/bash
# PostToolUse hook on Bash: after a release-N tag is pushed, remind the session to update docs/PROJECT_CONTEXT.md.
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
tag=$(printf '%s' "$cmd" | grep -oE 'git push[^;&|]*origin[^;&|]*release-[0-9]+' | grep -oE 'release-[0-9]+' | head -1)
[ -z "$tag" ] && exit 0
msg="$tag was pushed. Now update docs/PROJECT_CONTEXT.md: snapshot date, section 5 (releases, tags with commit, live URL, tester note), and sections 6 to 8 for what this release changed. Mark what is verified [V]. Then sweep the whole file and the memory notes for anything this release made untrue. Commit it on its own and push main."
jq -n --arg m "$msg" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $m}}'
