# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-17

### 🎉 Major Changes

#### SSR Architecture Overhaul
- Complete rewrite of server-side rendering system with improved performance
- Merged `create.ssr.ts` into main creator utilities for streamlined codebase
- Enhanced isolated SSR document support with better Portal rendering
- Fixed SSR custom element context propagation
- Improved `tabIndex` and boolean attribute handling in SSR
- Fixed `htmlFor` attribute rendering in SSR mode

#### Custom Elements Enhancement
- Separated SSR and browser custom element creation for better isolation
- Improved custom element typings and SSR rendering
- Fixed shadowRoot and slot sample implementations
- Enhanced context support for both DOM and custom elements
- Dynamic context value updates after mount

#### Hooks API Cleanup
- **BREAKING**: Removed deprecated `useAttached` hook (210 lines)
- **BREAKING**: Removed deprecated `useMountedContext` hook (113 lines)
- Simplified context API usage patterns
- Updated all internal hooks to use new patterns

### 🚀 Features

#### Core Components
- Added `EnvironmentContext` component for environment-aware rendering
- Enhanced `ErrorBoundary` with comprehensive test coverage (+255 lines)
- Improved `Dynamic`, `If`, `KeepAlive`, `Portal`, and `Suspense` components
- Better JSX typing and SSR test assertion messages

#### Testing Infrastructure
- Comprehensive test documentation suite:
  - Architecture guide (336 lines)
  - Examples collection (829 lines)
  - Filtered assertions guide (88 lines)
  - Fix summary (171 lines)
  - Implementation summary (282 lines)
  - Quickstart guide (371 lines)
  - Test commands reference (325 lines)
- New test files:
  - `playground-assertions.spec.ts` (280 lines)
  - `playground-console.spec.ts` (190 lines)
  - Automated test runner (151 lines)

#### Reactivity System
- Fixed observable handling in event listeners
- Added `addEventListener` support to `BaseNode`
- Improved classList handling in SSR DOM
- Fixed big int serialization in console logs
- Enhanced `woby.For` value reactivity
- Fixed event observable subscriptions

### 🔧 Improvements

#### Build & Configuration
- Updated package.json dependencies
- Enhanced Playwright test configuration
- Improved TypeScript settings and type definitions
- Streamlined Vite build configurations

#### Documentation
- Updated Context API documentation with enhanced examples
- Added deprecation notices for removed hooks
- Improved Best Practices guide
- Updated custom element practical guides
- Enhanced migration documentation

### 🗑️ Removals

- Removed entire `demo/counter.ssr` directory (obsolete SSR demo)
- Deleted old playground test suite (40+ test spec files)
- Removed deprecated hook implementations
- Cleaned up debug logs and commented code
- Removed temporary build artifacts and test output files

### 📊 Statistics

- **1,810 files changed**
- **+68,167 insertions**
- **-15,502 deletions**
- **Net change: +52,665 lines**

### 🐛 Bug Fixes

- Fixed SSR rendering with lower case tagName
- Corrected boolean attribute handling (tabIndex)
- Fixed console.log string interpolation in playground
- Resolved context value synchronization issues
- Fixed attribute removal detection
- Resolved nested array rendering issues

### ⚠️ Breaking Changes

1. **Removed Hooks**: `useAttached` and `useMountedContext` are no longer available
   - Migration: Use standard context patterns as shown in updated documentation
   
2. **SSR Custom Elements**: Changed how custom elements are created in SSR mode
   - Separate implementations for SSR vs browser environments
   - Improved type safety and rendering consistency

3. **Test Infrastructure**: Old playground tests removed
   - New test suite provides better coverage and clearer examples
   - Updated test running commands

### 🎯 Migration Guide

#### For Hook Usage
```typescript
// Before (v1.x)
const value = useMountedContext(MyContext);

// After (v2.0)
const context = useContext(MyContext);
const value = context.value;
```

#### For SSR Custom Elements
```typescript
// Before (v1.x)
// Mixed SSR/browser implementation

// After (v2.0)
// Separate implementations automatically selected
import { customElement } from 'woby';
```

### 📝 Commit History (40 commits since v1.58.41)

Key commits include:
- e0e224b: Remove obsolete counter demo tests
- de7803b: Fixed SSR with test (playground)
- a534593: Remove useAttached, useMountedContext
- a7f3c26: Fixed context (both DOM & customElement)
- f7d2b5f: Update other-context value dynamically
- Multiple SSR and custom element improvements

---

## [1.58.41] - Previous Release

[Compare changes](https://github.com/wobyjs/woby/compare/v1.58.41...v2.0.0)
