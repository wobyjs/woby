import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomColor } from './util'

const TestSVGFunction = (): JSX.Element => {
    const color = $(randomColor())
    registerTestObservable('TestSVGFunction', color)
    const update = () => color(randomColor())
    useInterval(update, TEST_INTERVAL / 2)
    return (
        <>
            <h3>SVG - Function</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke={() => color()} stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestSVGFunction'])
        return `<svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
    }
}


export default () => <TestSnapshots Component={TestSVGFunction} />