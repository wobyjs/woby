import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>({ red: true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemoval', o)
    const toggle = () => o(prev => prev ? null : { red: true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Removal</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectRemoval'])
        if (value) {
            const classes = []
            for (const [className, condition] of Object.entries(value)) {
                if (condition) {
                    classes.push(className)
                }
            }
            return `<p class="${classes.join(' ')}">content</p>`
        } else {
            return '<p class="">content</p>'
        }
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemoval} />