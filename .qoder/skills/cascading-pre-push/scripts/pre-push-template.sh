#!/bin/bash
# Cascading Pre-Push Hook Template
# 
# This is the full-featured template for packages with dependencies.
# Copy to .git/hooks/pre-push and customize the DEPS array.
#
# Usage:
#   1. Copy to .git/hooks/pre-push
#   2. Edit DEPS array with your dependency names
#   3. chmod +x .git/hooks/pre-push

# ============================================================================
# CONFIGURATION - Edit this for each package
# ============================================================================

# List of dependency directory names (relative to parent directory)
# Example: woby depends on soby and via → DEPS=("soby" "via")
# Example: soby depends on via → DEPS=("via")
# Example: via has no deps → DEPS=()
DEPS=()

# Build command (change if not using pnpm)
BUILD_CMD="pnpm build"

# Test command (change if not using pnpm)
TEST_CMD="pnpm test"

# ============================================================================
# SCRIPT - Do not edit below this line unless you know what you're doing
# ============================================================================

PKG_DIR="$(git rev-parse --show-toplevel)"
PARENT_DIR="$(dirname "$PKG_DIR")"

echo "========================================"
echo "  $(basename "$PKG_DIR") Pre-Push Hook"
echo "========================================"
echo ""

# Step 1: Push dirty dependencies (cascading)
for DEP in "${DEPS[@]}"; do
    DEP_DIR="$PARENT_DIR/$DEP"
    echo " Step: Checking $DEP..."

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
            # Recursively trigger the dependency's pre-push hook
            if [ -f ".git/hooks/pre-push" ]; then
                bash .git/hooks/pre-push origin $(git symbolic-ref --short HEAD)
                if [ $? -ne 0 ]; then
                    echo ""
                    echo "❌ $DEP pre-push failed! $(basename "$PKG_DIR") push rejected."
                    exit 1
                fi
            else
                echo "   Warning: $DEP has no pre-push hook. Pushing directly..."
                git push
            fi
            echo ""
            echo "   $DEP pushed successfully."
        else
            echo "   $DEP is clean."
        fi
    else
        echo "   Warning: $DEP directory not found at $DEP_DIR"
    fi
    echo ""
done

# Step 2: Build dependencies (so current package can use them)
if [ ${#DEPS[@]} -gt 0 ]; then
    echo " Step: Building dependencies..."
    for DEP in "${DEPS[@]}"; do
        DEP_DIR="$PARENT_DIR/$DEP"
        if [ -d "$DEP_DIR" ]; then
            cd "$DEP_DIR"
            echo "   Building $DEP..."
            eval "$BUILD_CMD"
            if [ $? -ne 0 ]; then
                echo ""
                echo "❌ $DEP build failed! Push rejected."
                exit 1
            fi
        fi
    done
    echo ""
fi

# Step 3: Build current package
echo " Step: Building $(basename "$PKG_DIR")..."
cd "$PKG_DIR"

eval "$BUILD_CMD"
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Push rejected."
    exit 1
fi
echo "   Build succeeded."

# Step 4: Test current package
echo " Step: Testing $(basename "$PKG_DIR")..."
eval "$TEST_CMD"
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed! Push rejected."
    echo "   Fix the issues and try again."
    echo "   Or use 'git push --no-verify' to bypass (not recommended)."
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
