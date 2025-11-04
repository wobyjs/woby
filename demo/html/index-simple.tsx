import { html } from 'woby/ssr'
// Simple implementation without importing from woby

// Simple observable implementation
const $ = <T extends unknown>(value: T) => {
    let _value = value
    const observable = (...args: T[]) => {
        if (args.length > 0) {
            _value = args[0]
        }
        return _value
    }
    return observable
}

// // Simple htm implementation
// const htm = (strings: TemplateStringsArray, ...values: any[]) => {
//     let result = strings[0]
//     for (let i = 1; i < strings.length; i++) {
//         // Convert observable values to their current value
//         const value = typeof values[i - 1] === 'function' ? values[i - 1]() : values[i - 1]
//         result += value
//         result += strings[i]
//     }
//     return result
// }

// Simple createElement function that mimics the behavior in index.tsx
const createElement = (tag: string, props: any, ...children: any[]) => {
    // Convert children to string
    const childString = children.map(child => {
        if (typeof child === 'function') {
            // If it's a function, call it to get the value
            return child()
        }
        return child
    }).join('')

    // Build attributes string
    let attrs = ''
    if (props) {
        attrs = Object.entries(props)
            .map(([key, value]) => {
                // Handle special cases
                if (key === 'onClick') {
                    // For SSR, we can't actually handle events, so we just omit them
                    return ''
                }
                return `${key}="${value}"`
            })
            .filter(attr => attr !== '') // Remove empty attributes
            .join(' ')
        if (attrs) attrs = ' ' + attrs
    }

    // Handle self-closing tags
    if (['br', 'hr', 'img', 'input'].includes(tag.toLowerCase())) {
        return `<${tag}${attrs}>`
    }

    return `<${tag}${attrs}>${childString}</${tag}>`
}

// Create html template function using htm
// const html = htm.bind(createElement)

/* MAIN */

const Counter = () => {
    const value = $(0)

    const increment = () => value(value() + 1)
    const decrement = () => value(value() - 1)

    // Using html template with htm, similar to index.tsx
    return html`
    <div>
      <h1>Counter</h1>
      <p>${value}</p>
      <button onClick=${increment}>+</button>
      <button onClick=${decrement}>-</button>
    </div>
  `
}

// Generate the HTML string
const htmlString = Counter()
console.log(htmlString)