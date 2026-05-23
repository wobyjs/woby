---
name: woby-component-patterns
description: Woby component development best practices and patterns for building reactive UI components. Use when creating custom elements, building component libraries, writing TSX components with reactive classes, or improving Woby component code. Covers cls vs class convention, defaults() patterns, observable props, and Tailwind integration.
---

# Woby Component Patterns

Guidelines for building reactive UI components with Woby framework.

## Core Principle: cls Override, class Append

Every Woby component MUST follow this contract:

| Prop | Purpose | Behavior |
|------|---------|----------|
| `cls` | Consumer's override classes | **Replaces** default styles when provided |
| `class` | Consumer's append classes | **Added to** default styles |

```tsx
// CORRECT: cls overrides, class appends
<div class={[() => $$(cls) ?? 'default-styles', class]}>

// WRONG: Both append (confuses consumer expectations)
<div class={['default-styles', cls]}>
```

### Why This Contract Matters

- **`cls`**: Consumer wants full control → replace default completely
- **`class`**: Consumer wants to extend → add without removing defaults

```
<Comp cls="custom-override" class="custom-addon">
<!-- Result: "custom-override custom-addon" -->
<!-- cls replaces defaults, class adds on top -->
```

## Custom Elements with `defaults()`

### Required Props Pattern

Every custom element MUST expose both `cls` and `class`:

```typescript
import { $, type JSX } from 'woby'

const def = () => ({
  cls: $('') as ObservableMaybe<string>,  // Override (replaces defaults)
  class: $('') as ObservableMaybe<string>, // Append (adds to defaults)
  // ... other props
})

const MyElement = defaults(def, (props) => {
  const { cls, class: className, children, ...rest } = props

  return (
    <div class={[() => $$(cls) ?? 'base-component', className]} {...rest}>
      {children}
    </div>
  )
})
```

### Complete Example (modal pattern)

```typescript
import { $, $$, useMemo, type JSX, ObservableMaybe, HtmlBoolean, HtmlString, HtmlNumber } from "woby"
import { customElement, defaults } from 'woby'

const def = () => ({
  // Observable props with types
  visible: $(false, HtmlBoolean) as ObservableMaybe<boolean>,
  draggable: $(true, HtmlBoolean) as ObservableMaybe<boolean>,
  showCloseButton: $(true, HtmlBoolean) as ObservableMaybe<boolean>,
  animation: $("zoom", HtmlString) as ObservableMaybe<string>,
  duration: $(300, HtmlNumber) as ObservableMaybe<number>,
  onClose: undefined,

  // Styling props (BOTH REQUIRED)
  cls: $('') as ObservableMaybe<string>,   // Override
  class: $('') as ObservableMaybe<string>, // Append
})

const ModalDialog = defaults(def, (props) => {
  const { cls, class: className, visible, animation, duration, children } = props

  const animationClass = useMemo(() => $$(animation) === 'zoom'
    ? 'transition-transform duration-300'
    : '')

  return (
    <div
      class={[
        () => $$(cls) ? $$(cls) : 'fixed z-[101] h-[60%] bg-white shadow-lg',
        className
      ]}
      visible={$$(visible)}
    >
      {children}
    </div>
  )
})

customElement('modal-dialog', ModalDialog)
```

## Class Array Syntax

### Reactive Class Expressions

```tsx
// Observable-based (dynamic)
class={[
  () => $$(isActive) ? 'bg-blue-500' : 'bg-gray-200',
  className
]}

// Conditional default replacement
class={[() => $$(cls) ?? 'default-base', className]}

// Multiple observables
class={[
  () => $$(variant) === 'primary' ? 'text-blue-600' : 'text-gray-600',
  () => $$(size) === 'large' ? 'p-4' : 'p-2',
  className
]}
```

### Object Syntax (Named Classes)

```tsx
class={{
  'active': () => $$(isActive),
  'disabled': () => $$(isDisabled),
  [className]: true  // Append user's class
}}
```

## Destructuring with Aliasing

When props have `class` name conflicts:

```typescript
// Inside component (class keyword conflict)
const { cls, class: className, ...rest } = props

// Or extract from props object directly
const cls = props.cls
const className = props.class
```

## Common Mistakes to Avoid

### ❌ WRONG: Append both
```tsx
<div class={['default', cls]}>
// If cls="custom", result: "default custom" (cls doesn't override!)
```

### ❌ WRONG: Conditional that loses defaults
```tsx
<div class={cls || 'default'}>
// If cls="", result: "default" (correct), but fragile
```

### ❌ WRONG: Non-reactive cls check
```tsx
<div class={['default', cls]}>
// cls might be an Observable, not a string!
```

### ✅ CORRECT: Reactive with fallback
```tsx
<div class={[() => $$(cls) ?? 'default', class]}>
// Handles Observable, string, empty cases properly
```

## Props vs Attributes

Custom elements receive values via:

```tsx
// In JSX (props)
<MyComp cls="override" class="append" />

// In HTML (attributes - need type conversion)
<my-comp cls="override" class="append"></my-comp>

// Observable receivers
visible={true}         // boolean
cls={someObservable}   // reactive string
```

## Testing Your Component

When testing, verify the class contract:

```tsx
// Test cls overrides defaults
expect(element.classList).toContain('custom-override')

// Test class appends to defaults
expect(element.classList).toContain('base-component')
expect(element.classList).toContain('user-addon')

// Test both together
<Comp cls="full-override" class="addon-class">
// Result should be: "full-override addon-class" (no defaults!)
```

## Quick Reference

```typescript
// 1. Define defaults with BOTH cls and class
const def = () => ({
  cls: $(''),
  class: $(''),
  // ... other props
})

// 2. Destructuring (avoid 'class' keyword)
const { cls, class: className, ...rest } = props

// 3. Apply class array pattern
class={[() => $$(cls) ?? 'default-styles', className]}

// 4. Optional: Add type for class prop
class?: JSX.Class

// 5. Pass className to children for composition
<InnerComponent class={className} />
```