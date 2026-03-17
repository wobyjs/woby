# Build packages according to dependency graph

Write-Host "Building packages one by one..." -ForegroundColor Green

# Core dependencies first
Write-Host "`nCore dependencies first:" -ForegroundColor Cyan

$packages = @(
    "soby",
    "via", 
    "woby",
    "chk",
    "styled",
    "modal",
    "tooltip", 
    "toast",
    "list",
    "billboard",
    "kapsule",
    "react",
    "use",
    "simple-router",
    "slider",
    "progress-bar",
    "phone-input",
    "table",
    "sunburst-chart",
    "three",
    "three-demo",
    "wheeler",
    "wui",
    "jasmine"
)

foreach ($package in $packages) {
    if (Test-Path "$package/package.json") {
        Write-Host "`nBuilding $package..." -ForegroundColor Yellow
        Set-Location $package
        
        $buildSucceeded = $false
        $retryCount = 0
        $maxRetries = 1
        
        while (-not $buildSucceeded -and $retryCount -le $maxRetries) {
            try {
                & pnpm build
                
                if ($LASTEXITCODE -eq 0) {
                    $buildSucceeded = $true
                    Write-Host "Successfully built $package" -ForegroundColor Green
                } else {
                    if ($retryCount -eq 0) {
                        Write-Host "Build failed for $package. Attempting pnpm install..." -ForegroundColor Yellow
                        & pnpm install
                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "pnpm install failed for $package" -ForegroundColor Red
                            Set-Location ..
                            exit $LASTEXITCODE
                        }
                        $retryCount++
                    } else {
                        Write-Host "Error occurred in $package build. Exit code: $LASTEXITCODE" -ForegroundColor Red
                        Set-Location ..
                        exit $LASTEXITCODE
                    }
                }
            } catch {
                Write-Host "Error occurred in $package build: $_" -ForegroundColor Red
                Set-Location ..
                exit 1
            }
        }
        
        Set-Location ..
    } else {
        Write-Host "$package does not contain package.json, skipping..." -ForegroundColor Gray
    }
}

Write-Host "`nAll core packages built successfully!" -ForegroundColor Green

# Build demo packages
Write-Host "`nBuilding demo packages..." -ForegroundColor Cyan

$demos = @(
    "benchmark",
    # "boxes",
    "clock",
    "counter",
    "emoji_counter",
    "html",
    "hyperscript",
    "playground",
    "spiral",
    "store_counter",
    "triangle",
    "uibench"
)

foreach ($demo in $demos) {
    if (Test-Path "demo/$demo/package.json") {
        Write-Host "`nBuilding demo: $demo..." -ForegroundColor Yellow
        Set-Location demo/$demo
        
        $buildSucceeded = $false
        $retryCount = 0
        $maxRetries = 1
        
        while (-not $buildSucceeded -and $retryCount -le $maxRetries) {
            try {
                & pnpm build
                
                if ($LASTEXITCODE -eq 0) {
                    $buildSucceeded = $true
                    Write-Host "Successfully built demo: $demo" -ForegroundColor Green
                } else {
                    if ($retryCount -eq 0) {
                        Write-Host "Build failed for demo: $demo. Attempting pnpm install..." -ForegroundColor Yellow
                        & pnpm install
                        if ($LASTEXITCODE -ne 0) {
                            Write-Host "pnpm install failed for demo: $demo" -ForegroundColor Red
                            Set-Location ../..
                            exit $LASTEXITCODE
                        }
                        $retryCount++
                    } else {
                        Write-Host "Error occurred in demo: $demo build. Exit code: $LASTEXITCODE" -ForegroundColor Red
                        Set-Location ../..
                        exit $LASTEXITCODE
                    }
                }
            } catch {
                Write-Host "Error occurred in demo: $demo build: $_" -ForegroundColor Red
                Set-Location ../..
                exit 1
            }
        }
        
        Set-Location ../..
    } else {
        Write-Host "demo/$demo does not contain package.json, skipping..." -ForegroundColor Gray
    }
}

Write-Host "`nAll packages and demos built successfully!" -ForegroundColor Green