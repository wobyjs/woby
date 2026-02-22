import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestEventTargetCurrentTarget = (): JSX.Element => {
    return (
        <>
            <h3>Event - Target - Current Target</h3>
            <div onClick={e => console.log({ element: 'div', target: e.target, currentTarget: e.currentTarget })}>
                <p>paragraph</p>
                <ul onClick={e => console.log({ element: 'ul', target: e.target, currentTarget: e.currentTarget })}>
                    <li>one</li>
                    <li onClick={e => console.log({ element: 'li', target: e.target, currentTarget: e.currentTarget })}>two</li>
                    <li>three</li>
                </ul>
            </div>
        </>
    )
}

TestEventTargetCurrentTarget.test = {
    static: true,
    expect: () => {
        return `<div><p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul></div>`
    }
}


export default () => <TestSnapshots Component={TestEventTargetCurrentTarget} />