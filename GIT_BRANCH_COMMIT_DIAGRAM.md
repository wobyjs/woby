# Woby Git Branch & Commit Diagram

## Branch Overview

```
* without-ssr (current branch)
* main
* partial-playground2playwright
* partial-playground2playwright-branch
* remotes/origin/feature/error-boundary-enhancements
* remotes/origin/full-playground-test-fix
* remotes/origin/jules-test-conversion-quest-17600673731116769843
* remotes/origin/main
* remotes/origin/partial-playground2playwright
* remotes/origin/without-ssr
```

## Complete Git History Diagram

```
                                   ┌─────────────────────────────────────────────────┐
                                    │                    without-ssr branch                    │
                                   └─────────────────────────────────────────────────────────┘
                                                    │
    9d7e3c3 - 2026-02-25 - fix jsx(Context.Provider... (origin/full-playground-test-fix)
         │
    67b4531 - 2026-02-25 - kiv custom element
         │
    420929f - 2026-02-25 - partial fix custom_element slot, shadowRoot
         │
    5023f83 - 2026-02-24 - custom element test
         │
    a17a0d3 - 2026-02-24 - 1.58.39
         │
    b2e52c9 - 2026-02-24 - feat(custom-elements): Add HTML type conversion utilities
         │
    e8af9d4 - 2026-02-24 - feat: Introduce HTML utility types for custom elements
         │
    74d9bdf - 2026-02-24 - 1.58.38  ← (This is on without-ssr branch, NOT main branch)
         │
    bf08651 - 2026-02-24 - feat: Add HTML utility types for custom elements
         │
    607508e - 2026-02-24 - 1.58.37
         │
    732e311 - 2026-02-24 - 1.58.36
         │
    f394fa7 - 2026-02-24 - update package.json
         │
    f6be254 - 2026-02-24 - update package.json
         │
    9d0290a - 2026-02-24 - completed playground src (main test) exclude keepalive, customElement
         │
    2a1b110 - 2026-02-23 - fix timing
         │
    0491625 - 2026-02-23 - resume add ssr test
         │
    3e5d7b5 - 2026-02-23 - fix playground util.ts
         │
    bb52538 - 2026-02-23 - fix setters.ts reactive event
         │
    a74f3b8 - 2026-02-22 - fix dynamic via & ssr in build
         │
    ae8c90b - 2026-02-22 - fully fix playground index.tsx error log fix
         │
    ce89ae3 - 2026-02-22 - fix plagground hang
         │
    15b4ba7 - 2026-02-22 - fix setter event with ob fn
         │
    97e234a - 2026-02-22 - initial full test
         │
    1b4121c - 2026-02-22 - fix dynamic, fix hmr, update npm
         │
    2bb33d5 - 2026-02-21 - fix dynamic & fix playground
         │
    f405826 - 2026-02-21 - extensive playwright update
         │
         ├─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                    partial-playground2playwright branch                    │
         │                                                                             │
    4092aa0 - 2026-02-03 - remove mouse,pointer,touch in setDirective, it cause click triggered twice (HEAD -> without-ssr)
         │
    b01f5f8 - 2026-02-02 - fix export setSetters
         │
    363e267 - 2026-02-01 - tested playwright
         │
    de56974 - 2026-02-01 - playground test
         │
    d28b9ca - 2026-02-01 - update playground
         │
         ├─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                 partial-playground2playwright-branch                       │
         │                                                                             │
    dab43a4 - 2026-02-13 - partial playground -> playwright (origin/without-ssr, partial-playground2playwright-branch)
         │
    4b64a7e - 2026-02-17 - playground.src fix
         │
    f5ecd87 - 2026-02-19 - playwright progrssing
         │
         ├─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │    jules-test-conversion-quest-17600673731116769843 branch                  │
         │                                                                             │
    02b7dee - 2026-02-19 - feat(test): Implement Woby component logic in test files (origin/jules-test-conversion-quest-17600673731116769843)
         │
        └─────────────────────────────────────────────────────────────────────────────┘
         │
         │
    b52f05a - 2026-01-26 - ssr remove debug log (before call stack exceeded) (origin/main, origin/HEAD, main)
         │
    4888402 - 2026-01-26 - ssr removed debug log
         │
    9f9be91 - 2026-01-25 - ssr fixed with log
         │
    28d3465 - 2026-01-13 - ssr fix half
         │
        └─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │              feature/error-boundary-enhancements branch                    │
         │                                                                             │
    4a2ae2c - 2025-05-24 - feat(ErrorBoundary): Enhance ErrorBoundary and add tests (origin/feature/error-boundary-enhancements)
         │
        └─────────────────────────────────────────────────────────────────────────────┘
         │
    25d9d06 - 2025-09-22 - 1.58.33 (tag: v1.58.33)
         │
         ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │              main branch (with tagged releases)                             │
         │                                                                             │
    20be3de - 2025-10-24 - 1.58.38 (tag: v1.58.38) ← Main branch tagged release
         │
    32b28c6 - 2025-10-24 - feat: Introduce HTML utility types for custom elements
         │
    b80a641 - 2025-10-24 - 1.58.37 (tag: v1.58.37) ← Main branch tagged release
         │
    580fbc3 - 2025-10-24 - feat(release): Switch to git-changelog and simplify release script
         │
    b136169 - 2025-10-24 - 1.58.36 (tag: v1.58.36) ← Main branch tagged release
         │
    9471b28 - 2025-09-22 - feat(tooling, core): introduce conventional commits and fix custom element initialization
         │
    b1db184 - 2025-09-13 - 1.58.32 (tag: v1.58.32)
         │
    b1d8a3d - 2025-09-13 - 1.58.31 (tag: v1.58.31)
         │
    6773371 - 2025-09-13 - Bump version
         │
    c2f3eec - 2025-09-12 - 1.58.30 (tag: v1.58.30)
         │
    8daa6dd - 2025-09-12 - Bump version
         │
    bed83be - 2025-09-12 - 1.58.29 (tag: v1.58.29)
         │
    828702f - 2025-09-12 - Bump version
         │
    26e0f1d - 2025-09-11 - 1.58.28 (tag: v1.58.28)
         │
    5c9a4ae - 2025-09-11 - Bump version
         │
    e24a434 - 2025-09-11 - 1.58.27 (tag: v1.58.27)
         │
    cdb67b8 - 2025-09-11 - Bump version
         │
    51a396f - 2025-09-11 - 1.58.26 (tag: v1.58.26)
         │
    0c6f0b0 - 2025-09-11 - Bump version
         │
    a6fbb79 - 2025-09-11 - 1.58.25 (tag: v1.58.25)
         │
    b28ac6d - 2025-09-11 - Bump version
         │
    0260ca2 - 2025-09-04 - 1.58.24 (tag: v1.58.24)
         │
    6fbfc67 - 2025-09-04 - Bump version
         │
    e795630 - 2025-09-03 - 1.58.23 (tag: v1.58.23)
         │
    c7d9047 - 2025-09-03 - Bump version
         │
    46a312f - 2025-09-03 - 1.58.22 (tag: v1.58.22)
         │
    551f3d2 - 2025-09-03 - Bump version
         │
    2d23fd2 - 2025-08-30 - update md
         │
    fc954e5 - 2025-08-29 - update doc
         │
    cf51e90 - 2025-08-29 - updte md
         │
    7f0c053 - 2025-08-28 - 1.58.21 (tag: v1.58.21)
         │
    54d90c3 - 2025-08-28 - Bump version
         │
    c2886d7 - 2025-08-28 - 0.58.20 (tag: v0.58.20)
         │
    0db23c2 - 2025-08-28 - Bump version
         │
    cbe2d6c - 2025-08-27 - 0.58.19 (tag: v0.58.19)
         │
    9ac142c - 2025-08-27 - Bump version
         │
    bd918ce - 2025-08-15 - 0.58.18 (tag: v0.58.18)
         │
    143e3c4 - 2025-08-15 - Bump version
         │
    135022b - 2025-08-14 - 0.58.17 (tag: v0.58.17)
         │
    07d85ce - 2025-08-14 - Bump version
         │
    ea70ba4 - 2025-08-04 - 0.58.16 (tag: v0.58.16)
         │
    b66a392 - 2025-08-04 - 0.58.15 (tag: v0.58.15)
         │
    22a13e1 - 2025-08-04 - Bump version
         │
    aabcd8a - 2025-07-15 - 0.58.14 (tag: v0.58.14)
         │
    47f23b6 - 2025-07-15 - Bump version
         │
    d0ddfd3 - 2025-07-14 - 0.58.12 (tag: v0.58.12)
         │
    cbb4d33 - 2025-07-14 - Bump version
         │
    bbf7fe0 - 2025-06-21 - 0.58.11 (tag: v0.58.11)
         │
    f891ec3 - 2025-06-21 - Bump version
         │
    362fa05 - 2025-06-21 - 0.58.10 (tag: v0.58.10)
         │
    2b20432 - 2025-06-21 - Bump version
         │
    9868317 - 2025-06-21 - 0.58.7
         │
    e8cc9de - 2025-06-21 - Bump version
         │
    82ea869 - 2025-06-11 - Bump version
         │
    a271965 - 2025-06-10 - Bump version
         │
        ┌──────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │              feature/error-boundary-enhancements branch                    │
         │                                                                             │
    289536b - 2025-05-26 - Merge pull request #2 from wongchichong/feature/error-boundary-enhancements
         │\
         │ * 4a2ae2c - 2025-05-24 - feat(ErrorBoundary): Enhance ErrorBoundary and add tests
         │/
         │
    7468287 - 2024-11-15 - Bump version
         │
    01913eb - 2024-08-06 - Bump version
         │
    1336f67 - 2024-06-12 - Bump version
         │
    2466087 - 2024-05-15 - Bump version
         │
        ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                            main branch                                      │
         │                                                                             │
    e63aac9 - 2024-05-14 - Merge branch 'main' of https://github.com/wongchichong/woby
         │\
         │ * 4d912e1 - 2024-05-14 - Removed .vscode and dist1 folder, modified package.json export type paths
         * | c93e1d5 - 2024-04-15 - 0.58.5
         │/
         │
    31aff4e - 2024-04-15 - Bump version
         │
    bc1744a - 2024-04-15 - 0.58.4
         │
    125c995 - 2024-04-15 - 0.58.3
         │
    f7baf0b - 2024-04-15 - 0.58.2
         │
    731df01 - 2024-04-15 - 0.58.1
         │
    9721037 - 2024-04-15 - Bump version
         │
    d180479 - 2024-04-08 - Apr 4 2024
         │
    f24ad91 - 2024-04-08 - sync to Apr 4 2024
         │
    e47b850 - 2024-04-05 - patch 4 Apr 20
         │
    bde4eff - 2024-02-06 - add files
         │
    6676679 - 2024-02-06 - add files
         │
    2db2225 - 2024-02-06 - bump version
         │
    a418b4e - 2023-12-08 - rebuild
         │
    7c6ceb1 - 2023-12-08 - rebuild
         │
    c31e86f - 2023-12-07 - update via.js
         │
         ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                            main branch                                      │
         │                                                                             │
    09e1acd - 2023-11-02 - Merge branch 'main' of https://github.com/wongchichong/woby
         │\
         │ * 3a59396 - 2023-10-27 - added exports for util functions
         * | 8d26dd7 - 2023-11-02 - update
         │/
         │
    91bd332 - 2023-10-06 - update to Sep 2023
         │
         ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                            main branch                                      │
         │                                                                             │
    bd27422 - 2023-10-06 - Merge branch 'main' of https://github.com/wongchichong/woby
         │\
         │ *   5dbd8f8 - 2023-08-16 - Merge branch 'main' of https://github.com/wongchichong/woby
         │ |\
         │ * | 57ffa88 - 2023-08-16 - updated test render function
         * | | 4f9fd65 - 2023-10-06 - update to Sep 2023
         * | | 1f6a117 - 2023-10-06 - update to Sep 2023
         │ |/
         │/|
         │ |
    9716de0 - 2023-08-16 - update
         │
    5e9688c - 2023-08-09 - cloneElement
         │
    52d417c - 2023-08-09 - sync 8 Aug 2023
         │
    6b6a47e - 2023-08-08 - sync 8 Aug 2023
         │
    bd38612 - 2023-08-02 - some update
         │
         ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                            main branch                                      │
         │                                                                             │
    6351e54 - 2023-07-26 - Merge branch 'main' of https://github.com/wongchichong/woby
         |\ \
         | * | 487e000 - 2023-07-03 - Merge pull request #1 from sl1241/main
         | |\|
         | | * 124a55e - 2023-07-03 - Update to fix render test function and clone element function
         | |/
         * / 19b22d3 - 2023-07-26 - fix React 16, 18 JSX transform
         |/
         │
    fe0e2c0 - 2023-06-12 - fix jsxDEV
         │
    e398886 - 2023-06-02 - fix bugs
         │
        ┌─────────────────────────────────────────────────────────────────────────────┐
         │                                                                             │
         │                            main branch                                      │
         │                                                                             │
    481a6cb - 2023-05-24 - some updates
         |\
         | * 1065215 - 2023-04-20 - bump tsex version
         * | 07831b8 - 2023-05-24 - some updates
         * | e623629 - 2023-05-01 - apr 2023
         |/
         │
    4b4957a - 2023-03-28 - rebase
```

## Key Branch Points

### 1. Main Development Line
- **Origin**: `4b4957a` (2023-03-28) - Initial rebase
- **Latest**: `9d7e3c3` (2026-02-25) - Current HEAD on without-ssr branch

### 2. Major Feature Branches
- **without-ssr**: Current active development branch
- **partial-playground2playwright**: Playground to Playwright conversion work
- **partial-playground2playwright-branch**: Related playground work
- **feature/error-boundary-enhancements**: Error boundary improvements

### 3. Version Tags
- **v1.58.38**: `20be3de` (2025-10-24)
- **v1.58.37**: `b80a641` (2025-10-24)
- **v1.58.36**: `b136169` (2025-10-24)
- **v1.58.33**: `25d9d06` (2025-09-22)
- **v1.58.32**: `b1db184` (2025-09-13)
- **v1.58.31**: `b1d8a3d` (2025-09-13)
- **v1.58.30**: `c2f3eec` (2025-09-12)
- **v1.58.29**: `bed83be` (2025-09-12)
- **v0.58.20**: `c2886d7` (2025-08-28)
- **v0.58.19**: `cbe2d6c` (2025-08-27)
- **v0.58.18**: `bd918ce` (2025-08-15)
- **v0.58.17**: `135022b` (2025-08-14)
- **v0.58.16**: `ea70ba4` (2025-08-04)
- **v0.58.15**: `b66a392` (2025-08-04)
- **v0.58.14**: `aabcd8a` (2025-07-15)
- **v0.58.12**: `d0ddfd3` (2025-07-14)
- **v0.58.11**: `bbf7fe0` (2025-06-21)
- **v0.58.10**: `362fa05` (2025-06-21)
- **v0.58.7**: `fe36262` (2024-11-15)

## Branch Status

- **Active Branch**: `without-ssr` (current HEAD)
- **Main Branch**: `main` (remote: origin/main)
- **Feature Branches**: 3 active feature branches
- **Remote Tracking**: All branches have remote tracking

## Recent Activity Summary

### Last 30 Days (Feb 2026)
- **20 commits** on `without-ssr` branch
- Focus on: Custom elements, playground fixes, SSR improvements
- Key features: HTML type utilities, context provider enhancements

### Last 6 Months
- **Major refactoring** of custom elements API
- **Playwright testing** integration
- **Error boundary** enhancements
- **Version bumps** from 1.58.33 to 1.58.39

## Repository Statistics

- **Total Commits**: ~150+ commits
- **Active Branches**: 4 local branches
- **Remote Branches**: 6 remote branches
- **Version Tags**: 20+ release tags
- **First Commit**: 2023-03-28
- **Latest Commit**: 2026-02-25

---
*Generated on: 2026-02-25*
*Repository: D:\Developments\tslib\@woby\woby*
*Current Branch: without-ssr*