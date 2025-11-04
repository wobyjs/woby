// Standalone implementation that doesn't depend on any DOM APIs
// This demonstrates the same pattern as the original index.tsx but works in Node.js

// Simple observable implementation (similar to woby's $ function)
const $ = <T extends unknown>(initialValue: T) => {
    let value = initialValue

    // Return a function that can get/set the value
    const observable = (...args: T[]): T => {
        if (args.length > 0) {
            value = args[0]
        }
        return value
    }

    return observable
}

// Simple template function that works without DOM (similar to html``)
const html = (strings: TemplateStringsArray, ...values: any[]) => {
    let result = strings[0]

    for (let i = 1; i < strings.length; i++) {
        // If the value is a function (like an observable), call it to get the current value
        const value = typeof values[i - 1] === 'function' ? values[i - 1]() : values[i - 1]
        result += value
        result += strings[i]
    }

    return result
}

// Counter component that works without DOM
const Counter = () => {
    const value = $(0)

    const increment = () => value(value() + 1)
    const decrement = () => value(value() - 1)

    // This is the same pattern as the original index.tsx
    return html`
    <div>
      <h1>Counter</h1>
      <p>${value}</p>
      <button>+</button>
      <button>-</button>
    </div>
  `
}

// Generate and output the HTML string
const htmlString = Counter()
console.log(htmlString)