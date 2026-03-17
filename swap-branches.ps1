#!/usr/bin/env pwsh

# Branch Swap Script: redo-retest-2 → main
# This safely swaps the branches before release

Write-Host "🔄 Starting Branch Swap Operation" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Safety check - ensure working directory is clean
Write-Host "`n🧹 Checking working directory..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Working directory has uncommitted changes!" -ForegroundColor Red
    Write-Host $status
    Write-Host "`nCommit or stash changes first!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Working directory is clean" -ForegroundColor Green
}

# Show current branches
Write-Host "`n📊 Current branches:" -ForegroundColor Yellow
git branch | ForEach-Object { 
    if ($_ -match "^\*\s+(.*)") { 
        Write-Host "  -> $($matches[1])" -ForegroundColor Green 
    } else {
        Write-Host "     $_" -ForegroundColor Gray
    }
}

$currentBranch = git branch --show-current
Write-Host "`n📍 Current branch: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "redo-retest-2") {
    Write-Host "⚠️  Warning: You're not on redo-retest-2 branch!" -ForegroundColor Red
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        Write-Host "❌ Operation cancelled" -ForegroundColor Red
        exit 1
    }
}

# Confirm operation
Write-Host "`n⚠️  WARNING: This will rename branches!" -ForegroundColor Red
Write-Host "  - main → old-main" -ForegroundColor Yellow
Write-Host "  - redo-retest-2 → main" -ForegroundColor Yellow
Write-Host "`nThis CANNOT be undone automatically!" -ForegroundColor Red

$confirm = Read-Host "Are you sure? Type 'yes' to continue"
if ($confirm -ne "yes") {
    Write-Host "❌ Operation cancelled" -ForegroundColor Red
    exit 1
}

# Step 1: Rename main to old-main (if it exists)
Write-Host "`n📝 Step 1: Renaming main → old-main..." -ForegroundColor Yellow
$mainExists = git branch --list "main"
if ($mainExists) {
    git branch -m main old-main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ main renamed to old-main" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not rename main (may not exist locally)" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  main branch doesn't exist locally, skipping" -ForegroundColor Gray
}

# Step 2: Rename redo-retest-2 to main
Write-Host "`n📝 Step 2: Renaming redo-retest-2 → main..." -ForegroundColor Yellow
git branch -m redo-retest-2 main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ redo-retest-2 renamed to main" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to rename redo-retest-2" -ForegroundColor Red
    exit 1
}

# Verify we're now on main
$newBranch = git branch --show-current
Write-Host "`n📍 Now on branch: $newBranch" -ForegroundColor Yellow

if ($newBranch -ne "main") {
    Write-Host "❌ Something went wrong - not on main branch!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Local branch swap complete!" -ForegroundColor Green

# Ask about remote operations
Write-Host "`n🌐 Remote Operations" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`nThe next steps involve REMOTE operations on GitHub." -ForegroundColor Yellow
Write-Host "These will affect the origin repository." -ForegroundColor Gray

$remoteConfirm = Read-Host "Continue with remote operations? (y/n)"

if ($remoteConfirm -eq 'y') {
    # Step 3: Delete remote main
    Write-Host "`n🗑️  Step 3: Deleting remote main..." -ForegroundColor Yellow
    Write-Host "This will remove the old main branch from GitHub" -ForegroundColor Gray
    git push origin --delete main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote main deleted" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not delete remote main (may not exist or protected)" -ForegroundColor Yellow
    }

    # Step 4: Delete remote redo-retest-2
    Write-Host "`n🗑️  Step 4: Deleting remote redo-retest-2..." -ForegroundColor Yellow
    git push origin --delete redo-retest-2
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote redo-retest-2 deleted" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not delete remote redo-retest-2" -ForegroundColor Yellow
    }

    # Step 5: Push new main
    Write-Host "`n📤 Step 5: Pushing new main to remote..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ New main pushed to remote" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to push main" -ForegroundColor Red
        exit 1
    }

    # Optional: Push old-main
    Write-Host "`n📤 Step 6: Pushing old-main as backup (optional)..." -ForegroundColor Yellow
    $pushOld = Read-Host "Push old-main to remote as backup? (y/n)"
    if ($pushOld -eq 'y') {
        git push -u origin old-main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ old-main pushed to remote" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not push old-main" -ForegroundColor Yellow
        }
    }

    Write-Host "`n✅ All operations complete!" -ForegroundColor Green
    
    Write-Host "`n🎉 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Verify branches on GitHub" -ForegroundColor White
    Write-Host "2. Run .\release-v2.ps1 to create v2.0.5 release" -ForegroundColor White
    Write-Host "3. Create GitHub Release from v2.0.5 tag" -ForegroundColor White
    
} else {
    Write-Host "`n⚠️  Remote operations skipped!" -ForegroundColor Yellow
    Write-Host "You'll need to manually:" -ForegroundColor Gray
    Write-Host "  1. Delete remote main: git push origin --delete main" -ForegroundColor Cyan
    Write-Host "  2. Delete remote redo-retest-2: git push origin --delete redo-retest-2" -ForegroundColor Cyan
    Write-Host "  3. Push new main: git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "Branch swap complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
