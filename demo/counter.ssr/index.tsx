/* IMPORT */

import { $, $$, useMemo, render, Component } from 'woby/ssr'

/* MAIN */

const Counter: Component<{ value: any }> = ({ value }) => {
    const v = $('abc')
    const m = useMemo(() => {
        console.log($$(value) + $$(v))
        return $$(value) + $$(v)
    })

    return <div>
        <h1>SSR Counter</h1>
        <p>{value}</p>
        <p>{m}</p>
    </div>
}

const value = $(0)
const increment = () => value(value() + 1)
const decrement = () => value(value() - 1)

// Render the app to a string for SSR
// await render(<Counter value={value} />)


// document.getElementById('app').innerHTML = render(<Counter value={value} />)
document.getElementById('app').innerHTML = render(<div>hello</div>)