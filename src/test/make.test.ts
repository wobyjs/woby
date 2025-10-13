import { make } from '../methods/make'
import { isObservable } from '../methods/soby'

// Test the new make function with options
const testObj = {
    name: 'John',
    age: 30,
    greet() {
        return `Hello, ${this.name}`
    }
}

console.log('Testing make function...')

// Test with default options
const result1 = make(testObj)
console.log('Default options test:')
console.log('- name is observable:', isObservable(result1.name))
console.log('- age is observable:', isObservable(result1.age))
console.log('- greet is function:', typeof result1.greet === 'function')
console.log('- name value:', result1.name())
console.log('- age value:', result1.age())
console.log('- greet result:', result1.greet())

// Test with explicit options
const result2 = make(testObj, { inplace: false, convertFunction: false })
console.log('\nExplicit options test:')
console.log('- name is observable:', isObservable(result2.name))
console.log('- age is observable:', isObservable(result2.age))
console.log('- greet is function:', typeof result2.greet === 'function')

// Test with convertFunction: true
const result3 = make(testObj, { inplace: false, convertFunction: true })
console.log('\nConvert functions test:')
console.log('- name is observable:', isObservable(result3.name))
console.log('- age is observable:', isObservable(result3.age))
console.log('- greet is observable:', isObservable(result3.greet))

console.log('\nAll tests completed!')

describe('make function', () => {
    it('should convert object properties to observables with default options', () => {
        const obj = {
            name: 'John',
            age: 30,
            greet() {
                return `Hello, ${this.name}`
            }
        }

        const result = make(obj)

        // Check that primitive values are converted to observables
        expect(isObservable(result.name)).toBe(true)
        expect(isObservable(result.age)).toBe(true)

        // Check that functions are not converted
        expect(typeof result.greet).toBe('function')
        expect(isObservable(result.greet)).toBe(false)

        // Check values
        expect(result.name()).toBe('John')
        expect(result.age()).toBe(30)
        expect(result.greet()).toBe('Hello, John')
    })

    it('should convert object properties to observables with explicit options', () => {
        const obj = {
            name: 'John',
            age: 30,
            greet() {
                return `Hello, ${this.name}`
            }
        }

        const result = make(obj, { inplace: false, convertFunction: false })

        // Check that primitive values are converted to observables
        expect(isObservable(result.name)).toBe(true)
        expect(isObservable(result.age)).toBe(true)

        // Check that functions are not converted
        expect(typeof result.greet).toBe('function')
        expect(isObservable(result.greet)).toBe(false)

        // Check values
        expect(result.name()).toBe('John')
        expect(result.age()).toBe(30)
        expect(result.greet()).toBe('Hello, John')
    })

    it('should convert functions when convertFunction is true', () => {
        const obj = {
            name: 'John',
            age: 30,
            greet() {
                return `Hello, ${this.name}`
            }
        }

        const result = make(obj, { inplace: false, convertFunction: true })

        // Check that primitive values are converted to observables
        expect(isObservable(result.name)).toBe(true)
        expect(isObservable(result.age)).toBe(true)

        // Check that functions are also converted
        expect(isObservable(result.greet)).toBe(true)

        // Check values
        expect(result.name()).toBe('John')
        expect(result.age()).toBe(30)
        expect(result.greet()()).toBe('Hello, John')
    })
})