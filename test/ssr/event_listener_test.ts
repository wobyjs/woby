import { BaseNode } from '../src/ssr/base_node'

function testEventListeners() {
    console.log('Testing BaseNode event listener implementation...\n')

    const node = new BaseNode(1) // ELEMENT_NODE

    // Track events
    let clickEvents = 0
    let customEvents = 0

    // Add event listeners
    const clickHandler = () => { clickEvents++; console.log('Click event fired!') }
    const customHandler = () => { customEvents++; console.log('Custom event fired!') }

    node.addEventListener('click', clickHandler)
    node.addEventListener('custom', customHandler)

    console.log('Test 1: Adding event listeners')
    console.log('  Status: ✅ Listeners added without error')

    // Test dispatching events
    console.log('\nTest 2: Dispatching click event')
    const clickEvent = { type: 'click' }
    const clickResult = node.dispatchEvent(clickEvent)
    console.log('  Events fired:', clickEvents)
    console.log('  Dispatch result:', clickResult)
    console.log('  Expected: 1, true')
    console.log('  Status:', clickEvents === 1 && clickResult === true ? '✅ PASS' : '❌ FAIL')

    console.log('\nTest 3: Dispatching custom event')
    const customEvent = { type: 'custom' }
    const customResult = node.dispatchEvent(customEvent)
    console.log('  Events fired:', customEvents)
    console.log('  Dispatch result:', customResult)
    console.log('  Expected: 1, true')
    console.log('  Status:', customEvents === 1 && customResult === true ? '✅ PASS' : '❌ FAIL')

    // Test removing a listener
    console.log('\nTest 4: Removing click listener')
    node.removeEventListener('click', clickHandler)
    node.dispatchEvent({ type: 'click' })
    console.log('  Events fired after removal:', clickEvents)
    console.log('  Expected: 1 (should not increase)')
    console.log('  Status:', clickEvents === 1 ? '✅ PASS' : '❌ FAIL')

    // Test dispatching to remaining listener
    console.log('\nTest 5: Dispatching to remaining listener')
    node.dispatchEvent({ type: 'custom' })
    console.log('  Total custom events:', customEvents)
    console.log('  Expected: 2 (should increase)')
    console.log('  Status:', customEvents === 2 ? '✅ PASS' : '❌ FAIL')

    // Test adding same listener twice (should only be added once)
    console.log('\nTest 6: Adding same listener twice')
    let duplicateEvents = 0
    const duplicateHandler = () => { duplicateEvents++ }

    node.addEventListener('duplicate', duplicateHandler)
    node.addEventListener('duplicate', duplicateHandler) // Adding again
    node.dispatchEvent({ type: 'duplicate' })
    node.dispatchEvent({ type: 'duplicate' }) // Again to be sure

    console.log('  Duplicate events fired:', duplicateEvents)
    console.log('  Expected: 2 (not 4, since duplicate listener was not added)')
    console.log('  Status:', duplicateEvents === 2 ? '✅ PASS' : '❌ FAIL')

    console.log('\nAll event listener tests completed!')
}

testEventListeners()