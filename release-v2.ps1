#!/usr/bin/env pwsh

# Woby v2.0.0 Release Script
# This script automates the Git release process for v2.0.0

Write-Host "🚀 Starting Woby v2.0.0 Release Process" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Configuration
$VERSION = "2.0.5"
$BRANCH = "redo-retest-2"
$MAIN_BRANCH = "main"

# Step 1: Check current branch
Write-Host "`n📍 Step 1: Checking current branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne $BRANCH) {
    Write-Host "⚠️  Warning: You're on branch '$currentBranch', expected '$BRANCH'" -ForegroundColor Red
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        Write-Host "❌ Release cancelled" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ On correct branch: $BRANCH" -ForegroundColor Green
}

# Step 2: Ensure working directory is clean
Write-Host "`n🧹 Step 2: Checking working directory status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Warning: Working directory has uncommitted changes" -ForegroundColor Red
    Write-Host $status
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        Write-Host "❌ Release cancelled" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Working directory is clean" -ForegroundColor Green
}

# Step 3: Update package.json version
Write-Host "`n📦 Step 3: Updating package.json version..." -ForegroundColor Yellow
$packageJsonPath = Join-Path $PSScriptRoot "package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

$oldVersion = $packageJson.version
Write-Host "Current version: $oldVersion" -ForegroundColor Gray
Write-Host "New version: $VERSION" -ForegroundColor Green

$packageJson.version = $VERSION
$packageJson | ConvertTo-Json -Depth 100 | Out-File $packageJsonPath -Encoding utf8
Write-Host "✅ package.json updated" -ForegroundColor Green

# Step 4: Stage and commit changes
Write-Host "`n💾 Step 4: Staging release files..." -ForegroundColor Yellow
git add package.json
git add CHANGELOG-v2.md
git add RELEASE-NOTES-v2.0.0.md

Write-Host "`n✍️  Step 5: Creating release commit..." -ForegroundColor Yellow
$commitMessage = "release: v$VERSION - Major SSR & Custom Elements Release`n`nSee CHANGELOG-v2.md for details"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Commit may have failed or no changes to commit" -ForegroundColor Yellow
}

# Step 6: Create git tag
Write-Host "`n🏷️  Step 6: Creating git tag..." -ForegroundColor Yellow
git tag -a "v$VERSION" -m "Woby v$VERSION - Major SSR & Custom Elements Release"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tag v$VERSION created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create tag" -ForegroundColor Red
    exit 1
}

# Step 7: Push to remote
Write-Host "`n📤 Step 7: Pushing to remote..." -ForegroundColor Yellow
Write-Host "This will push commits and tags to origin" -ForegroundColor Gray
$confirm = Read-Host "Push to origin? (y/n)"

if ($confirm -eq 'y') {
    Write-Host "Pushing branch..." -ForegroundColor Gray
    git push origin $BRANCH
    
    Write-Host "Pushing tags..." -ForegroundColor Gray
    git push origin --tags
    
    Write-Host "✅ Pushed to remote" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipping push (you can push manually later)" -ForegroundColor Yellow
    Write-Host "   Manual commands:" -ForegroundColor Gray
    Write-Host "   git push origin $BRANCH" -ForegroundColor Cyan
    Write-Host "   git push origin --tags" -ForegroundColor Cyan
}

# Step 8: GitHub Release instructions
Write-Host "`n🎉 Step 8: GitHub Release Instructions" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`n✅ Release preparation complete!" -ForegroundColor Green
Write-Host "`nTo create the GitHub release:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/wobyjs/woby/releases/new" -ForegroundColor White
Write-Host "2. Select tag: v$VERSION" -ForegroundColor White
Write-Host "3. Release title: Woby v$VERSION" -ForegroundColor White
Write-Host "4. Copy content from: RELEASE-NOTES-v2.0.0.md" -ForegroundColor White
Write-Host "5. Click 'Publish release'" -ForegroundColor White

Write-Host "`n📄 Release notes location:" -ForegroundColor Yellow
Write-Host "   - Full changelog: CHANGELOG-v2.md" -ForegroundColor Cyan
Write-Host "   - Release notes: RELEASE-NOTES-v2.0.0.md" -ForegroundColor Cyan

Write-Host "`n🔗 Quick links:" -ForegroundColor Yellow
Write-Host "   - Compare: https://github.com/wobyjs/woby/compare/v$oldVersion...v$VERSION" -ForegroundColor Cyan

Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "🎊 Release v$VERSION preparation complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
