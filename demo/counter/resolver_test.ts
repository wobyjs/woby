// Test to understand how resolver works with multiple children
import { createHTMLNode, createText } from 'woby/ssr'

// Create a simple setter function to see what gets passed to it
const testSetter = (value: any, dynamic: boolean, stack: any) => {
    console.log('Setter called with:')
    console.log('Value:', value)
    console.log('Type of value:', typeof value)
    console.log('Is array:', Array.isArray(value))
    console.log('Dynamic:', dynamic)

    // If it's an array, log each element
    if (Array.isArray(value)) {
        console.log('Array elements:')
        value.forEach((element, index) => {
            console.log(`  ${index}:`, element)
        })
    }
}

// Test with a simple array of elements
const h1 = createHTMLNode('h1')
h1.appendChild(createText('Hello World'))

const div = createHTMLNode('div')
div.appendChild(createText('This is a test'))

const childrenArray = [h1, div]

console.log('Testing resolveChild with array:')
// Note: resolveChild is internal and not exported from woby/ssr
// We'll test with a simpler approach
console.log('Children array:', childrenArray)