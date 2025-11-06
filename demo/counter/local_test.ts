// Simple test using local copies of the source files
import { renderToString } from './local_src/render_to_string.ssr'
import { createElement } from './local_src/create_element.ssr'

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