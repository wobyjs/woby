# Basic Demos

This section covers the fundamental demo applications that showcase core Woby concepts. These demos are perfect for learning the framework basics.

## Table of Contents

- [Counter Demo](#counter-demo)
- [Clock Demo](#clock-demo)
- [Store Counter Demo](#store-counter-demo)
- [Emoji Counter Demo](#emoji-counter-demo)

## Counter Demo

**Location**: `demo/counter/`  
**Run**: `pnpm dev:counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

### Overview

The counter demo demonstrates the most basic Woby concepts including reactive state, event handling, and component composition.

### Key Features

- Basic observable state with `$()`
- Event handlers with `onClick`
- Custom element creation with `customElement()`
- Component composition

### Source Code

```typescript
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes } from 'woby'

const Counter = ({ increment, decrement, value, ...props }: { 
  increment: () => number, 
  decrement: () => number, 
  value: Observable<number> 
}): JSX.Element => {
  const v = $('abc')
  const m = useMemo(() => {
    return $$(value) + $$(v)
  })
  
  return <div {...props}>
    <h1>Counter</h1>
    <p>{value}</p>
    <p>{m}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
}

// Register as custom element
customElement('counter-element', Counter, 'value', 'class')

const App = () => {
  const value = $(0)
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  return [
    <counter-element 
      value={value} 
      increment={increment} 
      decrement={decrement} 
      class="border-2 border-black border-solid bg-amber-400" 
    />,
    <Counter value={value} increment={increment} decrement={decrement} />
  ]
}

render(<App />, document.getElementById('app'))
```

### Learning Points

1. **Observables**: `$(0)` creates reactive state
2. **Updates**: `value(prev => prev + 1)` updates state
3. **Computed Values**: `useMemo` for derived state
4. **Custom Elements**: Register components as web components
5. **Component Reuse**: Same component used in different ways

### What to Notice

- No re-render of entire component, only changed parts update
- Custom elements work alongside regular components
- State updates are automatically tracked
- No dependency arrays needed for `useMemo`

---

## Clock Demo

**Location**: `demo/clock/`  
**Run**: `pnpm dev:clock`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-clock-w1e7yb)

### Overview

An animated SVG clock that updates in real-time, demonstrating animation loops and time-based updates.

### Key Features

- Animation loops with `useAnimationLoop`
- SVG rendering and manipulation
- Time-based calculations
- Smooth animations

### Source Code Highlights

```typescript
import { $, render, useAnimationLoop } from 'woby'

const useTime = () => {
  const time = $(getMillisecondsSinceMidnight() / 1000)
  
  const tick = () => time(getMillisecondsSinceMidnight() / 1000)
  useAnimationLoop(tick)
  
  return time
}

const ClockFace = ({ time }: { time: Observable<number> }): JSX.Element => {
  const abstract = (rotate: number) => `rotate(${(rotate * 360).toFixed(1)})`
  const millisecond = () => abstract(time() % 1)
  const second = () => abstract((time() % 60) / 60)
  const minute = () => abstract((time() / 60 % 60) / 60)
  const hour = () => abstract((time() / 60 / 60 % 12) / 12)

  return (
    <svg viewBox="0 0 100 100">
      <g transform="translate(50, 50)">
        <circle class="clock-face" r={48} />
        {/* Clock marks */}
        {mapRange(0, 60, 1, i => (
          <line class="minor" y1={44} y2={45} transform={`rotate(${(360 * i) / 60})`} />
        ))}
        {/* Clock hands */}
        <line class="millisecond" y2={-44} transform={millisecond} />
        <line class="hour" y2={-22} transform={hour} />
        <line class="minute" y2={-32} transform={minute} />
        <line class="second" y2={-38} transform={second} />
      </g>
    </svg>
  )
}
```

### Learning Points

1. **Animation Loops**: `useAnimationLoop` for smooth animations
2. **Time Calculations**: Converting time to rotation angles
3. **SVG Rendering**: Creating SVG elements with JSX
4. **Dynamic Transforms**: Updating SVG transforms reactively
5. **Helper Functions**: Utility functions for cleaner code

### What to Notice

- Smooth 60fps animation without manual optimization
- SVG elements update only when needed
- Time calculations are automatically reactive
- Clean separation of concerns

---

## Store Counter Demo

**Location**: `demo/store_counter/`  
**Run**: `pnpm dev:store_counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-store-counter-kvoqrw)

### Overview

Demonstrates complex state management using Woby stores for nested and structured data.

### Key Features

- Store-based state management
- Nested reactive objects
- Multiple state properties
- Complex state updates

### Source Code Highlights

```typescript
import { store, render } from 'woby'

// Create a reactive store
const appStore = store({
  counter: {
    value: 0,
    step: 1
  },
  settings: {
    theme: 'light',
    showStep: true
  }
})

const Counter = () => {
  const increment = () => {
    appStore.counter.value(prev => prev + appStore.counter.step())
  }
  
  const decrement = () => {
    appStore.counter.value(prev => prev - appStore.counter.step())
  }
  
  const updateStep = (newStep: number) => {
    appStore.counter.step(newStep)
  }

  return (
    <div class={`theme-${appStore.settings.theme()}`}>
      <h1>Store Counter</h1>
      
      <div>
        <p>Count: {appStore.counter.value}</p>
        {appStore.settings.showStep() && (
          <p>Step: {appStore.counter.step}</p>
        )}
      </div>
      
      <div>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
      
      <div>
        <input 
          type="number" 
          value={appStore.counter.step}
          onInput={e => updateStep(parseInt(e.target.value) || 1)}
        />
        <label>
          <input 
            type="checkbox" 
            checked={appStore.settings.showStep}
            onChange={e => appStore.settings.showStep(e.target.checked)}
          />
          Show Step
        </label>
      </div>
    </div>
  )
}
```

### Learning Points

1. **Store Creation**: `store()` for complex state structures
2. **Nested Reactivity**: Automatic reactivity for nested properties
3. **Fine-grained Updates**: Only changed properties trigger updates
4. **State Organization**: Logical grouping of related state
5. **Multiple Components**: Sharing store across components

### What to Notice

- Each property in the store is independently reactive
- Nested objects maintain reactivity
- Updates to one property don't affect others
- Clean separation of state concerns

---

## Emoji Counter Demo

**Location**: `demo/emoji_counter/`  
**Run**: `pnpm dev:emoji_counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-emoji-counter-j91iz2)

### Overview

A fun, interactive counter that uses emojis and demonstrates user interaction patterns and visual feedback.

### Key Features

- Interactive emoji selection
- Visual state feedback
- Multiple interaction methods
- Fun user experience

### Source Code Highlights

```typescript
import { $, render } from 'woby'

const EmojiCounter = () => {
  const count = $(0)
  const selectedEmoji = $('👍')
  
  const emojis = ['👍', '❤️', '😊', '🎉', '🔥', '⭐']
  
  const increment = () => count(prev => prev + 1)
  const decrement = () => count(prev => prev - 1)
  const reset = () => count(0)
  
  const getCountDisplay = () => {
    const c = count()
    if (c === 0) return '🚫'
    return selectedEmoji().repeat(Math.min(c, 10)) + (c > 10 ? '...' : '')
  }

  return (
    <div class="emoji-counter">
      <h1>Emoji Counter</h1>
      
      <div class="emoji-display">
        {getCountDisplay()}
      </div>
      
      <div class="count-display">
        Count: {count}
      </div>
      
      <div class="emoji-selector">
        {emojis.map(emoji => (
          <button 
            class={`emoji-btn ${selectedEmoji() === emoji ? 'selected' : ''}`}
            onClick={() => selectedEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      <div class="controls">
        <button onClick={increment}>Add {selectedEmoji}</button>
        <button onClick={decrement}>Remove {selectedEmoji}</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
```

### Learning Points

1. **Multiple State**: Managing multiple reactive values
2. **Computed Display**: Dynamic content based on state
3. **Conditional Rendering**: Different display based on count
4. **Interactive Selection**: User-driven state changes
5. **Visual Feedback**: CSS classes for visual state

### What to Notice

- Multiple observables work together seamlessly
- State changes trigger appropriate UI updates
- User interactions feel immediate and responsive
- Complex display logic remains simple

---

## Common Patterns Across Basic Demos

### 1. Observable Creation
All demos use `$()` to create reactive state:
```typescript
const count = $(0)
const name = $('initial')
const items = $([])
```

### 2. State Updates
Consistent patterns for updating state:
```typescript
// Direct value
count(5)

// Function update
count(prev => prev + 1)

// Multiple updates
batch(() => {
  count(0)
  name('reset')
})
```

### 3. Event Handling
Simple event handling without special syntax:
```typescript
<button onClick={() => count(count() + 1)}>+</button>
<input onInput={e => name(e.target.value)} />
```

### 4. Conditional Rendering
Clean conditional rendering patterns:
```typescript
{count() > 0 && <div>Positive count!</div>}
{items().length === 0 ? <EmptyState /> : <ItemList />}
```

## Next Steps

After exploring these basic demos:

1. **Try Interactive Demos**: Move to [Interactive Demos](./Interactive-Demos.md)
2. **Explore Performance**: Check out [Performance Demos](./Performance-Demos.md)
3. **Study Patterns**: Review [Code Patterns](./Code-Patterns.md)
4. **Build Your Own**: Follow [Creating New Demos](./Creating-New-Demos.md)

Each basic demo builds on the previous concepts, providing a solid foundation for understanding more complex Woby applications.