import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestClassesArrayStore = (): JSX.Element => {
    const o = ['red', false]
    return (
        <>
            <h3>Classes - Array Store</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayStore.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayStore} />