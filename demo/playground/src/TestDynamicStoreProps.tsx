import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicStoreProps = (): JSX.Element => {
    let count = 1
    const props = store({ class: 'red' })
    const toggle = () => props.class = props.class === 'red' ? 'blue' : 'red'
    setInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Store Props</h3>
            <Dynamic component="div" props={props}>
                <p>{() => count++}</p>
            </Dynamic>
        </>
    )
}

TestDynamicStoreProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const div = document.querySelector('div')
        const className = div?.className || ''
        return `<div class="${className}"><p>1</p></div>`
    }
}


export default () => <TestSnapshots Component={TestDynamicStoreProps} />