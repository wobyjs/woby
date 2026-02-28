import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGStaticCamelCase = (): JSX.Element => {
    const strokeColor = randomColor()
    registerTestObservable('TestSVGStaticCamelCase', strokeColor)
    return (
        <>
            <h3>SVG - Static CamelCase</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke={strokeColor} strokeWidth="3" edgeMode="foo" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGStaticCamelCase.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const strokeColor = testObservables['TestSVGStaticCamelCase']
        return `<svg viewBox="0 0 50 50" width="50px" stroke="${strokeColor}" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
    }
}


export default () => <TestSnapshots Component={TestSVGStaticCamelCase} />