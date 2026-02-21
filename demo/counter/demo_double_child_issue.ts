// Demonstration of the double child issue in DirectTest
import { renderToString, createElement } from 'woby/ssr'

// Correct way to use createElement
const CorrectTest = () => {
    return createElement('div', null,
        createElement('h1', null, 'Correct Child 1'),
        createElement('h2', null, 'Correct Child 2')
    )
}

// Incorrect way that causes the double child issue
const IncorrectTest = () => {
    return createElement('div', {
        children: [
            createElement('h1', { children: 'Incorrect Child 1' }),
            createElement('h2', { children: 'Incorrect Child 2' })
        ]
    } as any)
}

console.log('=== Demonstrating the Double Child Issue ===\n')

console.log('1. Correct Usage:')
const correctResult = renderToString(CorrectTest())
console.log('   Result:', correctResult)

console.log('\n2. Incorrect Usage (Double Child Issue):')
const incorrectResult = renderToString(IncorrectTest())
console.log('   Result:', incorrectResult)

console.log('\n=== Analysis ===')
console.log('Correct Result Has Children:', correctResult.includes('<H1>') && correctResult.includes('<H2>'))
console.log('Incorrect Result Has Children:', incorrectResult.includes('<H1>') && incorrectResult.includes('<H2>'))

// Let's also examine what's happening in detail
console.log('\n=== Detailed Analysis ===')
console.log('The issue occurs when:')
console.log('1. Children are passed as a "children" property in the props object')
console.log('2. Those children also have their own "children" property')
console.log('This creates a double nesting effect where children are wrapped twice')