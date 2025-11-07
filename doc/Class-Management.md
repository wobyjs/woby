# Class Management in Woby

Woby provides powerful built-in class management that supports complex class expressions with full reactive observable support, similar to popular libraries like `classnames` and `clsx`.

## Overview

Unlike other frameworks that require external libraries for advanced class management, Woby has this functionality built-in. This eliminates the need for dependencies like `classnames` or `clsx` while providing the same powerful features with full reactivity support.

## Supported Class Expression Types

### 1. String Classes

Simple string classes work exactly as you'd expect:

```tsx
<div class="button primary">Click me</div>
```

### 2. Array-based Classes

Arrays allow you to combine multiple classes, including conditional ones:

```tsx
// Simple array
<div class={['button', 'primary']}>Click me</div>

// Array with conditional classes
const isActive = $(false)
<div class={['button', isActive() ? 'active' : 'inactive']}>Toggle me</div>

// Nested arrays
<div class={['base', ['secondary', ['tertiary']]]}>Nested classes</div>

// Complex mixed array
<div class={[
  "red",
  () => ($$(value) % 2 === 0 ? "bold" : ""),
  { hidden: true, italic: false },
  ['hello', ['world']]
]}>Complex classes</div>
```

### 3. Object-based Classes

Objects provide a clean way to conditionally apply classes where keys are class names and values are boolean conditions:

```tsx
const error = $(false)
const warning = $(false)
const disabled = $(true)

<div class={{
  'base': true,                    // Always applied
  'error': error,                  // Applied when error is truthy
  'warning': warning,              // Applied when warning is truthy
  'disabled': disabled,            // Applied when disabled is truthy
  'success': !error && !warning    // Applied when neither error nor warning
}}>Status element</div>
```

### 4. Function-based Classes

Functions allow for dynamic class computation:

```tsx
const count = $(0)

// Simple function
<div class={() => count() > 5 ? 'high-count' : 'low-count'}>
  Count: {count}
</div>

// Function returning complex expression
<div class={() => [
  'base',
  count() > 10 ? 'large' : 'small',
  { 'even': count() % 2 === 0 }
]}>
  Dynamic element
</div>
```

### 5. Observable-based Classes

Woby's reactivity system works seamlessly with class expressions:

```tsx
const theme = $('dark')
const size = $('medium')
const isActive = $(false)

<div class={[
  'button',
  () => `theme-${$$(theme)}`,      // Reactive theme class
  () => `size-${$$(size)}`,        // Reactive size class
  { 'active': isActive }           // Reactive boolean class
]}>
  Themed button
</div>
```

## Advanced Patterns

### Conditional Styling with Complex Logic

```tsx
const status = $('success')
const isLoading = $(false)
const isUrgent = $(false)

const statusClass = useMemo(() => {
  switch ($$(status)) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

<div class={[
  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
  statusClass,
  {
    'animate-pulse': isLoading,
    'border-2 border-red-500': isUrgent && status === 'error'
  }
]}>
  <span class={[
    'w-2 h-2 rounded-full mr-2',
    () => {
      switch ($$(status)) {
        case 'success':
          return 'bg-green-500'
        case 'warning':
          return 'bg-yellow-500'
        case 'error':
          return 'bg-red-500'
        default:
          return 'bg-gray-500'
      }
    }
  ]} />
  {status}
</div>
```

### Integration with Tailwind CSS

Woby works seamlessly with Tailwind CSS for utility-first styling:

```tsx
const Button = ({ variant = 'primary', size = 'md', disabled = false, children }) => {
  return (
    <button class={[
      // Base classes
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      
      // Size variants
      () => {
        switch ($$(size)) {
          case 'sm':
            return 'text-xs px-2.5 py-1.5'
          case 'lg':
            return 'text-base px-6 py-3'
          case 'xl':
            return 'text-lg px-8 py-4'
          default: // md
            return 'text-sm px-4 py-2'
        }
      },
      
      // Variant styles
      () => {
        if ($$(disabled)) {
          return 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }
        
        switch ($$(variant)) {
          case 'secondary':
            return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          case 'danger':
            return 'bg-red-600 text-white hover:bg-red-700'
          case 'ghost':
            return 'bg-transparent text-gray-700 hover:bg-gray-100'
          default: // primary
            return 'bg-blue-600 text-white hover:bg-blue-700'
        }
      },
      
      // Additional states
      {
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2': true,
        'opacity-75': disabled
      }
    ]}>
      {children}
    </button>
  )
}
```

## Reactive Elements and useMemo

All reactive elements in class expressions should be wrapped in `useMemo` or arrow functions `() =>` to ensure proper reactivity:

```tsx
// ✅ Correct - wrapped in arrow function
const isActive = $(false)
<div class={() => $$(isActive) ? 'active' : 'inactive'}>Content</div>

// ✅ Correct - observables automatically handled in objects
<div class={{ 'active': isActive }}>Content</div>

// ✅ Complex expression with useMemo
const dynamicClass = useMemo(() => ({
  'active': $$(isActive),
  'disabled': $$(isDisabled),
  'loading': $$(isLoading)
}))

<div class={dynamicClass}>Content</div>

// ❌ Incorrect - will not update reactively
<div class={{ 'active': isActive() ? 'yes' : 'no' }}>Content</div>
```

## Migration from CLSX/Classnames

If you're familiar with `clsx` or `classnames`, Woby's class system works similarly:

```tsx
// Instead of: clsx('foo', true && 'bar', 'baz')
<div class={['foo', true && 'bar', 'baz']}>Content</div>

// Instead of: clsx({ foo:true, bar:false, baz:isTrue() })
<div class={{ foo:true, bar:false, baz:isTrue() }}>Content</div>

// Instead of: clsx(['foo', 0, false, 'bar'])
<div class={['foo', 0, false, 'bar']}>Content</div>
```

## Performance Considerations

Woby's class management is optimized for performance:

1. **Fine-grained updates**: Only classes that change are updated in the DOM
2. **Memoization**: Complex expressions are memoized to prevent unnecessary recalculations
3. **Direct DOM manipulation**: No virtual DOM overhead
4. **Automatic dependency tracking**: Woby knows exactly what needs to be updated

## Best Practices

1. **Use objects for simple conditionals**: `{ 'class': boolean }` is clean and readable
2. **Use arrays for complex combinations**: Arrays allow mixing different types
3. **Wrap reactive expressions**: Use `() =>` or `useMemo` for reactive values
4. **Leverage Tailwind**: Woby's class system works excellently with utility-first CSS
5. **Keep it readable**: Complex class expressions can become hard to maintain

## Comparison with Other Libraries

| Feature | Woby | CLSX | Classnames |
|---------|------|------|------------|
| Built-in | ✅ | ❌ | ❌ |
| Reactivity | ✅ | ❌ | ❌ |
| Array support | ✅ | ✅ | ✅ |
| Object support | ✅ | ✅ | ✅ |
| Function support | ✅ | ✅ | ✅ |
| Nested arrays | ✅ | ✅ | ✅ |
| Performance | ✅✅ | ✅ | ✅ |
| Bundle size | Included | 239B | 500B+ |

Woby's built-in class management provides all the features of external libraries while adding reactivity support and eliminating the need for additional dependencies.