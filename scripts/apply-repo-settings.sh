#!/usr/bin/env bash
# Applies this repository's security settings and rulesets with the GitHub CLI.
# Run it as the repository owner:  bash scripts/apply-repo-settings.sh
# Safe to run more than once. Each step prints OK or FAILED; nothing is assumed.
#
# Rulesets, secret scanning and private vulnerability reporting are only
# available on a public repository under a free plan, so run this right after
# making the repository public.

set -u
REPO="${1:-tjj9020/agentic-job-search-kit}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0

step() { # step "label" command...
  local label="$1"; shift
  local out
  if out="$("$@" 2>&1)"; then
    echo "OK      $label"
  else
    echo "FAILED  $label"
    echo "        $(echo "$out" | head -n 2 | tr '\n' ' ')"
    fail=1
  fi
}

ruleset() { # ruleset "Name" file.json  -> create, or update if it exists
  local name="$1" file="$2" id
  id="$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name==\"$name\") | .id" 2>/dev/null)"
  if [ -n "$id" ]; then
    step "ruleset: $name (updated)" gh api -X PUT "repos/$REPO/rulesets/$id" --input "$file"
  else
    step "ruleset: $name (created)" gh api -X POST "repos/$REPO/rulesets" --input "$file"
  fi
}

command -v gh >/dev/null || { echo "Install the GitHub CLI first: https://cli.github.com"; exit 1; }
echo "Applying settings to $REPO"
echo "Visibility: $(gh api "repos/$REPO" --jq 'if .private then "private" else "public" end')"
echo

# --- General
step "general: wiki off, delete merged branches, no rebase merges" \
  gh api -X PATCH "repos/$REPO" -F has_wiki=false -F delete_branch_on_merge=true \
    -F allow_rebase_merge=false -F allow_auto_merge=false

# --- Rulesets
ruleset "Protect main" "$ROOT/.github/rulesets/protect-main.json"
ruleset "Protect release tags" "$ROOT/.github/rulesets/protect-release-tags.json"

# --- Security features
step "security: Dependabot alerts" gh api -X PUT "repos/$REPO/vulnerability-alerts"
step "security: Dependabot security updates" gh api -X PUT "repos/$REPO/automated-security-fixes"
step "security: private vulnerability reporting" gh api -X PUT "repos/$REPO/private-vulnerability-reporting"
step "security: secret scanning and push protection" \
  gh api -X PATCH "repos/$REPO" --input - <<'JSON'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
JSON

# --- Actions
step "actions: only GitHub's own actions plus the ones listed" \
  gh api -X PUT "repos/$REPO/actions/permissions" -F enabled=true -f allowed_actions=selected
step "actions: allow-list" \
  gh api -X PUT "repos/$REPO/actions/permissions/selected-actions" --input - <<'JSON'
{"github_owned_allowed":true,"verified_allowed":false,"patterns_allowed":["changesets/action@*"]}
JSON
step "actions: read-only token by default; may open pull requests (the Release workflow needs this)" \
  gh api -X PUT "repos/$REPO/actions/permissions/workflow" \
    -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
step "actions: every outside contributor's workflow run needs approval" \
  gh api -X PUT "repos/$REPO/actions/permissions/fork-pr-contributor-approval" \
    -f approval_policy=all_external_contributors

echo
if [ "$fail" -eq 0 ]; then
  echo "All settings applied."
else
  echo "Some steps failed. If the repository is private, make it public and run this again."
  echo "Anything still failing can be set by hand under Settings; see CONTRIBUTING.md > Maintainer setup."
fi
exit "$fail"
