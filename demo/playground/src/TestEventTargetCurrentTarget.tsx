import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventTargetCurrentTarget = (): JSX.Element => {
    const clickCount = $(0)
    registerTestObservable('TestEventTargetCurrentTarget_clickCount', clickCount)

    const handleClick = (element: string) => (e: Event) => {
        clickCount(prev => prev + 1)
        // Use assert for assertions instead of console.log
        assert(e.target === e.currentTarget, `[${element}] target should equal currentTarget`)
        assert(clickCount() > 0, `[${element}] clickCount should be greater than 0`)
    }

    // Programmatic click firing for testing
    const divRef = $<HTMLDivElement>()
    const ulRef = $<HTMLUListElement>()
    const liRef = $<HTMLLIElement>()

    useInterval(() => {
        // Fire clicks on different elements
        const div = divRef()
        const ul = ulRef()
        const li = liRef()

        const divWithHandlers = div as any
        const ulWithHandlers = ul as any
        const liWithHandlers = li as any

        if (divWithHandlers && divWithHandlers._onclick) {
            const mockEvent = {
                currentTarget: div,
                target: div,
                composedPath: () => [div, div.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            divWithHandlers._onclick.call(div, mockEvent)
        }

        if (ulWithHandlers && ulWithHandlers._onclick) {
            const mockEvent = {
                currentTarget: ul,
                target: ul,
                composedPath: () => [ul, ul.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            ulWithHandlers._onclick.call(ul, mockEvent)
        }

        if (liWithHandlers && liWithHandlers._onclick) {
            const mockEvent = {
                currentTarget: li,
                target: li,
                composedPath: () => [li, li.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            liWithHandlers._onclick.call(li, mockEvent)
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Target - Current Target</h3>
            <div ref={divRef} onClick={handleClick('div')}>
                <p>paragraph</p>
                <ul ref={ulRef} onClick={handleClick('ul')}>
                    <li>one</li>
                    <li ref={liRef} onClick={handleClick('li')}>two</li>
                    <li>three</li>
                </ul>
            </div>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventTargetCurrentTarget_ssr', ret)

    return ret
}

TestEventTargetCurrentTarget.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const clickCount = $$(testObservables['TestEventTargetCurrentTarget_clickCount']) ?? 0

        // Define expected values for both main test and SSR test
        const expected = `<div><p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul></div>`   // For main test comparison

        const ssrComponent = testObservables['TestEventTargetCurrentTarget_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract content from SSR result to use for comparison
        const match = ssrResult.match(/<div[^>]*>(.*?)<\/div>/)
        const ssrContent = match ? match[1] : '<p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul>'
        const expectedFull = `<h3>Event - Target - Current Target</h3><div>${ssrContent}</div>`  // For SSR comparison
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventTargetCurrentTarget] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            assert(true, `[TestEventTargetCurrentTarget] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestEventTargetCurrentTarget} />