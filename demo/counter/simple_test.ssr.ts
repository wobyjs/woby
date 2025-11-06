// Simple test for counter demo using woby imports
import { renderToString, createElement } from 'woby/ssr'

// Simple test component that mimics the App component from index.ssr.tsx
const App = () => {
    return createElement('div', null,
        createElement('h1', null, 'Simple Test'),
        createElement('div', { class: 'test' },
            createElement('h2', null, 'Hello World'),
            createElement('p', null, 'This is a simple test.')
        )
    )
}

// Test the renderToString function
const result = renderToString(App())
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')