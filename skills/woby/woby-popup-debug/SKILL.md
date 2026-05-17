---
name: woby-popup-debug
description: Debugging techniques for Woby popup positioning issues
tags: [woby, dropdown, popup, positioning, viewport, useViewportSize, debugging]
---

# Woby Popup Debugging

## Critical: Always Use `top: 100%` to Avoid Covering Button

The popup should ALWAYS be positioned below the container using `top: 100%`, NEVER using calculated top offsets.

### Problem
When using calculated `topOffset` for 'right' placement:
```tsx
// WRONG - topOffset can = 0, covering button
top: () => placement === 'bottom' ? '100%' : topOffset
```

This causes popup to cover the button when `topOffset = 0`.

### Solution
Always use `top: 100%` for both placements:
```tsx
style={{
    top: '100%',
    marginTop: '4px',
    marginLeft: () => placement === 'right' ? '4px' : '0px',
    maxHeight: maxHeight,
    overflow: 'auto'
}}
```

## Verification: Always Check Computed Styles

After positioning, verify with browser console:

```js
const btn = document.querySelector('sy-component')?.shadowRoot?.querySelector('button');
const pop = document.querySelector('sy-component')?.shadowRoot?.querySelector('[style*="overflow"]');
const btnR = btn?.getBoundingClientRect();
const popR = pop?.getBoundingClientRect();
const css = getComputedStyle(pop);
'btn: top=' + btnR?.top + ', bottom=' + btnR?.bottom + 
' | popup: top=' + popR?.top + ', bottom=' + popR?.bottom +
' | maxHeight=' + css.maxHeight + ' | vpH=' + visualViewport.height
```

**Expected**: `popR.top >= btnR.bottom` (popup below button, not covering it)

## Dev Server Caching Issue

If HTML changes don't take effect after editing, restart the vite dev server. Vite caches old HTML versions and serves stale content.

**Fix**: Kill and restart dev server:
```bash
# Kill existing
taskkill /F /IM node.exe

# Restart
npm run dev
```

## Common Issues

1. **Popup covering button**: Use `top: 100%` not calculated offsets
2. **Stale HTML after edit**: Restart dev server
3. **Popup overflowing viewport**: Check maxHeight calculation
4. **No popup shown**: Check if component has required attributes in HTML
