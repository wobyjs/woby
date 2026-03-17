# 🚀 Woby v2.0.5 Release Checklist

**Target**: Promote `redo-retest-2` → `main`  
**Version**: 2.0.5  
**Date**: March 17, 2026

---

## ⚠️ CRITICAL: Order of Operations

**CORRECT ORDER:**
```
1. Swap branches (redo-retest-2 → main) ← DO THIS FIRST
2. Create release commit & tag
3. Push to remote
4. Create GitHub Release
```

**WRONG ORDER (DON'T DO THIS):**
```
❌ Release first, then swap branches
```

---

## ✅ Phase 1: Branch Swap (BEFORE Release)

### Option A: Automated Script (Recommended)

```powershell
.\swap-branches.ps1
```

This script will:
1. ✅ Check working directory is clean
2. ✅ Rename `main` → `old-main` (locally)
3. ✅ Rename `redo-retest-2` → `main` (locally)
4. ✅ Delete remote `main` branch
5. ✅ Delete remote `redo-retest-2` branch
6. ✅ Push new `main` to remote
7. ✅ Optionally push `old-main` as backup

### Option B: Manual Commands

```bash
# 1. Ensure you're on redo-retest-2
git checkout redo-retest-2

# 2. Commit any pending changes
git add .
git commit -m "Final changes before branch swap"

# 3. Rename locally
git branch -m main old-main
git branch -m redo-retest-2 main

# 4. Verify current branch
git branch --show-current  # Should show "main"

# 5. Delete remote branches
git push origin --delete main
git push origin --delete redo-retest-2

# 6. Push new main
git push -u origin main

# 7. (Optional) Push old-main as backup
git push -u origin old-main
```

### Verification After Swap

```bash
# Check local branches
git branch
# Expected output:
#   old-main
# * main    <- You should be here
#   other-branches...

# Check remote tracking
git branch -a
# Should show:
#   remotes/origin/main  <- Points to your v2.0.5 code
#   remotes/origin/old-main
```

---

## ✅ Phase 2: Create Release (AFTER Branch Swap)

### Step 1: Verify You're on Main

```bash
git branch --show-current  # Must show "main"
```

### Step 2: Update Release Files

Make sure these files reflect the correct version:
- ✅ `package.json` shows `"version": "2.0.5"` (already done)
- ✅ `CHANGELOG-v2.md` mentions v2.0.5
- ✅ `RELEASE-NOTES-v2.0.0.md` updated to v2.0.5

### Step 3: Stage Release Files

```bash
git add package.json CHANGELOG-v2.md RELEASE-NOTES-v2.0.0.md
```

### Step 4: Create Release Commit

```bash
git commit -m "release: v2.0.5 - Major SSR & Custom Elements Release

See CHANGELOG-v2.md for details"
```

### Step 5: Create Git Tag

```bash
git tag -a "v2.0.5" -m "Woby v2.0.5 - Major SSR & Custom Elements Release"
```

### Step 6: Push Everything

```bash
# Push the commit
git push origin main

# Push the tags
git push origin --tags
```

---

## ✅ Phase 3: GitHub Release

### Option A: Via Website (Manual)

1. Go to: https://github.com/wobyjs/woby/releases/new
2. **Tag version**: Select `v2.0.5` from dropdown
3. **Release title**: `Woby v2.0.5`
4. **Description**: Copy content from `RELEASE-NOTES-v2.0.0.md`
5. **Target branch**: Should show `main` (this is why we swapped first!)
6. Click **"Publish release"**

### Option B: Via gh CLI (Automated)

If you have GitHub CLI installed:

```bash
gh release create v2.0.5 \
  --title "Woby v2.0.5" \
  --notes-file RELEASE-NOTES-v2.0.0.md \
  --target main \
  --verify-tag
```

---

## ✅ Phase 4: Post-Release Verification

### Check Git Tags

```bash
git tag -l | findstr v2.0.5
# Should show: v2.0.5
```

### Check GitHub

1. Visit: https://github.com/wobyjs/woby/tags
2. Verify `v2.0.5` tag exists and points to main branch

### Check Releases Page

1. Visit: https://github.com/wobyjs/woby/releases
2. Verify v2.0.5 release appears
3. Verify it shows "Latest release" badge

### Check npm (if publishing)

```bash
npm view woby
# Should show version 2.0.5
```

---

## 🆘 Emergency Rollback

If something goes wrong during branch swap:

### Before Remote Operations

```bash
# Just rename back locally
git branch -m main redo-retest-2
git branch -m old-main main
```

### After Remote Operations (More Complex)

```bash
# Restore remote redo-retest-2
git checkout old-main
git push -u origin redo-retest-2

# Restore remote main
git checkout main
git push -u origin main

# Then rename locally back
git checkout main
git branch -m main old-main-temp
git branch -m redo-retest-2 main
```

---

## 📊 Summary Timeline

```
START
  │
  ├─→ [Phase 1] Swap Branches
  │   ├─ Local rename (main → old-main, redo-retest-2 → main)
  │   ├─ Delete remote branches
  │   └─ Push new main
  │
  ├─→ [Phase 2] Create Release
  │   ├─ Commit release files
  │   ├─ Create v2.0.5 tag
  │   └─ Push to remote
  │
  ├─→ [Phase 3] GitHub Release
  │   ├─ Create release page
  │   └─ Add release notes
  │
  └─→ [Phase 4] Verify
      ├─ Check tags
      ├─ Check GitHub
      └─ Publish to npm (optional)

END ✓
```

---

## 🎯 Quick Command Reference

### Complete Sequence (Copy-Paste Ready)

```powershell
# === PHASE 1: SWAP BRANCHES ===
.\swap-branches.ps1

# === PHASE 2: CREATE RELEASE ===
git add package.json CHANGELOG-v2.md RELEASE-NOTES-v2.0.0.md
git commit -m "release: v2.0.5 - Major SSR & Custom Elements Release"
git tag -a "v2.0.5" -m "Woby v2.0.5"
git push origin main
git push origin --tags

# === PHASE 3: GITHUB RELEASE ===
# Manual: Go to https://github.com/wobyjs/woby/releases/new
# OR automated if gh CLI installed:
# gh release create v2.0.5 --title "Woby v2.0.5" --notes-file RELEASE-NOTES-v2.0.0.md

# === PHASE 4: VERIFY ===
git tag -l
git branch -a
```

---

## 🔗 Important Links

- **Branch Swap Script**: [`swap-branches.ps1`](./swap-branches.ps1)
- **Release Script**: [`release-v2.ps1`](./release-v2.ps1)
- **Full Release Guide**: [`RELEASE-GUIDE.md`](./RELEASE-GUIDE.md)
- **Release Notes**: [`RELEASE-NOTES-v2.0.0.md`](./RELEASE-NOTES-v2.0.0.md)
- **Changelog**: [`CHANGELOG-v2.md`](./CHANGELOG-v2.md)

---

## ✨ Final Checklist

Before executing, verify:

- [ ] Working directory is clean (no uncommitted changes)
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] You're currently on `redo-retest-2` branch
- [ ] `package.json` shows version `2.0.5`
- [ ] Release documentation files exist
- [ ] GitHub credentials configured (for pushing)

---

**Ready? Start with Phase 1:**

```powershell
.\swap-branches.ps1
```

Good luck! 🎉
