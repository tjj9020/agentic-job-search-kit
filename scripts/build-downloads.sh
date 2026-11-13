#!/usr/bin/env bash
# Builds the files people download to install the kit in a desktop or web app:
# one ZIP per skill (the format Claude and ChatGPT accept for upload), the same
# six packed for Gemini, and one bundle holding all of them plus a short
# instruction file.
#
#   bash scripts/build-downloads.sh [output-dir]     (default: dist)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mkdir -p "${1:-dist}" && cd "${1:-dist}" && pwd)"
rm -f "$OUT"/*.zip "$OUT"/START-HERE.txt
rm -rf "$OUT/gemini"

# Each ZIP has the skill's folder at its top level, as the apps require.
for dir in "$ROOT"/skills/*/; do
  name="$(basename "$dir")"
  (cd "$ROOT/skills" && zip -qr "$OUT/$name.zip" "$name" -x '*.DS_Store')
done

# Gemini wants SKILL.md at the top level of the ZIP, not inside a folder.
# These go in a gemini/ folder inside the bundle only.
mkdir -p "$OUT/gemini"
for dir in "$ROOT"/skills/*/; do
  name="$(basename "$dir")"
  (cd "$dir" && zip -qr "$OUT/gemini/$name.zip" . -x '*.DS_Store')
done

cat > "$OUT/START-HERE.txt" <<'TXT'
Agentic Job Search Kit

This folder holds six small files, one for each part of the kit, and a
"gemini" folder with the same six packed for Gemini. Add all six to your AI
app, then say: "Help me with my job search."

Claude (desktop app or claude.ai)
  1. Open Customize, then Skills.
  2. Click "+", then "Create skill", then "Upload a skill".
  3. Choose one of the six ZIP files. Repeat for the other five.
  If uploading is unavailable, turn on "Code execution and file creation"
  under Settings > Capabilities first.

ChatGPT (desktop app or chatgpt.com)
  1. Open Skills.
  2. Click Create, then "Upload from your computer".
  3. Choose one of the six ZIP files. Repeat for the other five.
  Skills added on desktop do not carry over to the web, or the other way round.

Gemini (gemini.google.com in a web browser, not the phone app)
  Use the six ZIP files in the "gemini" folder, not the ones next to it.
  1. Open the menu, then Customize, then Skills.
  2. Click Create, then Upload.
  3. Choose one of the six ZIP files and click Open.
  4. Click Upload, then Create. Repeat for the other five.

Start with job-search.zip. The order of the rest does not matter.

Full instructions: https://github.com/tjj9020/agentic-job-search-kit
TXT

(cd "$OUT" && zip -qr job-search-kit-skills.zip START-HERE.txt ./*.zip gemini -x job-search-kit-skills.zip)
echo "Built in $OUT:"; ls -1 "$OUT"
