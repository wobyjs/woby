import { $, $$, defaults, customElement, useMemo, type JSX, ElementAttributes } from 'woby'

/**
 * Test CustomElement with reactive conditional pattern
 * This mimics the 奇门遁甲盘 pattern
 */

// Simulated data store (like use盘 in qmdj)
const dataStore = {
    'a': { title: 'Data A', value: 100 },
    'b': { title: 'Data B', value: 200 },
    'c': { title: 'Data C', value: 300 }
}

type DataKey = 'a' | 'b' | 'c'

const ReactiveConditionalDefaults = () => ({
    key: $(null as unknown as DataKey)
})

const ReactiveConditional = defaults(ReactiveConditionalDefaults, (props) => {
    // This mimics: const 盘体 = useMemo(() => $$(props.奇门类) ? use盘[$$(props.奇门类)] : null)
    const data = useMemo(() => $$(props.key) ? dataStore[$$(props.key)] : null)

    // CORRECT PATTERN: Reactive conditional inside JSX
    return <>{() => {
        const d = $$(data)
        if (!d) return <div class="p-4 text-gray-500">Please set key attribute (a/b/c)</div>

        return <div class="p-4 border border-blue-500 rounded">
            <h2 class="text-lg font-bold">{d.title}</h2>
            <p>Key: {props.key}</p>
            <p>Value: {d.value}</p>
        </div>
    }}</>
})

customElement('reactive-conditional', ReactiveConditional)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'reactive-conditional': ElementAttributes<typeof ReactiveConditional>
        }
    }
}

export default ReactiveConditional
