import { $, $$, template } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomColor } from './util'

const TestTemplateSVG = (): JSX.Element => {
    const color = $(randomColor())
    registerTestObservable('TestTemplateSVG', color)
    const update = () => color(randomColor())
    useInterval(update, TEST_INTERVAL / 2)
    const Templated = template<{ color }>(props => {
        return (
            <svg viewBox="0 0 50 50" width="50px" stroke={props.color} stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        )
    })
    return (
        <>
            <h3>Template - SVG</h3>
            <Templated color={color} />
        </>
    )
}

TestTemplateSVG.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestTemplateSVG'])
        return `<svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
    }
}


export default () => <TestSnapshots Component={TestTemplateSVG} />