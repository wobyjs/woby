import { $, $$ } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNestedArrays = (): JSX.Element => {
    const items = $([0, 1, 2])
    const activeItem = $(1)
    // Store the observables globally so the test can access them
    registerTestObservable('TestNestedArrays', items) // Using items to track state changes
    registerTestObservable('TestNestedArrays-activeItem', activeItem)

    const incrementItems = () => {
        const newLength = items().length + 1
        items(prev => [...prev, prev.length])
        activeItem(newLength - 1) // Update to the new active item
    }

    useTimeout(incrementItems, TEST_INTERVAL)
    useTimeout(incrementItems, TEST_INTERVAL * 2)

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
        // Dynamically generate the expected HTML based on the current state
        const itemsState = testObservables['TestNestedArrays']?.() ?? [0, 1, 2]
        const activeItemState = testObservables['TestNestedArrays-activeItem']?.() ?? 1

        // Generate the list items dynamically
        let html = '<button>Increment</button><ul>'

        for (let i = 0; i < itemsState.length; i++) {
            const item = itemsState[i]
            // Add <!-- --> for inactive If blocks
            if (activeItemState !== item) {
                html += '<!---->'
            } else {
                html += '<li>test</li>'
            }
            html += `<li>${item}</li>`
        }

        html += '</ul>'
        return html
    }
}


export default () => <TestSnapshots Component={TestNestedArrays} />