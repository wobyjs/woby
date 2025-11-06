import { $ } from './soby'
import { renderToString } from './render_to_string.ssr'
import { createElement } from './create_element.ssr'
import { FragmentUtils } from '../utils/fragment.ssr'
import { setChild } from '../utils/setters.ssr'
import { createHTMLNode } from '../utils/creators.ssr'

// Simple test without custom elements
const SimpleApp = () => {
    return (
        createElement('div', { class: 'test' },
            createElement('h1', null, 'Hello World'),
            createElement('p', null, 'Value: ', createElement('b', null, '5'))
        )
    )
}

// Create a container for SSR using HTMLNode
const container = createHTMLNode('div')
const stack = new Error()

// Use a fragment for the root
const fragment = FragmentUtils.make()

console.log('Container before:', container)
console.log('Fragment before:', fragment)

// Set the child content
const appElement = createElement(SimpleApp, {})
console.log('App element:', appElement)
console.log('App element type:', typeof appElement)

// Call the app element function to see what it returns
const appResult = appElement()
console.log('App result:', appResult)
console.log('App result type:', typeof appResult)

setChild(container, appElement, fragment, stack)

console.log('Container after:', container)
console.log('Container childNodes:', container.childNodes)
if (container.childNodes.length > 0) {
    console.log('First child:', container.childNodes[0])
    console.log('First child childNodes:', container.childNodes[0].childNodes)
}
console.log('Fragment after:', fragment)

const result = renderToString(createElement(SimpleApp, {}))
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')