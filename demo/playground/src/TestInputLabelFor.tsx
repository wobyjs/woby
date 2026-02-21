import { $, $$ } from 'woby'
import { TestSnapshots, random } from './util'

const TestInputLabelFor = (): JSX.Element => {
    return (
        <>
            <h3>Input - Label For</h3>
            <p><label htmlFor="for-target">htmlFor</label></p>
            <p><label for="for-target">for</label></p>
            <p><input id="for-target" /></p>
        </>
    )
}

TestInputLabelFor.test = {
    static: true,
    expect: () => '<p><label for="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></p>'
}

export default () => <TestSnapshots Component={TestInputLabelFor} />