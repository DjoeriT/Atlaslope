#!/bin/sh
# Installs the local git hooks (not pushed; git keeps hooks per clone). Run once per clone: sh Tools/hooks/install.sh
d="$(git rev-parse --git-common-dir)/hooks"
cp "$(dirname "$0")/pre-commit" "$d/pre-commit" && chmod +x "$d/pre-commit" && echo "installed $d/pre-commit"
