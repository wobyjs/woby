# Woby v2.0.0 Release Guide

This document provides step-by-step instructions for releasing Woby v2.0.0.

---

## 📋 Pre-Release Checklist

Before starting the release process, ensure:

- [ ] All tests pass (`pnpm test`)
- [ ] Build completes successfully (`pnpm build`)
- [ ] Documentation is up to date
- [ ] CHANGELOG-v2.md is complete
- [ ] RELEASE-NOTES-v2.0.0.md is ready
- [ ] No uncommitted changes in working directory

---

## 🚀 Automated Release (Recommended)

Run the automated release script:

```powershell
.\release-v2.ps1
```

The script will:
1. Verify you're on the correct branch
2. Check for clean working directory
3. Update package.json version
4. Create release commit
5. Create git tag
6. Push to remote (optional)
7. Provide GitHub release instructions

---

## 🔧 Manual Release Process

If you prefer manual control, follow these steps:

### Step 1: Update Version in package.json

```bash
# Navigate to woby directory
cd d:\Developments\tslib\@woby\woby

# Edit package.json and change version from "1.58.41" to "2.0.0"
# Or use PowerShell:
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$packageJson.version = "2.0.0"
$packageJson | ConvertTo-Json -Depth 100 | Out-File package.json -Encoding utf8
```

### Step 2: Stage Release Files

```bash
git add package.json CHANGELOG-v2.md RELEASE-NOTES-v2.0.0.md
```

### Step 3: Create Release Commit

```bash
git commit -m "release: v2.0.0 - Major SSR & Custom Elements Release

See CHANGELOG-v2.md for details"
```

### Step 4: Create Git Tag

```bash
git tag -a "v2.0.0" -m "Woby v2.0.0 - Major SSR & Custom Elements Release"
```

### Step 5: Push to Remote

```bash
# Push the branch
git push origin redo-retest-2

# Push the tags
git push origin --tags
```

### Step 6: Merge to Main (Optional)

If you want to merge this release into main:

```bash
# Checkout main
git checkout main

# Merge the release branch
git merge redo-retest-2

# Push main
git push origin main
```

---

## 📝 GitHub Release

### Create Release on GitHub

1. **Navigate to Releases**
   - Go to: https://github.com/wobyjs/woby/releases/new

2. **Select Tag**
   - Choose tag: `v2.0.0`
   - If not listed, create new tag: `v2.0.0`

3. **Release Title**
   ```
   Woby v2.0.0
   ```

4. **Release Description**
   - Copy content from `RELEASE-NOTES-v2.0.0.md`
   - Paste into the description field

5. **Set as Latest Release**
   - ✅ Check "Set as the latest release"

6. **Publish**
   - Click "Publish release" button

---

## 📦 npm Publishing (Optional)

If you want to publish to npm:

```bash
# Login to npm (if not already logged in)
npm login

# Publish to npm
npm publish --access public

# Or using pnpm
pnpm publish --access public
```

---

## ✅ Post-Release Tasks

After the release is complete:

### 1. Verify Release

- Check GitHub releases page
- Verify tag exists: `git tag -l | findstr v2.0.0`
- Check npm package (if published): `npm view woby`

### 2. Update Documentation

- Ensure docs reflect v2.0.0
- Update any version references in README
- Verify migration guides are accurate

### 3. Announce Release

- Update project homepage
- Share on social media
- Notify community

---

## 🔄 Rollback Procedure

If something goes wrong and you need to rollback:

### Delete Tag (Local & Remote)

```bash
# Delete local tag
git tag -d v2.0.0

# Delete remote tag
git push origin :refs/tags/v2.0.0

# Delete release commit (if already pushed)
git reset --hard HEAD~1
git push origin redo-retest-2 --force
```

### Restore Previous Version

```bash
# Revert package.json to previous version
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$packageJson.version = "1.58.41"
$packageJson | ConvertTo-Json -Depth 100 | Out-File package.json -Encoding utf8

git add package.json
git commit -m "revert: rollback to v1.58.41"
git push origin redo-retest-2
```

---

## 📊 Release Statistics

- **Files Changed**: 1,810
- **Lines Added**: +68,167
- **Lines Removed**: -15,502
- **Net Change**: +52,665 lines
- **Commits**: 40 since v1.58.41

---

## 🔗 Quick Links

- **Changelog**: [CHANGELOG-v2.md](./CHANGELOG-v2.md)
- **Release Notes**: [RELEASE-NOTES-v2.0.0.md](./RELEASE-NOTES-v2.0.0.md)
- **GitHub Compare**: https://github.com/wobyjs/woby/compare/v1.58.41...v2.0.0
- **Documentation**: [doc/](./doc/)

---

## 🆘 Need Help?

If you encounter issues during the release process:

1. Check that all pre-release tasks are complete
2. Ensure you have proper Git permissions
3. Verify network connectivity for pushes
4. Review Git status before each step
5. Don't hesitate to ask for help from the team

---

**Good luck with the v2.0.0 release! 🎉**
