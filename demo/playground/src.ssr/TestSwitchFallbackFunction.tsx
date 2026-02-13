import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchFallbackFunction = (): JSX.Element => {
    const fallbackValue = String(random())
    registerTestObservable('TestSwitchFallbackFunction', fallbackValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {fallbackValue}</p>
    }
    return (
        <>
            <h3>Switch - Fallback Function</h3>
            <Switch when={-1} fallback={Fallback}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )
}

TestSwitchFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const fallbackValue = testObservables['TestSwitchFallbackFunction']
        return `<p>Fallback: ${fallbackValue}</p>`
    }
}

class Component<P = {}> {
    props: P
    state: {}
    constructor(props: P) {
        this.props = props
        this.state = {}
    }
    render(props: P): JSX.Child {
        throw new Error('Missing render function')
    }
    static call(thiz: Constructor<Component>, props: {}) {
        const instance = new thiz(props)
        return instance.render(instance.props, instance.state)
    }
}

// Convert class-based components to functional components
const TestableComponent = <P,>(props: P & { children?: Child }) => {
    return props.children
}

TestableComponent.test = {
    static: true,
    expect: () => ''
}


export default () => <TestSnapshots Component={TestSwitchFallbackFunction} />