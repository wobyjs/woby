---
name: cascading-pre-push
description: Cascading git pre-push hooks for monorepo/workspace dependencies. Auto-pushes dirty dependencies before pushing the main package. Use when setting up git hooks for packages that depend on sibling workspace packages, or when configuring pre-push workflows with dependency chains.
---

# Cascading Pre-Push Hooks

Automatically pushes workspace dependencies before pushing the main package, following the dependency chain.

## How It Works

When you push package A that depends on B, which depends on C:

```
git push A
  → A pre-push: B dirty? → trigger B pre-push
    → B pre-push: C dirty? → trigger C pre-push
      → C pre-push: build C, push C
    → B pre-push: build B, test B, push B
  → A pre-push: build B (for A to use), build C
  → A pre-push: test A, push A
```

## Dependency Detection

Dependencies are detected from `package.json` workspace references:

```json
{
  "dependencies": {
    "soby": "workspace:../soby",
    "via.js": "workspace:../via"
  }
}
```

Sibling directories referenced as `workspace:../xxx` are the dependencies to check.

## Setup

### 1. Create Pre-Push Hook

Place this script in `.git/hooks/pre-push` for each package:

```bash
#!/bin/bash
# Pre-push hook: pushes dependencies if dirty, then builds & tests
# Install: copy to .git/hooks/pre-push and chmod +x

PKG_DIR="$(git rev-parse --show-toplevel)"
PARENT_DIR="$(dirname "$PKG_DIR")"

# Define dependencies (update for each package)
DEPS=("soby" "via")

echo "========================================"
echo "  $(basename $PKG_DIR) Pre-Push Hook"
echo "========================================"
echo ""

# Step 1: Push dirty dependencies
for DEP in "${DEPS[@]}"; do
    DEP_DIR="$PARENT_DIR/$DEP"
    echo " Checking $DEP..."

    if [ -d "$DEP_DIR" ]; then
        cd "$DEP_DIR"
        git fetch --quiet

        HAS_CHANGES=false
        # Check uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            HAS_CHANGES=true
        fi
        # Check unpushed commits
        AHEAD=$(git rev-list origin/$(git symbolic-ref --short HEAD)..HEAD --count 2>/dev/null)
        if [ "$AHEAD" -gt 0 ] 2>/dev/null; then
            HAS_CHANGES=true
        fi

        if [ "$HAS_CHANGES" = true ]; then
            echo "   $DEP has changes. Triggering $DEP pre-push..."
            echo ""
            bash .git/hooks/pre-push origin $(git symbolic-ref --short HEAD)
            if [ $? -ne 0 ]; then
                echo "❌ $DEP pre-push failed! Push rejected."
                exit 1
            fi
            echo ""
            echo "   $DEP pushed successfully."
        else
            echo "   $DEP is clean."
        fi
    else
        echo "   $DEP directory not found at $DEP_DIR"
    fi
    echo ""
done

# Step 2: Build dependencies (for current package to use)
echo " Building dependencies..."
for DEP in "${DEPS[@]}"; do
    DEP_DIR="$PARENT_DIR/$DEP"
    if [ -d "$DEP_DIR" ]; then
        cd "$DEP_DIR"
        echo "   Building $DEP..."
        pnpm build
        if [ $? -ne 0 ]; then
            echo "❌ $DEP build failed! Push rejected."
            exit 1
        fi
    fi
done
echo ""

# Step 3: Build & Test current package
echo " Building & testing $(basename $PKG_DIR)..."
cd "$PKG_DIR"

pnpm build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Push rejected."
    exit 1
fi

pnpm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Push rejected."
    exit 1
fi

echo ""
echo "========================================"
echo "  All checks passed!"
echo "========================================"
echo ""
echo "  Proceeding with push..."
echo ""

exit 0
```

### 2. Make Executable

```bash
chmod +x .git/hooks/pre-push
```

### 3. Customize Per Package

Edit the `DEPS` array for each package:

| Package | DEPS Array | Reason |
|---------|------------|--------|
| woby | `("soby" "via")` | Depends on both |
| soby | `("via")` | Depends on via |
| via | `()` | No deps, just build |

## Package-Specific Hooks

### Via.js (no dependencies)

```bash
#!/bin/bash
cd "$(git rev-parse --show-toplevel)"
pnpm build || exit 1
exit 0
```

### Soby (depends on via)

```bash
#!/bin/bash
# Check via first, then build & test soby
PKG_DIR="$(git rev-parse --show-toplevel)"
VIA_DIR="$(dirname $PKG_DIR)/via"

# Push via if dirty
if [ -d "$VIA_DIR" ]; then
    cd "$VIA_DIR"
    if [ -n "$(git status --porcelain)" ]; then
        bash .git/hooks/pre-push origin main
    fi
fi

# Build & test soby
cd "$PKG_DIR"
pnpm build || exit 1
pnpm test || exit 1
exit 0
```

### Woby (depends on soby + via)

Use the full template above with `DEPS=("soby" "via")`.

## For Reference

Full script template: [pre-push-template.sh](scripts/pre-push-template.sh)
