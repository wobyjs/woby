# Demo Applications

Comprehensive documentation for all Woby demo applications. These demos showcase framework features and provide practical learning examples.

## 📚 Overview

The Woby demo collection includes applications ranging from basic learning examples to complex performance benchmarks. Each demo is designed to teach specific concepts and demonstrate best practices.

**Repository**: [@woby/demo](https://github.com/wobyjs/demo)

## 🚀 Getting Started with Demos

### Quick Setup
```bash
# Clone the demo repository
git clone https://github.com/wobyjs/demo.git
cd demo

# Install dependencies
pnpm install

# Run the playground demo
pnpm dev
```

### Running Individual Demos
```bash
# Basic counter example
pnpm dev:counter

# Real-time clock
pnpm dev:clock

# Performance benchmark
pnpm dev:benchmark

# Animated boxes
pnpm dev:boxes
```

## 📋 Demo Categories

### Learning Demos
Perfect for understanding core Woby concepts:

#### [Counter Demo](./demos/Counter-Demo.md)
- **Concepts**: Basic reactivity, event handling, custom elements
- **Run**: `pnpm dev:counter`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

Basic reactive counter demonstrating:
```typescript
const Counter = () => {
  const count = $(0)
  const increment = () => count(prev => prev + 1)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

#### [Clock Demo](./demos/Clock-Demo.md) 
- **Concepts**: Animation loops, time-based updates, SVG rendering
- **Run**: `pnpm dev:clock`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-clock-w1e7yb)

Real-time animated SVG clock showing smooth animations:
```typescript
const Clock = () => {
  const time = useTime()
  
  return (
    <svg viewBox="0 0 100 100">
      <g transform="translate(50, 50)">
        <line y2={-30} transform={`rotate(${hourAngle(time)})`} />
      </g>
    </svg>
  )
}
```

#### [Store Counter Demo](./demos/Store-Counter-Demo.md)
- **Concepts**: Complex state management, nested reactivity
- **Run**: `pnpm dev:store_counter`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-store-counter-kvoqrw)

State management with stores:
```typescript
const appStore = store({
  counter: { value: 0, step: 1 },
  settings: { theme: 'light' }
})

// Nested reactivity works automatically
appStore.counter.value(prev => prev + appStore.counter.step())
```

### Interactive Demos

#### [Playground Demo](./demos/Playground-Demo.md)
- **Concepts**: All framework features, testing environment
- **Run**: `pnpm dev:playground`
- **Live**: [CodeSandbox](https://codesandbox.io/s/playground-7w2pxg)

Comprehensive testing environment with all Woby features and extensive test suite.

#### [Emoji Counter Demo](./demos/Emoji-Counter-Demo.md)
- **Concepts**: User interaction, visual feedback, fun UX
- **Run**: `pnpm dev:emoji_counter`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-emoji-counter-j91iz2)

Interactive emoji-based counter with selection and visual feedback.

### Performance Demos

#### [Benchmark Demo](./demos/Benchmark-Demo.md)
- **Concepts**: Performance measurement, framework comparison
- **Run**: `pnpm dev:benchmark`
- **Live**: [Framework Benchmark](https://krausest.github.io/js-framework-benchmark/current.html)

Performance benchmarking suite comparing Woby with other frameworks.

#### [Triangle Demo](./demos/Triangle-Demo.md)
- **Concepts**: Recursive rendering, performance optimization
- **Run**: `pnpm dev:triangle`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-triangle-l837v0)

Sierpinski triangle benchmark testing recursive component performance.

#### [Boxes Demo](./demos/Boxes-Demo.md)
- **Concepts**: Animation performance, many elements
- **Run**: `pnpm dev:boxes`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-boxes-wx6rqb)

Animated boxes demonstrating smooth performance with many moving elements.

#### [UIBench Demo](./demos/UIBench-Demo.md)
- **Concepts**: UI performance testing, real-world patterns
- **Run**: `pnpm dev:uibench`

Comprehensive UI performance benchmark with various interaction patterns.

### API Demonstration Demos

#### [HTML Demo](./demos/HTML-Demo.md)
- **Concepts**: Template literals, alternative syntax
- **Run**: `pnpm dev:html`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-html-lvfeyo)

Using HTML template literals instead of JSX:
```typescript
import { html } from 'woby'

const Component = () => {
  const count = $(0)
  return html`
    <div>
      <p>Count: ${count}</p>
      <button onclick=${() => count(c => c + 1)}>+</button>
    </div>
  `
}
```

#### [HyperScript Demo](./demos/HyperScript-Demo.md)
- **Concepts**: Functional component creation, alternative APIs
- **Run**: `pnpm dev:hyperscript`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-hyperscript-h4rf38)

Using HyperScript for component creation:
```typescript
import { h } from 'woby'

const Component = () => {
  const count = $(0)
  return h('div', [
    h('p', `Count: ${count()}`),
    h('button', { onclick: () => count(c => c + 1) }, '+')
  ])
}
```

#### [Spiral Demo](./demos/Spiral-Demo.md)
- **Concepts**: Mathematical animations, complex calculations
- **Run**: `pnpm dev:spiral`
- **Live**: [CodeSandbox](https://codesandbox.io/s/demo-spiral-ux33p6)

Animated mathematical spiral demonstrating smooth animations and calculations.

## 🎯 Learning Paths

### For Beginners
1. **Start with Counter** - Learn basic reactivity
2. **Try Clock** - Understand time-based updates
3. **Explore Store Counter** - Complex state management
4. **Play with Playground** - Interactive exploration

### For Performance Enthusiasts
1. **Run Benchmark** - See framework performance
2. **Test Triangle** - Recursive rendering limits
3. **Animate Boxes** - Many element performance
4. **Measure UIBench** - Real-world patterns

### For API Exploration
1. **Standard JSX** - Counter and Clock demos
2. **HTML Templates** - HTML demo
3. **HyperScript** - Functional approach
4. **Custom Elements** - Web component integration

### For Custom Element Developers
1. **Counter Demo** - Basic custom element creation
2. **Nested Properties Demo** - Advanced custom element features
3. **Custom Element Practical Guide** - Comprehensive patterns and best practices
4. **Playground Demo** - Advanced custom element testing

## 🛠️ Development Patterns

### Common Patterns Across Demos

#### State Management
```typescript
// Simple state
const count = $(0)

// Complex state with stores
const appState = store({
  user: { name: 'John', settings: {} },
  ui: { theme: 'light', sidebar: false }
})

// Computed values
const doubled = useMemo(() => count() * 2)
```

#### Event Handling
```typescript
// Direct updates
<button onClick={() => count(c => c + 1)}>+</button>

// Function references
const increment = () => count(c => c + 1)
<button onClick={increment}>+</button>

// With event objects
<input onInput={e => name(e.target.value)} />
```

#### Component Composition
```typescript
// Props passing
const App = () => {
  const count = $(0)
  return <Counter value={count} onIncrement={() => count(c => c + 1)} />
}

// Children patterns
const Layout = ({ children }) => (
  <div class="layout">{children}</div>
)
```

#### Performance Optimization
```typescript
// Batched updates
batch(() => {
  setLoading(false)
  setData(response)
  setError(null)
})

// Memoized computations
const expensiveValue = useMemo(() => heavyCalculation(data()))

// Efficient lists
<For values={items}>
  {item => <ItemComponent item={item} />}
</For>
```

## 📈 Performance Insights

### Framework Benchmarks
Based on the benchmark demo results:

- **Startup performance**: Fast initial render
- **Update performance**: Fine-grained reactive updates
- **Memory usage**: Efficient memory management
- **Bundle size**: Compact framework size

### Optimization Techniques
Demonstrated across demos:

1. **Fine-grained reactivity** - Only changed elements update
2. **Automatic batching** - Multiple updates optimized automatically
3. **Efficient algorithms** - Smart diffing and updates
4. **Memory management** - Automatic cleanup

## 🎨 Styling and Design

### CSS Approaches Used
Different demos demonstrate various styling approaches:

#### Inline Styles
```typescript
<div style={{ color: 'red', fontSize: '16px' }}>Content</div>
```

#### CSS Classes
```typescript
<div class="button primary">Button</div>
```

#### Dynamic Styles
```typescript
<div style={{ color: isActive() ? 'blue' : 'gray' }}>Content</div>
```

#### CSS-in-JS
```typescript
const styles = {
  container: { padding: '20px' },
  button: { backgroundColor: theme() === 'dark' ? '#333' : '#fff' }
}
```

## 🧪 Testing Patterns

### Demo Testing Approaches

#### Playground Testing
The playground demo includes comprehensive test suites:
```typescript
const TestComponent = () => {
  // Automated testing of component behavior
  useEffect(() => {
    // Verify component updates correctly
    assert(component.innerHTML === expectedHTML)
  })
  
  return <ComponentUnderTest />
}
```

#### Performance Testing
```typescript
const measurePerformance = () => {
  const start = performance.now()
  // Perform operations
  const end = performance.now()
  console.log(`Operation took ${end - start}ms`)
}
```

#### Visual Testing
Many demos include visual verification:
- Manual testing through interaction
- Visual comparison with expected results
- Performance monitoring tools

## 🔄 Contributing New Demos

### Demo Creation Guidelines

#### 1. Educational Value
- Clear learning objectives
- Progressive complexity
- Practical applications
- Best practice demonstrations

#### 2. Code Quality
- TypeScript usage
- Proper error handling
- Performance optimization
- Clean, readable code

#### 3. Documentation
- Clear explanations
- Code comments
- Learning points
- Next steps

### Submission Process
1. **Create demo directory** following existing structure
2. **Implement demo** with proper TypeScript and error handling
3. **Add documentation** explaining concepts and usage
4. **Test thoroughly** across different browsers
5. **Submit pull request** with detailed description

For detailed guidelines, see [Contributing to Woby Demo](https://github.com/wobyjs/demo/blob/main/doc/Contributing.md).

## 🔗 Additional Resources

### Live Demos
- [Playground](https://codesandbox.io/s/playground-7w2pxg) - Interactive environment
- [Counter](https://codesandbox.io/s/demo-counter-23fv5) - Basic example
- [Clock](https://codesandbox.io/s/demo-clock-w1e7yb) - Animated clock
- [All Demos Collection](https://codesandbox.io/@woby) - Complete collection

### Documentation
- [Woby Core Documentation](./Home.md) - Main framework docs
- [API Reference](./Core-Methods.md) - Complete API documentation
- [Examples Gallery](./Examples.md) - Code examples and patterns
- [Custom Element Practical Guide](./demos/Custom-Element-Practical-Guide.md) - Hands-on custom element patterns

### Community
- [GitHub Repository](https://github.com/wobyjs/woby) - Main framework
- [Demo Repository](https://github.com/wobyjs/demo) - Demo collection
- [Discussions](https://github.com/wobyjs/woby/discussions) - Community discussions

---

The demo applications provide the best way to learn Woby through practical examples. Start with the basic demos and progressively explore more complex examples to master the framework.