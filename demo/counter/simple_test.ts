// Simple test to debug renderToString issue
import { createHTMLNode, createText } from 'woby/ssr'

// Test the HTMLNode creation
const container = createHTMLNode('div')
console.log('Container:', container)
console.log('Container tagName:', container.tagName)
console.log('Container childNodes:', container.childNodes)

// Test appending a child
const child = createHTMLNode('h1')
child.setAttribute('id', 'test')
console.log('Child before append:', child)

container.appendChild(child)
console.log('Container after appendChild:', container.childNodes)

// Test setting text content
const textNode = createText('Hello World')
child.appendChild(textNode)
console.log('Child after text append:', child.childNodes)

// Test outerHTML
console.log('Container outerHTML:', container.outerHTML)