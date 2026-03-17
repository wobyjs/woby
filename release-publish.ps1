#!/usr/bin/env pwsh

# Smart Release Script: GitHub + npm
# Automatically detects version from package.json
# Usage: .\release-publish.ps1

Write-Host "🚀 Starting GitHub Release & npm Publish" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Step 0: Read version from package.json
Write-Host "`n📦 Reading package.json..." -ForegroundColor Yellow
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$version = $packageJson.version
$packageName = $packageJson.name

Write-Host "   Package: $packageName" -ForegroundColor White
Write-Host "   Version: v$version" -ForegroundColor Cyan

# Step 1: Verify tag exists
Write-Host "`n📍 Step 1: Verifying tag v$version exists..." -ForegroundColor Yellow
$tagExists = git tag -l | Select-String "^v$version$"
if (-not $tagExists) {
    Write-Host "❌ Tag v$version not found! Create it first:" -ForegroundColor Red
    Write-Host "   git tag -a \"v$version\" -m \"Woby v$version\"" -ForegroundColor Cyan
    Write-Host "   git push origin --tags" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "✅ Tag v$version found" -ForegroundColor Green
}

# Step 2: Check if already published to npm
Write-Host "`n📦 Step 2: Checking npm registry..." -ForegroundColor Yellow

try {
    $publishedVersion = npm view $packageName version 2>$null
    if ($publishedVersion -eq $version) {
        Write-Host "⚠️  Version $version already published to npm" -ForegroundColor Yellow
        $republish = Read-Host "Republish anyway? (y/n)"
        if ($republish -ne 'y') {
            Write-Host "Skipping npm publish" -ForegroundColor Gray
            $skipNpm = $true
        }
    } else {
        Write-Host "✅ Latest npm version: $publishedVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️  Package not found on npm (first release?)" -ForegroundColor Yellow
}

# Step 3: Check if GitHub release exists
Write-Host "`n🐙 Step 3: Checking GitHub releases..." -ForegroundColor Yellow
$existingRelease = gh release view "v$version" 2>$null
if ($existingRelease) {
    Write-Host "⚠️  GitHub release v$version already exists!" -ForegroundColor Yellow
    Write-Host $existingRelease | Select-Object -First 3
    $recreate = Read-Host "Recreate release? (y/n)"
    if ($recreate -eq 'y') {
        Write-Host "Deleting existing release..." -ForegroundColor Gray
        gh release delete "v$version" --yes 2>$null
    } else {
        Write-Host "Skipping GitHub release creation" -ForegroundColor Gray
        $skipGithub = $true
    }
}

# Step 4: Create GitHub Release (if not skipped)
if (-not $skipGithub) {
    Write-Host "`n🎉 Step 4: Creating GitHub release..." -ForegroundColor Yellow
    $releaseTitle = "Woby v$version"
    $releaseNotes = "Release v$version of $packageName"
    
    gh release create "v$version" `
        --title $releaseTitle `
        --notes $releaseNotes `
        --target main `
        --verify-tag
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub release created!" -ForegroundColor Green
        Write-Host "   https://github.com/wobyjs/$packageName/releases/tag/v$version" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to create GitHub release" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Publish to npm (if not skipped)
if (-not $skipNpm) {
    Write-Host "`n📤 Step 5: Publishing to npm..." -ForegroundColor Yellow
    
    pnpm publish --access public --no-git-checks
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Published to npm!" -ForegroundColor Green
        Write-Host "   https://www.npmjs.com/package/$packageName/v/$version" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to publish to npm" -ForegroundColor Red
        exit 1
    }
}

# Step 6: Summary
Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "🎊 Release & Publish Complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`n📊 Summary:" -ForegroundColor Yellow
Write-Host "   Package: $packageName@$version" -ForegroundColor White
Write-Host "   GitHub:  https://github.com/wobyjs/$packageName/releases/tag/v$Version" -ForegroundColor Cyan
Write-Host "   npm:     https://www.npmjs.com/package/$packageName" -ForegroundColor Cyan
Write-Host "`n✨ Done!" -ForegroundColor Green
