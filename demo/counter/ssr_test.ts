// Test using SSR-specific files directly
import { createHTMLNode, createText } from 'woby/ssr'
import { renderToString } from 'woby/ssr'

// Test renderToString with a simple component
const testComponent = () => {
    // Create children elements
    const h1 = createHTMLNode('h1')
    h1.appendChild(createText('Hello World'))

    const div = createHTMLNode('div')
    div.setAttribute('class', 'test')
    const h2 = createHTMLNode('h2')
    h2.appendChild(createText('This is a test'))
    div.appendChild(h2)

    const p = createHTMLNode('p')
    p.appendChild(createText('This is a paragraph'))
    div.appendChild(p)

    // Create an array of children like JSX would
    const children = [h1, div]

    return children
}

console.log('Testing renderToString...')
const result = renderToString(testComponent())
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')