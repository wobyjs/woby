
/**
 * Test Custom Element Basic Functionality
 * 
 * Tests basic custom element creation and usage with:
 * - Default props
 * - Attribute binding
 * - Style properties
 * - Nested properties
 * - Type conversion
 */
import { $, $$, customElement, defaults, renderToString, Dynamic, type ElementAttributes, HtmlString, HtmlNumber, HtmlBoolean, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Define a simple custom element with basic props
const BasicElement = defaults(() => ({
    title: $('Basic Element', HtmlString),
    count: $(0, HtmlNumber),
    active: $(false, HtmlBoolean),
    color: $('blue')
}), ({ title, count, active, color, children }) => {
    // When children are projected through slots (HTML usage), don't render children div
    // When children come from props (JSX usage), render the children div
    // Since all custom elements now use shadow DOM, we need to distinguish
    const isSlotProjected = false // Default to JSX usage behavior

    return (
        <div style={{
            border: '2px solid ' + $$(color),
            padding: '10px',
            backgroundColor: $$(active) ? '#e0e0e0' : 'white'
        }}>
            <h2>{title}</h2>
            {!isSlotProjected && <div>{children}</div>}
            <p>Count: {count}</p>
            <p>Active: {() => $$(active) ? 'Yes' : 'No'}</p>
        </div>
    )
})

// Register the custom element
customElement('basic-element', BasicElement)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'basic-element': ElementAttributes<typeof BasicElement>
        }
    }
}

// Individual test components for each usage pattern

// 1. TSX Usage Test
const TestCustomElementBasicTSX = (): JSX.Element => {
    const title = $('Test Element')
    const count = $(42)
    const active = $(true)
    const color = $('green')

    const ret: JSX.Element = () => (
        <div>
            <h2>1. TSX Usage</h2>
            <BasicElement
                title={title}
                count={count}
                active={active}
                color={color}
            >
                <p>This is child content from TSX</p>
            </BasicElement>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementBasicTSX_ssr', ret)

    return ret
}

TestCustomElementBasicTSX.test = {
    static: true,
    expect: () => {
        const expected = '<div><h2>1. TSX Usage</h2><div style="border: 2px solid green; padding: 10px; background-color: rgb(224, 224, 224);"><h2>Test Element</h2><div><p>This is child content from TSX</p></div><p>Count: 42</p><p>Active: Yes</p></div></div>'

        const ssrComponent = testObservables['TestCustomElementBasicTSX_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h2>1. TSX Usage</h2><div style="border: 2px solid green; padding: 10px; background-color: #e0e0e0;"><h2>Test Element</h2><div><p>This is child content from TSX</p></div><p>Count: 42</p><p>Active: Yes</p></div></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementBasicTSX] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementBasicTSX] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

// 2. Custom Element Usage Test
const TestCustomElementBasicHTML = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h2>2. Custom Element in TSX</h2>
            <basic-element
                title="HTML Attribute Title"
                count="100"
                active="true"
                color="red"
                style$margin-top="20px"
            >
                <p>This is child content from HTML</p>
            </basic-element>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementBasicHTML_ssr', ret)

    return ret
}

TestCustomElementBasicHTML.test = {
    static: true,
    expect: () => {
        // DOM expectation - includes style attribute and rgb() color format
        const expectedFull = '<div><h2>2. Custom Element in TSX</h2><basic-element title="HTML Attribute Title" count="100" active="true" color="red"><div style="border: 2px solid red; padding: 10px; background-color: #e0e0e0;"><h2>HTML Attribute Title</h2><div><p>This is child content from HTML</p></div><p>Count: 100</p><p>Active: Yes</p></div></basic-element></div>'
        const expected = '<div><h2>2. Custom Element in TSX</h2><basic-element title="HTML Attribute Title" count="100" active="true" color="red" style="margin-top: 20px;"><div style="border: 2px solid red; padding: 10px; background-color: rgb(224, 224, 224);"><h2>HTML Attribute Title</h2><div><p>This is child content from HTML</p></div><p>Count: 100</p><p>Active: Yes</p></div></basic-element></div>'

        const ssrComponent = testObservables['TestCustomElementBasicHTML_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementBasicHTML] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementBasicHTML] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

// 3. Mixed Usage Test
const TestCustomElementBasicMixed = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h2>3. Custom Element in Dynamic (semulated HTML) Usage</h2>
            <Dynamic
                component="basic-element"
                title="Mixed TSX"
            >
                <Dynamic
                    component="basic-element"
                    title="Nested Custom Element"
                    count="50"
                >
                    <p>Nested content</p>
                </Dynamic>
            </Dynamic>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementBasicMixed_ssr', ret)

    return ret
}

TestCustomElementBasicMixed.test = {
    static: true,
    expect: () => {
        const expected = `<div><h2>3. Custom Element in Dynamic (semulated HTML) Usage</h2><basic-element title="Mixed TSX" count="0" color="blue"><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Mixed TSX</h2><div><basic-element title="Nested Custom Element" count="50" color="blue"><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Nested Custom Element</h2><div><p>Nested content</p></div><p>Count: 50</p><p>Active: No</p></div></basic-element></div><p>Count: 0</p><p>Active: No</p></div></basic-element></div>`
        const ssrComponent = testObservables['TestCustomElementBasicMixed_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<div><h2>3. Custom Element in Dynamic (semulated HTML) Usage</h2><basic-element title="Mixed TSX" count="0" color="blue"><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Mixed TSX</h2><div><basic-element title="Nested Custom Element" count="50" color="blue"><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Nested Custom Element</h2><div><p>Nested content</p></div><p>Count: 50</p><p>Active: No</p></div></basic-element></div><p>Count: 0</p><p>Active: No</p></div></basic-element></div>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementBasicMixed] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementBasicMixed] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

// 4. Pure HTML Custom Element Usage Test
const TestCustomElementBasicPureHTML = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h2>4. Pure HTML Custom Element</h2>
            <basic-element
                title="Pure HTML Custom Element"
                count="75"
                active="true"
                color="purple"
            >
                <p>This is child content from pure HTML custom element</p>
            </basic-element>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementBasicPureHTML_ssr', ret)

    return ret
}

TestCustomElementBasicPureHTML.test = {
    static: true,
    expect: () => {
        // DOM expectation - uses rgb() color format
        const expected = '<div><h2>4. Pure HTML Custom Element</h2><basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple"><div style="border: 2px solid purple; padding: 10px; background-color: rgb(224, 224, 224);"><h2>Pure HTML Custom Element</h2><div><p>This is child content from pure HTML custom element</p></div><p>Count: 75</p><p>Active: Yes</p></div></basic-element></div>'
        const expectedFull = '<div><h2>4. Pure HTML Custom Element</h2><basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple"><div style="border: 2px solid purple; padding: 10px; background-color: #e0e0e0;"><h2>Pure HTML Custom Element</h2><div><p>This is child content from pure HTML custom element</p></div><p>Count: 75</p><p>Active: Yes</p></div></basic-element></div>'

        const ssrComponent = testObservables['TestCustomElementBasicPureHTML_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementBasicPureHTML] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementBasicPureHTML] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <>
    <TestSnapshots Component={TestCustomElementBasicTSX} />
    <TestSnapshots Component={TestCustomElementBasicHTML} />
    <TestSnapshots Component={TestCustomElementBasicMixed} />
    <TestSnapshots Component={TestCustomElementBasicPureHTML} />
</>


//<div><h2>2. Custom Element in TSX</h2><basic-element title="HTML Attribute Title" count="100" active="true" color="red"><div style="border: 2px solid red; padding: 10px; background-color: #e0e0e0;"><h2>HTML Attribute Title</h2><div><p>This is child content from HTML</p></div><p>Count: 100</p><p>Active: Yes</p></div></basic-element></div>, expected 
//<div><h2>2. Custom Element in TSX</h2><basic-element title="HTML Attribute Title" count="100" active="true" color="red"><p>This is child content from HTML</p></basic-element></div>

console.log(renderToString(<TestCustomElementBasicMixed />))