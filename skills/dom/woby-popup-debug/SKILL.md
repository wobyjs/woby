---
name: woby-popup-debug
description: Debugging techniques for Woby popup positioning issues
tags: [woby, dropdown, popup, positioning, viewport, useViewportSize, debugging]
---

# Woby Popup Debugging

## `top` Rule: Bottom vs Right Placement

`top: 100%` means "start below the container bottom". This is correct for **bottom** placement only.

For **right** placement the popup is to the SIDE of the button (`left-full`). Use `topOffset` to align the popup top with the button top and shift it up if the button is near the viewport bottom:

```tsx
// CORRECT pattern for both placements
style={{
    top: () => placement === 'bottom' ? '100%' : topOffset,
    marginTop: () => placement === 'bottom' ? '4px' : '0px',
    marginLeft: () => placement === 'right' ? '4px' : '0px',
    maxHeight: () => maxHeight,   // MUST use () => for reactivity
    overflow: 'auto'
}}
```

`topOffset = 0` for right placement aligns the popup top with the button container top — it does NOT cover the button because the popup is at `left: 100%` (to the right). Negative `topOffset` shifts the popup upward so it fits inside the viewport when the button is near the bottom edge.

### Old Wrong Advice (DO NOT USE)
```tsx
// WRONG — forces popup below button even for right placement
top: '100%'   // for right placement this puts popup BELOW-right, not beside button
```
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
