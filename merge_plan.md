# Woby-Soby Features Reapplication/Merging Plan

## Overview
This plan outlines the systematic reapplication of features and bug fixes between the woby and soby repositories, with emphasis on test validation using the test playground and devtools MCP.

## Phase 1: Repository Status Assessment

### 1.1 Current State Analysis
- **Woby**: Currently on commit `ae8c90b` (HEAD detached from v1.58.33)
- **Soby**: Currently on commit `56a931c` (HEAD at v15.1.14)
- **Woby Branches**: `main`, `without-ssr`, `partial-playground2playwright`
- **Soby Branches**: `main`

### 1.2 Remote Branch Comparison (Commits Beyond Current Head)
Based on git analysis, here are the commits that need to be reapplied:

#### Woby Repository:
- **main branch**: 55 commits beyond current HEAD
  - Latest tag: v1.58.39
  - Key changes: SSR improvements, custom elements, HTML type utilities
- **without-ssr branch**: 57 commits beyond current HEAD
  - Contains modifications to remove SSR components
  - Includes playground to Playwright test conversions
- **partial-playground2playwright branch**: 62 commits beyond current HEAD
  - Most comprehensive branch with playground updates
  - Contains custom element specs and context fixes
  - Highest priority for reapplication

#### Soby Repository:
- **main branch**: 4 commits beyond current HEAD
  - Latest tag: v15.1.15
  - Key changes: HTML type utilities, observable type safety improvements
  - Moved html-* files to woby

### 1.3 Remote Branch Fetching
- Fetch all remote branches: `main`, `without-ssr`, `partial-playground2playwright`
- Update local repositories with latest changes from origin

## Phase 2: Commit History Analysis and Sorting

### 2.1 Get All Commits
```bash
cd d:\temp\woby && git log --pretty=format:"%H %ad %s" --date=iso
cd d:\temp\soby && git log --pretty=format:"%H %ad %s" --date=iso
```

### 2.2 Sort Commits by Date
- Extract commit hashes with timestamps
- Sort chronologically from oldest to newest
- Create ordered list for systematic reapplication

### 2.3 Detailed Commits List (All branches, sorted by date)

#### All commits beyond Woby HEAD (ae8c90b):

| Hash | Date | Message | Branch |
|------|------|---------|--------|
| d3a003c970d7967ac05e0ce0e96f9df41d79925a | 2025-09-23 11:15:47 +0800 | Added support for props written in camelCase in customElement | base |
| 0d3ae149f7380008c0e0ad9a4af8b951a61c07f8 | 2025-10-01 11:14:01 +0800 | Bump version | base |
| 8c1432f1918c3d27d07abb93538ad6ac6446d839 | 2025-10-01 11:15:46 +0800 | feat(tooling): Automate changelog generation and adopt conventional commits | base |
| c6405d3fedacb203eccca8e71bbf494a218c43c5 | 2025-10-01 11:18:37 +0800 | feat(tooling): add commit script and adopt conventional commits | base |
| b10c6aa8ef74e1d40caa8d2c6806b101f9bd4829 | 2025-10-01 11:26:11 +0800 | 1.58.29 | base |
| 612d511727a33f1a4587e175f6ba2c2e78b88fe8 | 2025-10-01 12:03:56 +0800 | 1.58.30 | base |
| ef07f783c6f7fbc234f0e2a17ed08e83350b8d48 | 2025-10-01 12:19:42 +0800 | feat(tooling): Add commit script and adopt conventional commits | base |
| 439731cbf996d202b48739c833b131461c861346 | 2025-10-08 10:27:08 +0800 | fix custom element stage commit | base |
| 0c7d7450e970982d2cbe405492228cd58b6605c7 | 2025-10-10 17:57:39 +0800 | 1.58.31 | base |
| 85dc4dba279ea8d5be633c93e41f88ad941e6af3 | 2025-10-10 17:56:13 +0800 | feat(context): Enhance Shadow DOM and Custom Element integration | base |
| c613861049e5a1530e6f273feee2e8a3c320251d | 2025-10-10 18:05:48 +0800 | fixing custom element context | base |
| a48320f7b60db97c8f5bde8332f18f1c021057a2 | 2025-10-13 09:46:23 +0800 | 1.58.32 | base |
| 4efb70eba534040a839376952c277cb78bd21a2e | 2025-10-13 09:45:35 +0800 | feat(custom-elements, context): Enhance Shadow DOM, context, and serialization | base |
| 57858d6c2f440944e4e3ca5160346d24668c952c | 2025-10-13 16:41:18 +0800 | feat(custom-elements, context): Overhaul Custom Element and Context APIs | base |
| f7dc1eeaebad1bb6cb9acac881c63301f8f1b112 | 2025-10-21 12:23:56 +0800 | feat(reactivity): Enhance observable behavior and docs | base |
| ef574cb760547bd9efd37d06757d12458be47f9f | 2025-10-21 12:33:59 +0800 | re-export PromiseMaybe from soby | base |
| e6b27bd5079c707889b24fab3b9bfe63a5450e30 | 2025-10-21 13:16:37 +0800 | export some internal interface to fix ts(2742) | base |
| 6f5320eed89abeb23449b2c738d4ffceb492ef64 | 2025-10-22 14:43:58 +0800 | feat(context): re-enable and improve context provider | base |
| edaf4f2801b041bb3ac1da4511f2a5e87ee468d1 | 2025-10-24 13:32:33 +0800 | feat(docs, ci): Overhaul Custom Elements docs and add release workflow | base |
| 394730c39dee3f35ec9c4328860752d27b692002 | 2025-10-24 13:38:01 +0800 | Commit message: feat(docs, ci): Overhaul Custom Elements docs and add release workflow | base |
| a52bc895cba64ae5c74126b6a5379926c88a1504 | 2025-10-24 13:38:59 +0800 | 1.58.33 | base |
| 86cbc71bb57f499c95f61cbbb599b990ebedc802 | 2025-10-24 13:45:46 +0800 | update package.json | base |
| cf6b2d46b2f0ea9431b3ed9952eaead5c020eb7e | 2025-10-24 13:57:48 +0800 | update package.json | base |
| b136169e724a51c90c2baded24008cf6b45df82a | 2025-10-24 13:57:53 +0800 | 1.58.36 | base |
| 580fbc390582973f097b4b733dfa9fe7bbb57e69 | 2025-10-24 14:19:20 +0800 | feat(release): Switch to git-changelog and simplify release script | base |
| b80a64169001a5f3bfc4ec941055b45284290db3 | 2025-10-24 14:19:23 +0800 | 1.58.37 | base |
| 32b28c6d97122ef07fdfbee599ba11f3d1eb0a6c | 2025-10-24 15:54:27 +0800 | feat: Introduce HTML utility types for custom elements | base |
| 20be3de54b3dd98cba5a981f75f0a81939800569 | 2025-10-24 15:54:29 +0800 | 1.58.38 | base |
| 5e1315c357ca7724359aad9b4dbaa40ddfe59a14 | 2025-10-27 17:42:52 +0800 | feat(custom-elements): Add HTML type conversion utilities | base |
| 25cbca73a396ec9bcae38e3b93106ee1b641c421 | 2025-10-27 17:43:56 +0800 | 1.58.39 | base |
| 099675edfa0ed1bf2094ec41fc7ff3d3bb671343 | 2025-11-04 22:43:58 +0800 | update spec | base |
| c98886a93f5592794c051c1c372c9f31732b9b86 | 2025-11-05 10:27:58 +0800 | update test spec | base |
| eec560d43341393b6a64e24fe4c76fe06364b634 | 2025-11-06 13:29:58 +0800 | update docs & ssr | base |
| 34e533d13c2d2482dc9b71f12d3716c3fcbd9594 | 2025-11-07 12:03:02 +0800 | update html-function, docs | base |
| d9982513dcb58aa8c9db347b842ce118e5419963 | 2025-11-08 20:14:41 +0800 | ssr 1 | base |
| 82e77010b8f1c23d9aaade555232732bb8c8ba8d | 2025-11-08 20:32:56 +0800 | ssr 1, without htmlssr | base |
| 8b041aa9a9c62be6043c741419e80e16104ed7d3 | 2025-11-08 21:51:07 +0800 | ssr remove clone_element.ssr.ts | base |
| ea495a4c89307a214f3d43c7412310bf55c4add6 | 2025-11-09 11:01:20 +0800 | remove portal, custom_elemment, lazy, render, template .ssr | base |
| b06e222e078894786555bfbbb5093eac62abedf3 | 2025-11-09 11:11:50 +0800 | removed create_element.ssr | base |
| ab4e7ca37fd7a1f5e9acb7d9411bb67060f8346c | 2025-11-10 09:35:39 +0800 | half success ssr | base |
| e0846e60ba6fc84c2198a0690037e7f80f1a19f2 | 2025-11-10 11:44:40 +0800 | hand remove ssr | base |
| 352591141ef6d238d45e81c9c4e3c6b21f1a9c59 | 2025-11-11 09:47:40 +0800 | remove ssr state 3 | base |
| 0d3f80946cda889daac5c9bda87388be05bd9473 | 2025-11-11 11:06:43 +0800 | remove ssr, sync setChildStatic | base |
| 639b3c830211f0822a7836082a75a63f9b598425 | 2025-12-03 16:55:17 +0800 | remove ssr folder content | base |
| d06a775c7fc4c94a4ab20f5fd9ecc8846a2805da | 2025-12-03 22:47:53 +0800 | remove x | base |
| 97d44c347fa35cb4b63675dd74a46b646d7562a4 | 2025-12-04 10:41:06 +0800 | add getEnv | base |
| 95d11d0bfb5e36a83335aa2680ebc6399d02f56d | 2025-12-04 10:42:46 +0800 | pure getEnv | base |
| ebb5f8cbc4b11faa89d6e8588bb028450cfcb589 | 2025-12-04 11:00:12 +0800 | setting ssr env | base |
| e534519d05fe2b702ada1f6d0ca55f423f728590 | 2025-12-04 15:05:28 +0800 | remove setter.ssr | base |
| 8343d552b2a1b7a887da5d92024e1477811021c8 | 2025-12-04 15:07:05 +0800 | remove creator, diff. ssr | base |
| 7376c35d5ba9c8f0d667ce9a95cad36ede0a34c9 | 2025-12-04 15:43:40 +0800 | refactor env | base |
| 28d3465f19a12177002eeff38bd9d1c8ab5e1949 | 2026-01-13 14:40:02 +0800 | ssr fix half | main |
| 9f9be916db03b9d74943c2ed5969c891469e30e8 | 2026-01-25 10:40:38 +0800 | ssr fixed with log | main |
| 488840280005d1ea8e4dd260e8d843d1430e55e1 | 2026-01-26 09:20:13 +0800 | ssr removed debug log | main |
| b52f05ad93f54e43ec27b683e038f3f4e16fdae3 | 2026-01-26 15:52:22 +0800 | ssr remove debug log (before call stack exceeded) | main |
| d28b9ca1e283cd8111962aa464563518c4cff50b | 2026-02-01 12:04:30 +0800 | update playground | base |
| de56974b305019c7590b1b42da036886be822233 | 2026-02-01 22:01:14 +0800 | playground test | base |
| 363e267db112cec17eaf05189508b02016f4eed0 | 2026-02-01 22:30:02 +0800 | tested playwright | base |
| b01f5f8417d5bbcf1d8bc5f48577f0ebf0020018 | 2026-02-02 20:35:46 +0800 | fix export setSetters | base |
| 4092aa0023bbf430b189d0cd7d292ce49ffaa4cb | 2026-02-03 16:13:28 +0800 | remove mouse,pointer,touch in setDirective, it cause click triggered twice | base |
| dab43a4922d3450f90598d77b678fcfaccaf3778 | 2026-02-13 15:01:53 +0800 | partial playground -> playwright | without-ssr |
| 4b64a7e03e573ba2a27ef8822dcd30562c61c927 | 2026-02-17 09:59:15 +0800 | playground.src fix | partial-playground2playwright |
| f5ecd87d0197e3a300c88fd5e99ae90841b568d1 | 2026-02-19 11:49:24 +0800 | playwright progrssing | partial-playground2playwright |
| eb6c2365b772acc2ce04688cc69ff19e0376e114 | 2026-02-19 17:45:01 +0800 | partial spec on customElement | partial-playground2playwright |
| 048a51e18a8814437f58279841904422a46a9535 | 2026-02-19 17:51:35 +0800 | add quest.md | partial-playground2playwright |
| 2565dfbc61cf40e179a6bdc01123c68ddeea73e3 | 2026-02-20 10:50:07 +0800 | found context seem not working | partial-playground2playwright |

#### All commits beyond Soby HEAD (56a931c):

| Hash | Date | Message | Branch |
|------|------|---------|--------|
| 7a99b6d1710c3d77678732265a0d9ea6d612a534 | 2025-10-24 14:11:11 +0800 | feat(html): add HTML type utilities and improve observable type safety | base |
| b136f53aa8b57be0995bae0015b8af1885d92331 | 2025-10-24 14:11:13 +0800 | 15.1.15 | base |
| d0b001a1a6c16577f740c3496b6a5aa6d9f63d80 | 2025-12-13 16:24:05 +0800 | move html-* to woby | base |
| 47a65ef6c675bf7685785e41b1f4cb398555b0e1 | 2026-01-15 11:17:26 +0800 | +env | base |

## Phase 3: Systematic Feature Reapplication

### 3.1 Woby Repository Processing
#### Step 1: Checkout and Prepare
```bash
cd d:\temp\woby
git checkout main
git fetch origin
```

#### Step 2: Identify Key Branches to Process
- `main`: Primary development branch (55 commits beyond current HEAD)
- `without-ssr`: SSR-related changes (57 commits beyond current HEAD)
- `partial-playground2playwright`: Playground and test-related improvements (62 commits beyond current HEAD - highest priority)

#### Step 3: Sequential Commit Application
For each commit in chronological order:
1. Apply the commit changes
2. Run validation tests
3. Document any conflicts or issues

### 3.2 Soby Repository Processing
#### Step 1: Bug Fixes Integration
- Apply 4 commits from main branch (beyond current HEAD)
- Focus on observable-related improvements and HTML type utilities
- Key commits: +env addition, move html-* to woby, HTML type utilities
- Update woby's dependency on soby after fixes

#### Step 2: Integration Testing
- Ensure soby changes don't break woby functionality
- Run compatibility tests between both repositories

## Phase 4: Major Feature Integration

### 4.1 Custom Element Feature
#### Implementation Steps:
1. Identify custom element related commits in test playground
2. Add comprehensive test scripts for custom element functionality
3. Validate with devtools MCP
4. Test on http://localhost:5276/ (HMR server)

#### Test Coverage Needed:
- Basic custom element functionality
- Context passing to custom elements
- Nested custom elements
- Slot handling in custom elements
- Event handling in custom elements

### 4.2 SSR (Server-Side Rendering) Feature
#### Current Status:
- Half implemented with insufficient testing
- Contains breaking changes requiring architectural reconsideration
- Marked as KIV (Keep In View) for this implementation

#### Approach:
- Document current SSR implementation status
- Identify breaking changes and architectural issues
- Plan separate architectural redesign for SSR

## Phase 5: Testing Framework Implementation

### 5.1 Devtools MCP Validation
For each applied feature/fix:
1. Start dev server: `cd d:\temp\woby\demo\playground && pnpm dev`
2. Navigate to http://localhost:5276/
3. Use MCP devtools to validate functionality
4. Record test results in documentation

### 5.2 Test Playground Integration
#### Execute All Test Files:
- Process all files in `d:\temp\woby\demo\playground\test.playground\test.playwright\`
- Focus on test files that correspond to newly applied features
- Address failing tests documented in `TODO_FAILED_TESTS.md`

## Phase 6: Minor Features Integration
Apply remaining minor features and bug fixes systematically:
- Attribute handling improvements
- Event handling enhancements
- Performance optimizations
- Type safety improvements
- Cleanup and disposal fixes

## Phase 7: Validation and Documentation

### 7.1 Comprehensive Testing
- Run full test suite
- Validate HMR functionality
- Check all demo applications work correctly

### 7.2 Create Documentation File
Write detailed plan and results to `D:\temp\woby\merge_plan.md`:
- Chronological list of applied commits
- Test results and validation status
- Issues encountered and resolutions
- Remaining tasks for future work

## Phase 8: Final Verification
- Confirm all major features (excluding SSR) are working
- Validate custom element functionality with comprehensive tests
- Ensure soby bug fixes are properly integrated
- Document next steps for SSR architectural redesign

## Execution Order Priority:
1. Highest: `partial-playground2playwright` branch (62 commits, well-tested/latest changes)
2. Medium: `main` branch updates (55 commits)
3. Lowest: `without-ssr` branch (57 commits, less favorable)
4. Last: SSR architectural redesign (KIV status)