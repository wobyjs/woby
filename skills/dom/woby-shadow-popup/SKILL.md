---
name: woby-shadow-popup
description: Shadow DOM event retargeting fixes and popup positioning patterns for Woby components. Covers useClickAway composedPath fix, setTimeout positioning after render, and browser console debugging.
tags: [woby, shadow-dom, popup, positioning, events]
---

# Woby Shadow DOM + Popup Patterns

## Shadow DOM Event Retargeting (CRITICAL for useClickAway)

When events fire inside shadow DOM, `event.target` is **retargeted** to the shadow host element. This breaks `useClickAway` and similar hooks that check `event.target`.

**Problem:**
```typescript
// In shadow DOM: clicking on <tr> inside a modal
// event.target = shadow host element (e.g., <my-component>)
// NOT the actual <tr> that was clicked!
```

**Fix for `@woby/use` useClickAway:**
```typescript
// useClickAway.tsx - use composedPath()[0] instead of event.target
export function useClickAway<T = HTMLElement>(ref: Observable<T>, clickEvent: () => void) {
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Get the ACTUAL element clicked (not retargeted)
            const actualTarget = event.composedPath?.()?.[0] || event.target
            if (refs.length && !refs.some(el => el.contains(actualTarget)))
                clickEvent()
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    })
}
```

**Fix for components:** Add `onMouseDown` + `onClick` with `stopPropagation()` on modal container:
```typescript
<div
    ref={modalRef}
    onMouseDown={e => e.stopPropagation()}
    onClick={e => e.stopPropagation()}
>
    {/* popup content */}
</div>
```

## Popup/Dropdown Smart Positioning

Popup dimensions unknown before render. Cannot measure `modalRef` until popup DOM exists.

**CRITICAL:** Popup must NEVER overflow viewport. Set `maxHeight` dynamically based on available space.

**CRITICAL:** Use `useViewportSize()` hook for accurate viewport dimensions including zoom/scroll offsets. Do NOT hardcode `window.innerWidth/innerHeight` - these don't account for visual viewport changes.

**Correct pattern:**
```typescript
import { useViewportSize } from '@woby/use'

// Get viewport size reactively (includes offsetTop, offsetLeft for zoom/scroll)
const viewport = useViewportSize()

const popupStyle = $<{ left: string, top: string, maxHeight: string }>({ 
    left: '0px', top: '0px', maxHeight: '300px' 
})

const updatePopupPosition = () => {
    const btn = btnRef()
    const popup = modalRef() // null on first call!
    if (!btn) return

    const br = btn.getBoundingClientRect()
    
    // Use viewport from hook (accounts for zoom/scroll)
    const vpW = $$(viewport.width)
    const vpH = $$(viewport.height)
    const vpOffsetTop = $$(viewport.offsetTop)
    const vpOffsetLeft = $$(viewport.offsetLeft)
    
    const tableH = popup?.querySelector('table')?.getBoundingClientRect()?.height || 330
    const popupW = popup?.getBoundingClientRect()?.width || 60
    const GAP = 4

    // Button position relative to viewport
    const btnTopInVp = br.top - vpOffsetTop
    const btnLeftInVp = br.left - vpOffsetLeft

    let top: number
    let maxHeight: number

    // Calculate available space in viewport coordinates
    const spaceBelow = vpH - btnTopInVp - br.height - GAP
    const spaceAbove = btnTopInVp - GAP

    // Vertical: below if fits, otherwise above
    if (spaceBelow >= tableH) {
        top = br.bottom + GAP  // NO scrollY - using viewport coordinates
        maxHeight = spaceBelow
    } else if (spaceAbove >= tableH) {
        top = br.top - tableH - GAP
        maxHeight = spaceAbove
    } else {
        // Neither fits completely - place below with max available height
        top = br.bottom + GAP
        maxHeight = spaceBelow
    }

    // Horizontal: align left with button
    let left = br.left  // NO scrollX - using viewport coordinates

    popupStyle({ left: `${left}px`, top: `${top}px`, maxHeight: `${maxHeight}px` })
}

const buttonClick = (e: Event) => {
    e.stopPropagation()
    if (!menu()) {
        menu(true)
        setTimeout(updatePopupPosition, 0) // AFTER popup renders
    } else {
        menu(false)
    }
}

// React to viewport changes (resize, zoom, scroll)
useMemo(() => {
    viewport.width  // depend on viewport
    viewport.height
    if ($$(menu)) {
        updatePopupPosition()
    }
})()
```

**Popup container:**
```typescript
{() => $$(menu) && (
    <div 
        ref={modalRef} 
        class='fixed z-[9999] bg-white shadow-lg rounded-lg'
        style={{ 
            ...$$(popupStyle),
            overflow: 'auto'  // allow scrolling if needed
        }}
        onClick={e => e.stopPropagation()}
    >
        {/* popup content */}
    </div>
)}
```

**Key insight:** `tableH` (actual table height) is more accurate than `pr?.height` because the popup wrapper may not have intrinsic height until table renders.

**Table min-width:** Tables in shadow DOM may collapse to minimum content width. Always set explicit min-width:
```typescript
<table class='border-collapse min-w-[60px]'>
    {/* table content */}
</table>
```

## CustomElement onClick Patterns

### onClick in defaults() is Always Reactive
In Woby CustomElements, `onClick` props in `defaults()` are always wrapped in `$()` observable — no way to disable this.

### Double-Fire Problem
Without `stopPropagation()`, onClick fires twice (bubbling + woby's delegation).

**Fix:** Always add `e.stopPropagation()` in onClick handlers:
```typescript
onClick={(e) => { e.stopPropagation(); yourHandler() }}
```

### Playwright/browser_click Doesn't Trigger Woby's Shadow DOM Delegation
`browser_click` or `agent-browser eval "document.querySelector().click()"` doesn't trigger woby's delegated onClick on shadow DOM elements.

**Fix:** Use `element.click()` via JS eval:
```typescript
// WRONG - won't trigger woby's onClick delegation
agent-browser eval "document.querySelector('my-element').click()"

// CORRECT - triggers woby's shadow DOM delegation
agent-browser eval "document.querySelector('my-element').shadowRoot.querySelector('button').click()"
// OR
agent-browser eval "document.querySelector('my-element').shadowRoot.querySelector('button').dispatchEvent(new MouseEvent('click', {bubbles: true}))"
```

### Module-Level Handler Ref Pattern
For passing functions to child components without prop drilling:
```typescript
// Parent
const handlerRef = { current: null as (() => void) | null }

// Child component reads from ref
<button onClick={() => { e.stopPropagation(); handlerRef.current?.() }}>
```

## Browser Console Variable Scoping

`let`/`const` declarations persist across `browser_console` eval calls. Use fresh variable names or reload page.

## Smart Placement (Bottom/Right/Above)

**CRITICAL:** When bottom doesn't have enough space, show popup to the RIGHT of button instead of above. This is more natural for dropdown menus.

**Pattern:**
```typescript
const popupPlacement = $<{ placement: 'bottom' | 'right', maxHeight: string, topOffset: string }>({ 
    placement: 'bottom', maxHeight: '300px', topOffset: '0px' 
})

const updatePopupPlacement = () => {
    const btn = btnRef()
    const popup = modalRef()
    if (!btn || !popup) return

    const br = btn.getBoundingClientRect()
    const vpW = $$(viewport.width)
    const vpH = $$(viewport.height)
    const vpOffsetTop = $$(viewport.offsetTop)
    const vpOffsetLeft = $$(viewport.offsetLeft)

    const btnTopInVp = br.top - vpOffsetTop
    const btnLeftInVp = br.left - vpOffsetLeft

    const tableH = popup.querySelector('table')?.getBoundingClientRect()?.height || 330

    const spaceBelow = vpH - btnTopInVp - br.height - 4
    const spaceRight = vpW - btnLeftInVp - br.width - 4

    let placement: 'bottom' | 'right' = 'bottom'
    let maxHeight = spaceBelow
    let topOffset = 0

    if (spaceBelow >= tableH) {
        placement = 'bottom'
        maxHeight = spaceBelow
        topOffset = 0
    } else if (spaceRight >= tableH) {
        placement = 'right'
        // Popup goes to the right of button, need to offset vertically to fit in viewport
        const availableHeight = vpH - 8
        maxHeight = Math.min(availableHeight, tableH)
        // Offset from container's top to make popup fit in viewport
        topOffset = Math.min(0, vpH - btnTopInVp - maxHeight - 4)
    } else {
        placement = 'bottom'
        maxHeight = spaceBelow
        topOffset = 0
    }

    popupPlacement({ placement, maxHeight: `${maxHeight}px`, topOffset: `${topOffset}px` })
}
```

**CSS classes for placement:**
```typescript
<div
    ref={modalRef}
    class={['absolute z-[9999] bg-white shadow-lg rounded-lg',
        () => $$(popupPlacement).placement === 'bottom' ? 'left-0' : 'left-full ml-1'
    ]}
    style={{
        top: () => $$(popupPlacement).placement === 'bottom' ? '100%' : $$(popupPlacement).topOffset,
        marginTop: () => $$(popupPlacement).placement === 'bottom' ? '4px' : '0px',
        maxHeight: $$(popupPlacement).maxHeight,
        overflow: 'auto'
    }}
>
```

**Key insight:** `topOffset` is negative when popup needs to shift UP to fit in viewport. This happens when button is near bottom and popup shows on right side.

## CSS Relative Positioning (Preferred)

**CRITICAL:** Use CSS relative positioning (`absolute` + `left-0 top-full mt-1`) instead of calculating absolute `left/top` pixel values. This is simpler and more maintainable.

**Pattern:**
```typescript
// Container must be position: relative
<div class="relative inline-block">
    <button ref={btnRef} onClick={buttonClick}>...</button>
    
    {() => $$(menu) && (
        <div
            ref={modalRef}
            class={['absolute z-[9999] bg-white shadow-lg rounded-lg',
                () => $$(popupPlacement).placement === 'bottom' ? 'left-0' : 'left-full ml-1'
            ]}
            style={{
                top: () => $$(popupPlacement).placement === 'bottom' ? '100%' : $$(popupPlacement).topOffset,
                marginTop: () => $$(popupPlacement).placement === 'bottom' ? '4px' : '0px',
                maxHeight: $$(popupPlacement).maxHeight,
                overflow: 'auto'
            }}
        >
            <table class='border-collapse min-w-[60px]'>...</table>
        </div>
    )}
</div>
```

**Benefits:**
- No need to calculate `left` pixel value (CSS handles alignment)
- No need to add `scrollX/scrollY` (positioned relative to container)
- Popup automatically follows button on resize
- Cleaner, more maintainable code

## Pitfalls

### Viewport Overflow (CRITICAL)
**Problem:** Popup positioned below button but viewport is small → popup bottom exceeds viewport height → content cut off.

**Symptom:** User reports "popup shows 1% only" or "modal not showing full".

**Fix:** Always set `maxHeight` dynamically based on available space:
```typescript
// WRONG: fixed maxHeight
style={{ maxHeight: '80vh' }}  // can still overflow!

// CORRECT: dynamic maxHeight
popupPlacement({ maxHeight: `${spaceBelow}px` })
style={{ maxHeight: $$(popupPlacement).maxHeight, overflow: 'auto' }}
```

### Right-Side Popup Overflow
**Problem:** Popup shows on right side but still overflows viewport vertically because `topOffset` not calculated correctly.

**Symptom:** User reports "2nd/3rd btn modal not fit vertically".

**Fix:** Calculate `topOffset` to shift popup up so it fits in viewport:
```typescript
// When placement === 'right'
const availableHeight = vpH - 8
maxHeight = Math.min(availableHeight, tableH)
// Negative offset shifts popup UP from button's top
topOffset = Math.min(0, vpH - btnTopInVp - maxHeight - 4)
```

### Positioning Timing
**Problem:** `modalRef()` is `null` when `updatePopupPosition()` first called.

**Fix:** Call `updatePopupPosition()` in `setTimeout` after setting `menu(true)`:
```typescript
const buttonClick = (e: Event) => {
    e.stopPropagation()
    if (!menu()) {
        menu(true)
        setTimeout(updatePopupPosition, 0)  // AFTER popup renders
    } else {
        menu(false)
    }
}
```

### Window Resize
**Problem:** Popup position becomes stale after window resize.

**Fix:** Use `useViewportSize()` hook which automatically listens for viewport changes:
```typescript
const viewport = useViewportSize()

useMemo(() => {
    viewport.width
    viewport.height
    if ($$(menu)) {
        updatePopupPosition()
    }
})()
```

### Hardcoded Viewport Values (CRITICAL - Common Mistake)
**Problem:** Using `window.innerWidth/innerHeight` directly doesn't account for visual viewport (zoom/scroll on mobile). Popup ends up positioned far from button.

**Symptom:** User reports "all popup is offset far below btn" or "wrong calculation".

**Fix:** Always use `useViewportSize()` from `@woby/use`:
```typescript
// WRONG
const vp = { w: window.innerWidth, h: window.innerHeight }

// CORRECT
import { useViewportSize } from '@woby/use'
const viewport = useViewportSize()
const vpW = $$(viewport.width)
const vpH = $$(viewport.height)
```

---

## Related Skills

- **woby** — Main woby framework reference (observables, JSX reactivity, custom elements)
- [woby-skill-cross-reference.md](references/woby-skill-cross-reference.md) — Woby skill cross-reference

## Related Files

- [五行-color-utility.md](references/五行-color-utility.md) — 五行 color mapping for BaZi components
- [popup-positioning-examples.md](references/popup-positioning-examples.md) — Complete working example with code structure and debugging checklist
- [woby-skill-cross-reference.md](references/woby-skill-cross-reference.md) — Woby skill cross-reference
