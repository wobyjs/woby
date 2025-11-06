import { renderToString } from 'woby/ssr'

const result = renderToString(
    <div>
        <h1>Fragment Test</h1>
        <p>This tests fragments.</p>
    </div>
)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')