import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGStaticCamelCase = (): JSX.Element => {
    return (
        <>
            <h3>SVG - Static CamelCase</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" strokeWidth="3" edgeMode="foo" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGStaticCamelCase.test = {
    static: true,
    expect: () => '<svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
}


export default () => <TestSnapshots Component={TestSVGStaticCamelCase} />