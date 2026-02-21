import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Style> | null>({ color: 'orange', fontWeight: 'normal' })
    // Store the observable globally so the test can access it
    registerTestObservable('TestStylesRemoval', o)
    const toggle = () => o(prev => prev ? null : { color: 'orange', fontWeight: 'normal' })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Styles - Removal</h3>
            <p style={o}>content</p>
        </>
    )
}

TestStylesRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStylesRemoval'])
        if (value) {
            const styles = []
            for (const [prop, val] of Object.entries(value)) {
                const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
                styles.push(`${cssProp}: ${val};`)
            }
            return `<p style="${styles.join(' ')}">content</p>`
        } else {
            return '<p style="">content</p>'
        }
    }
}


export default () => <TestSnapshots Component={TestStylesRemoval} />