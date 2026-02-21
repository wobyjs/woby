import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>({ 'red bold': true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : { 'red bold': true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectRemovalMultiple'])
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


export default () => <TestSnapshots Component={TestClassesObjectRemovalMultiple} />