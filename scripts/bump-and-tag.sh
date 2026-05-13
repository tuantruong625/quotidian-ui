#!/usr/bin/env bash
set -euo pipefail

# Bumps version in tokens + core, commits, and creates annotated tag v<semver>.
# Usage: ./scripts/bump-and-tag.sh 0.2.0
#        pnpm release:bump -- 0.2.0   (pnpm forwards a literal "--" as $1; we skip it)

while [[ $# -gt 0 && "$1" == "--" ]]; do
  shift
done

NEW_VERSION="${1:?Usage: $0 <semver>  e.g. 0.2.0}"

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
  echo "Expected semver like 0.2.0 or 1.0.0-rc.1"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOKENS_JSON="$ROOT/packages/tokens/package.json"
CORE_JSON="$ROOT/packages/core/package.json"

command -v jq >/dev/null 2>&1 || {
  echo "jq is required. Install: https://jqlang.github.io/jq/"
  exit 1
}

jq --arg v "$NEW_VERSION" '.version = $v' "$TOKENS_JSON" >"$TOKENS_JSON.tmp" && mv "$TOKENS_JSON.tmp" "$TOKENS_JSON"
jq --arg v "$NEW_VERSION" '.version = $v' "$CORE_JSON" >"$CORE_JSON.tmp" && mv "$CORE_JSON.tmp" "$CORE_JSON"

TAG="v$NEW_VERSION"
git add "$TOKENS_JSON" "$CORE_JSON"
git commit -m "chore: release $NEW_VERSION"
git tag -a "$TAG" -m "Release $NEW_VERSION"

echo "Created commit and tag $TAG."
echo "Push with: git push origin HEAD && git push origin $TAG"
