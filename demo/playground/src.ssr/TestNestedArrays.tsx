import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNestedArrays = (): JSX.Element => {
    const items = $([0, 1, 2])
    const activeItem = $(1)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNestedArrays', items) // Using items to track state changes

    const incrementItems = () => {
        items(items => [...items, items.length])
        activeItem(item => item + 1)
    }

    setTimeout(incrementItems, TEST_INTERVAL)
    setTimeout(incrementItems, TEST_INTERVAL * 2)

    return (
        <>
            <h3>Nested Arrays</h3>
            <button onClick={incrementItems}>Increment</button>
            <ul>
                <For values={items}>
                    {item => {
                        return (
                            <>
                                <If when={() => activeItem() === item}>
                                    <li>test</li>
                                </If>
                                <li>
                                    {item}
                                </li>
                            </>
                        )
                    }}
                </For>
            </ul>
        </>
    )
}

TestNestedArrays.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // This component cycles through different array states
        const itemsState = $$(testObservables['TestNestedArrays'])
        const length = itemsState.length
        if (length === 3) {
            return '<button>Increment</button><ul><!----><li>0</li><li>test</li><li>1</li><!----><li>2</li></ul>'
        } else if (length === 4) {
            return '<button>Increment</button><ul><!----><li>0</li><!----><li>1</li><li>test</li><li>2</li><!----><li>3</li></ul>'
        } else {
            return '<button>Increment</button><ul><!----><li>0</li><!----><li>1</li><!----><li>2</li><li>test</li><li>3</li><!----><li>4</li></ul>'
        }
    }
}


export default () => <TestSnapshots Component={TestNestedArrays} />