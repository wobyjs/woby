# 🎉 Woby v2.0.0 - Major SSR & Custom Elements Release

## Overview

Woby v2.0.0 represents a significant milestone in the evolution of this high-performance reactive framework. This release focuses on **architectural improvements**, **SSR enhancements**, and **custom elements support**, while cleaning up deprecated APIs for a more streamlined developer experience.

---

## ✨ What's New

### 🏗️ SSR Architecture Overhaul

The server-side rendering system has been completely rewritten from the ground up:

- **Complete SSR Rewrite**: Enhanced performance and consistency across all rendering scenarios
- **Unified Creator Utilities**: Merged `create.ssr.ts` into main creators for cleaner codebase
- **Isolated Document Support**: Better handling of isolated SSR document contexts
- **Portal Rendering**: Improved Portal component behavior in SSR mode
- **Context Propagation**: Fixed custom element context synchronization during SSR
- **Attribute Handling**: Corrected boolean attributes (`tabIndex`, `htmlFor`) in SSR

### 🧩 Custom Elements Enhancement

Major improvements to custom element support:

- **Separated Implementations**: Clean separation between SSR and browser custom element creation
- **Enhanced Typings**: Better TypeScript support for custom elements
- **Shadow DOM**: Fixed shadowRoot and slot implementations
- **Context Integration**: Seamless context usage in both DOM and custom elements
- **Dynamic Updates**: Context values update dynamically after mount

### 🪝 Hooks API Simplification

Cleaner, more focused hooks API:

- **Removed Deprecated Hooks**: 
  - ❌ `useAttached` (removed)
  - ❌ `useMountedContext` (removed)
- **Simplified Patterns**: Streamlined context usage throughout the codebase

---

## 🚀 New Features

### Components

- ✅ **EnvironmentContext**: New component for environment-aware rendering
- ✅ **ErrorBoundary**: Enhanced with comprehensive test coverage (+255 lines)
- ✅ **Component Improvements**: Better typings and SSR support for `Dynamic`, `If`, `KeepAlive`, `Portal`, `Suspense`

### Testing Infrastructure

Added comprehensive test documentation and tooling:

- 📚 **Test Architecture Guide** (336 lines)
- 📚 **Examples Collection** (829 lines)  
- 📚 **Filtered Assertions Guide** (88 lines)
- 📚 **Quickstart Guide** (371 lines)
- 📚 **Test Commands Reference** (325 lines)

New test files:
- `playground-assertions.spec.ts` - Enhanced assertion patterns
- `playground-console.spec.ts` - Console debugging utilities
- `run-tests.js` - Automated test runner

### Reactivity System

- ⚡ Fixed observable handling in event listeners
- ⚡ Added `addEventListener` to `BaseNode`
- ⚡ Improved classList handling in SSR
- ⚡ Enhanced `woby.For` value reactivity
- ⚡ Fixed event observable subscriptions

---

## 🔧 Improvements

### Build & Tooling

- Updated dependencies to latest versions
- Enhanced Playwright configuration
- Improved TypeScript settings
- Streamlined Vite builds

### Documentation

- Updated Context API guides with practical examples
- Added deprecation migration paths
- Enhanced custom element tutorials
- Improved best practices documentation

---

## 🗑️ Deprecations & Removals

### Removed

- ❌ `demo/counter.ssr/` - Entire obsolete SSR demo directory
- ❌ Old playground test suite (40+ files)
- ❌ `useAttached` hook
- ❌ `useMountedContext` hook
- ❌ Debug logs and commented code
- ❌ Temporary build artifacts

---

## ⚠️ Breaking Changes

### 1. Hooks Removal

**Impact**: High - If you're using the deprecated hooks

```typescript
// ❌ Before (v1.x)
import { useMountedContext } from 'woby';
const value = useMountedContext(MyContext);

// ✅ After (v2.0)
import { useContext } from 'woby';
const context = useContext(MyContext);
const value = context.value;
```

**Migration**: Replace `useMountedContext` with standard `useContext` pattern

### 2. SSR Custom Elements

**Impact**: Medium - Custom elements now have separate SSR/browser implementations

```typescript
// The API remains the same, but implementation is now environment-specific
import { customElement } from 'woby';

@customElement('my-element')
class MyElement extends HTMLElement {
  // Implementation automatically selected based on environment
}
```

### 3. Test Infrastructure

**Impact**: Low - Old test files removed, new suite added

The old playground tests have been replaced with a more comprehensive test suite. Update your test running commands as needed.

---

## 📊 By The Numbers

- **1,810 files changed**
- **+68,167 lines added**
- **-15,502 lines removed**
- **Net: +52,665 lines**
- **40 commits** since v1.58.41

---

## 🐛 Notable Bug Fixes

- ✅ SSR rendering with lowercase tagNames
- ✅ Boolean attribute handling (`tabIndex`)
- ✅ Console.log string interpolation
- ✅ Context value synchronization
- ✅ Attribute removal detection
- ✅ Nested array rendering issues

---

## 🎯 Migration Checklist

- [ ] Replace `useMountedContext` with `useContext`
- [ ] Replace `useAttached` with appropriate lifecycle hooks
- [ ] Update test files if using old playground tests
- [ ] Review custom element implementations
- [ ] Test SSR rendering in your application
- [ ] Update CI/CD pipelines with new test commands

---

## 📝 Selected Commit History

Recent commits (40 total):

- `e0e224b` - Remove obsolete counter demo tests
- `de7803b` - Fixed SSR with test (playground)
- `a534593` - Remove useAttached, useMountedContext
- `a7f3c26` - Fixed context (both DOM & customElement)
- `f7d2b5f` - Update other-context value dynamically after mount
- `95f7591` - Remove __temp__ context & symbol
- `6a30a31` - Add SSR test for custom element context
- Multiple SSR architecture improvements

---

## 🙏 Acknowledgments

This release represents a major step forward in Woby's evolution, with significant contributions to the SSR architecture, custom elements implementation, and testing infrastructure.

---

## 📦 Installation

```bash
npm install woby@latest
# or
pnpm add woby
# or
yarn add woby
```

---

## 🔗 Links

- [Full Changelog](./CHANGELOG-v2.md)
- [Documentation](./doc/)
- [Migration Guide](./doc/Migration-Guide.md)
- [Getting Started](./doc/Quick-Start.md)

---

**Release Date**: March 17, 2026  
**Version**: 2.0.0  
**Previous Version**: 1.58.41
