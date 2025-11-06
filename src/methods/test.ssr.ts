import { renderToString } from './render_to_string.ssr'
import { createElement } from './create_element.ssr'

// Simple test component
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