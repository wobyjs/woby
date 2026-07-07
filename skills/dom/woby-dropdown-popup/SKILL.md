---
name: woby-dropdown-popup
description: Dropdown popup positioning with smart placement (bottom/right) and viewport fitting
tags: [woby, dropdown, popup, positioning, viewport, useViewportSize]
---

# Woby Dropdown Popup Positioning

Smart popup positioning for dropdown components that adapts to viewport constraints.

## Key Concepts

### 1. Use `useViewportSize()` Hook
Get reactive viewport dimensions including zoom/scroll offsets:

```tsx
import { useViewportSize } from '@woby/use'

const viewport = useViewportSize()
const vpW = $$(viewport.width)
const vpH = $$(viewport.height)
const vpOffsetTop = $$(viewport.offsetTop)
const vpOffsetLeft = $$(viewport.offsetLeft)
```

### 2. CSS Relative Positioning
Use `absolute` positioning relative to button container, NOT `fixed` with calculated coordinates:

```tsx
<div class="relative inline-block">
    <Button ref={btnRef}>...</Button>
    {menu() && (
        <div class="absolute z-[9999]">
            ...
        </div>
    )}
</div>
```

### 3. Placement Classes
Use Tailwind classes for positioning:

- **Bottom**: `left-0` + `top: '100%'` + `margin-top: 4px`
- **Right**: `left-full ml-1` + `top: '100%'` (NOT topOffset pixels!)

Use `top: '100%'` for **bottom** placement. For **right** placement use `topOffset` (0 or negative) so the popup aligns with the button top and shifts up when near the viewport bottom.

```tsx
class={[
    'absolute z-[9999] bg-white shadow-lg rounded-lg',
    () => placement === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'left-full'
]}
style={{
    top: () => placement === 'bottom' ? '100%' : topOffset,
    marginTop: () => placement === 'bottom' ? '4px' : '0px',
    marginLeft: () => placement === 'right' ? '4px' : '0px',
    maxHeight: () => maxHeight,   // MUST wrap in () => — plain $$(obs) reads once only
    overflow: 'auto'
}}
```

### 4. Viewport Fitting Logic (Simplified)

For viewport fitting, only adjust `maxHeight` — NOT `top` position:

```tsx
const updatePopupPlacement = () => {
    const btn = btnRef()
    const popup = modalRef()
    if (!btn || !popup) return

    const br = btn.getBoundingClientRect()
    const vpH = visualViewport.height

    const tableH = popup.querySelector('table')?.getBoundingClientRect()?.height || 330
    const spaceBelow = vpH - br.bottom

    let placement: 'bottom' | 'right' = 'bottom'
    let maxHeight = spaceBelow

    if (spaceBelow >= tableH) {
        placement = 'bottom'
        maxHeight = spaceBelow
    } else if (spaceBelow < tableH) {
        placement = 'bottom'
        maxHeight = Math.max(200, spaceBelow) // Ensure minimum visible
    }

    popupPlacement({ placement, maxHeight: `${maxHeight}px` })
}
```

### 5. Popup Auto-Sizing to Content

**Remove fixed width from popup** - Let popup auto-size to its content:

```tsx
style={{
    top: '100%',
    maxHeight: () => $$(popupPlacement).maxHeight,   // () => required for reactivity
    overflow: 'auto'
    // NO width property!
}}
```

Popup will auto-size to table width (e.g., 32px for single-column).

### 6. Center Popup with Button

For narrow popups (e.g., 天干 dropdown), center-align with button:

```tsx
class={['absolute z-[9999] bg-white shadow-lg rounded-lg left-1/2 -translate-x-1/2']}
```

This centers popup relative to button container.

### 6. Reactive Updates

Update placement when menu opens or viewport changes:

```tsx
const buttonClick = (e: Event) => {
    e.stopPropagation()
    if (!menu()) {
        menu(true)
        setTimeout(updatePopupPlacement, 0)
    } else {
        menu(false)
    }
}

useMemo(() => {
    viewport.width
    viewport.height
    if ($$(menu)) {
        updatePopupPlacement()
    }
})()
```

### 7. Click Away with Shadow DOM

Use `composedPath()[0]` for shadow DOM compatibility:

```tsx
import { useClickAway } from '@woby/use'

useClickAway(modalRef, () => menu(false))
```

The `useClickAway` hook should handle shadow DOM by using `event.composedPath?.()?.[0] || event.target`.

## Complete Pattern

```tsx
import { $, $$, useMemo } from 'woby'
import { useViewportSize, useClickAway } from '@woby/use'

function Dropdown({ ...props }) {
    const menu = $(false)
    const modalRef = $(null as HTMLElement | null)
    const btnRef = $(null as HTMLElement | null)
    const viewport = useViewportSize()

    const popupPlacement = $<{ 
        placement: 'bottom' | 'right', 
        maxHeight: string
    }>({ 
        placement: 'bottom', 
        maxHeight: '300px'
    })

    const updatePopupPlacement = () => { /* ... see above */ }

    const buttonClick = (e: Event) => {
        e.stopPropagation()
        if (!menu()) {
            menu(true)
            setTimeout(updatePopupPlacement, 0)
        } else {
            menu(false)
        }
    }

    useMemo(() => {
        viewport.width
        viewport.height
        if ($$(menu)) updatePopupPlacement()
    })()

    useClickAway(modalRef, () => menu(false))

    return (
        <div class="relative inline-block">
            <Button ref={btnRef} onClick={buttonClick}>
                {selected}
            </Button>
            {$$(menu) && (
                <div
                    ref={modalRef}
                    class={[
                        'absolute z-[9999] bg-white shadow-lg rounded-lg',
                        () => $$(popupPlacement).placement === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'left-full'
                    ]}
                    style={{
                        top: () => $$(popupPlacement).placement === 'bottom' ? '100%' : $$(popupPlacement).topOffset,
                        marginTop: () => $$(popupPlacement).placement === 'bottom' ? '4px' : '0px',
                        marginLeft: () => $$(popupPlacement).placement === 'right' ? '4px' : '0px',
                        maxHeight: () => $$(popupPlacement).maxHeight,   // () => required
                        overflow: 'auto'
                    }}
                >
                    {/* content */}
                </div>
            )}
        </div>
    )
}
```

## Pitfalls

1. **Don't use `fixed` positioning** - Use `absolute` relative to container
2. **Don't use `topOffset` with pixel values** - Causes popup to cover button!
3. **Don't calculate absolute coordinates** - Use CSS relative positioning (`left-0`, `left-full`, `top: 100%`)
4. **Don't forget viewport offset** - Use `vpOffsetTop`/`vpOffsetLeft` for zoom/scroll
5. **Don't hardcode maxHeight** - Calculate based on available space
6. **Update after render** - Use `setTimeout(updatePopupPlacement, 0)` after `menu(true)`
7. **Shadow DOM click away** - Ensure `useClickAway` uses `composedPath()[0]`
8. **Popup auto-sizing** - Remove `width` style to let popup shrink to content
9. **Center narrow popups** - Use `left-1/2 -translate-x-1/2` for center alignment

## Related

- `useViewportSize` from `@woby/use`
- `useClickAway` from `@woby/use`
- Shadow DOM event retargeting
- `/dom-portal` for nested popup patterns with `cancelOnBlur`
