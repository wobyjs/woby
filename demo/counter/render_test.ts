// Test to mimic what happens in renderToString
import { createHTMLNode, createText } from 'woby/ssr'

// Create a container
const container = createHTMLNode('div')
console.log('Initial container childNodes:', container.childNodes)

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

console.log('Children to set:', children)

// Note: setChild and FragmentUtils are internal and not exported from woby/ssr
// We'll test with a simpler approach using renderToString
console.log('Container outerHTML:', container.outerHTML)