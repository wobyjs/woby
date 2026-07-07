---
name: dom-portal
description: >
  Comprehensive Portal patterns for Woby/WUI components. Covers Portal mounting, dual-layer z-index strategies, nested component dismissal (cancelOnBlur), Portal vs CSS positioning tradeoffs, and Common Pitfalls. Invoke when working with modals, dropdowns, sidebars, or any component that needs to escape its DOM hierarchy.
tags: [woby, portal, modal, popup, z-index, layering, stacking]
---

# Woby Portal Patterns

Portal is essential for components that need to escape their DOM hierarchy — modals, dropdowns, sidebars, tooltips. This skill covers all portal patterns from the wui codebase.

## The Core: Portal Mount

```tsx
import { Portal } from 'woby'

<Portal mount={document.body}>
    {/* This content renders as a direct child of <body> */}
    {/* Escapes all CSS stacking contexts and overflow:hidden */}
</Portal>
```

**When to use Portal:**
- Modal dialogs that need to overlay everything
- Dropdowns that might be clipped by `overflow:hidden` parents
- Sidebars that push content (marginLeft technique)
- Tooltips with large z-index requirements
- Any UI that must always be on top

---

## Pattern 1: Basic Modal Portal

**Use case:** Simple modal with optional backdrop mask.

```tsx
import { Portal } from 'woby'

const Modal = ({ visible, onClose, children }) => (
    <Portal mount={document.body}>
        {visible && (
            <>
                {/* Backdrop - click to close */}
                <div
                    class="fixed inset-0 bg-black/50 z-50"
                    onClick={onClose}
                />
                {/* Modal content */}
                <div class="fixed inset-0 z-50 flex items-center justify-center">
                    <div class="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-auto">
                        {children}
                    </div>
                </div>
            </>
        )}
    </Portal>
)
```

**Key insight:** Portal mounts to `document.body`, not a specific container. The z-index on the inner elements handles layering.

---

## Pattern 2: Dual-Layer Portal (Sidebar + Overlay)

**Use case:** Sidebar that pushes content + dark overlay behind it.

```tsx
import { Portal, $ } from 'woby'

const Sidebar = ({ open, onClose, children }) => {
    const SidebarComponent = () => (
        <div class="fixed h-full top-0 left-0 z-10 bg-white shadow-lg">
            {children}
        </div>
    )

    const BackgroundOverlay = () => (
        <>
            {open && (
                <div
                    class="fixed inset-0 bg-black/50 z-5 transition-opacity duration-500"
                    onClick={onClose}
                />
            )}
        </>
    )

    return (
        <>
            <BackgroundOverlay />
            <Portal mount={document.body}>
                <SidebarComponent />
            </Portal>
        </>
    )
}
```

**Why separate portals?**
```
Sidebar:    z-10 (top layer)
Overlay:     z-5  (behind sidebar)
```
This ensures sidebar always appears on top of overlay.

**CSS margin-left push technique:**
```tsx
useEffect(() => {
    const contentEl = contentRef()
    if (!contentEl) return

    contentEl.style.marginLeft = open ? '250px' : '0px'
    contentEl.style.transition = 'margin-left 0.5s ease'
})
```

---

## Pattern 3: Bottom Sheet Portal (Wheeler Style)

**Use case:** Mobile-style bottom drawer that slides up.

```tsx
import { Portal } from 'woby'

const BottomSheet = ({ visible, onClose, children }) => (
    <Portal mount={document.body}>
        {visible && (
            <>
                {/* Mask overlay */}
                <div class="fixed inset-0 bg-black/50 z-10 opacity-50" />

                {/* Bottom content */}
                <div class="fixed inset-x-0 bottom-0 z-200 bg-white shadow-lg">
                    {children}
                </div>
            </>
        )}
    </Portal>
)
```

**Z-index hierarchy:**
```
Background mask:     z-10
Bottom sheet:        z-200
```

**Note:** Using `inset-x-0` (left: 0, right: 0) ensures full-width bottom sheet.

---

## Pattern 4: Nested Popup with cancelOnBlur

**Use case:** DateTime picker with nested year/month/day Wheelers.

```tsx
const DateTimeWheeler = ({ value, onChange, visible, onClose }) => {
    const cancelOnBlur = $(true)

    const handleClose = () => {
        if ($$(cancelOnBlur)) {
            onClose()
        }
    }

    useClickAway(containerRef, handleClose)

    return (
        <Portal mount={document.body}>
            {visible && (
                <>
                    <div class="fixed inset-0 bg-black/50 z-10" />

                    <div class="fixed inset-x-0 bottom-0 z-200 bg-white">
                        {/* Year Wheeler - disable its click-away */}
                        <Wheeler
                            options={yearOptions}
                            value={year}
                            cancelOnBlur={false}  // CRITICAL: Let parent handle dismissal
                            onChange={(v) => year(v)}
                        />

                        {/* Month Wheeler */}
                        <Wheeler
                            options={monthOptions}
                            value={month}
                            cancelOnBlur={false}
                            onChange={(v) => month(v)}
                        />

                        {/* Day Wheeler */}
                        <Wheeler
                            options={dayOptions}
                            value={day}
                            cancelOnBlur={false}
                            onChange={(v) => day(v)}
                        />
                    </div>
                </>
            )}
        </Portal>
    )
}
```

**Why `cancelOnBlur={false}`?**
- Inner Wheelers have their own click-away detection
- Without this flag, clicking the Month Wheeler would close the Year Wheeler first
- Parent container's `useClickAway` handles the actual close

---

## Pattern 5: Portal with Conditional Visibility

**Use case:** Return null when hidden — fully removes from DOM.

```tsx
const Popup = ({ visible, children }) => {
    const renderAsPopup = () => (
        <Portal mount={document.body}>
            <div class="fixed inset-0 z-50 flex items-center justify-center">
                {children}
            </div>
        </Portal>
    )

    // CRITICAL: Return null when not visible
    // This fully removes the portal from DOM
    return () => !visible ? null : renderAsPopup()
}
```

**Why return a function `() => ...`?**
Woby needs to re-evaluate when `visible` changes. The function wrapper ensures reactivity.

---

## Z-Index Hierarchy Strategy

**Standard z-index layers (use these consistently):**
```
5    - Background overlay (behind modals)
10   - Secondary overlays, masks
50   - Standard popups, tooltips
100  - Standard modals
200  - Bottom sheets, drawers
1000 - App bars, fixed navigation
9999 - Debug overlays (temporary)
```

**Example in code:**
```tsx
// In Wheeler component
<div class="fixed inset-0 z-[10] bg-black/50" />   // mask
<div class="fixed bottom-0 z-[200] bg-white" />    // content
```

---

## Portal vs CSS Positioning

| Scenario | Use Portal? | Reason |
|----------|-------------|--------|
| Modal overlay | Yes | Must escape all stacking contexts |
| Dropdown in scrollable container | Yes | `overflow:hidden` clips non-portals |
| Sidebar that pushes content | Yes | Content margin-left needs body-level |
| Simple tooltip (no overflow issues) | No | CSS positioning sufficient |
| Fixed notification toast | No | Fixed positioning handles it |

---

## Common Pitfalls

### Pitfall 1: Portal content still clipped
**Problem:** Portal mounted inside a container with `overflow:hidden`.

**Fix:** Always mount to `document.body` or a known-good ancestor:
```tsx
<Portal mount={document.body}>  // ✅ Correct
<Portal mount={someContainer}>  // ❌ May still be clipped
```

### Pitfall 2: Portal z-index doesn't work
**Problem:** Portal content under other elements.

**Fix:** Check if any ancestor has a higher z-index stacking context:
```css
/* The culprit might be here */
.some-ancestor {
    position: relative;
    z-index: 1000;  /* This creates a stacking context */
}
```

### Pitfall 3: Memory leak from Portal
**Problem:** Portal content not removed when parent unmounts.

**Fix:** Always use conditional rendering:
```tsx
<Portal mount={document.body}>
    {visible && <ModalContent />}  // ✅ Removes from DOM when false
</Portal>
```

### Pitfall 4: Focus trapped inside Portal
**Problem:** Tab key escapes Portal content unexpectedly.

**Fix:** Implement focus trap for modals:
```tsx
useEffect(() => {
    if (visible) {
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        focusable[0]?.focus()
    }
})
```

### Pitfall 5: Portal position relative to wrong viewport
**Problem:** Fixed positioning inside Portal relative to wrong element.

**Fix:** Ensure Portal is a direct body child:
```tsx
// ❌ Wrong - nested inside another element
<div style={{ position: 'relative' }}>
    <Portal mount={this}>
        {/* Fixed will be relative to this container! */}
    </Portal>
</div>

// ✅ Correct - direct body mount
<Portal mount={document.body}>
    {/* Fixed will be relative to viewport */}
</Portal>
```

---

## Related Skills

- `/dom` — Master DOM skill
- `/woby` — Woby framework reference
- `/dom-customelement` — CustomElement patterns
- `/woby-shadow-popup` — Shadow DOM popup patterns
- `/woby-dropdown-popup` — Dropdown positioning patterns
