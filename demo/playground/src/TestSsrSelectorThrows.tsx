import { ssr, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkThrows, el } from './ssrCheck'

const name = 'TestSsrSelectorThrows'

const TestSsrSelectorThrows = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR selector — rejections</h3>
            <p>every unsupported syntax throws SyntaxError</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrSelectorThrows.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>every unsupported syntax throws SyntaxError</p></div>'

        const { parseSelector, querySelector: qs, querySelectorAll: qsa, matchesSelector } = ssr
        const P = (s: string) => () => parseSelector(s)

        /* ── unsupported CSS the engine refuses rather than silently mis-matching ── */
        checkThrows(name, ':hover is rejected', P(':hover'), 'pseudo-classes are not supported')
        checkThrows(name, 'a:not(b) is rejected', P('a:not(b)'), 'pseudo-classes are not supported')
        checkThrows(name, '::before is rejected', P('p::before'), 'pseudo-classes are not supported')
        checkThrows(name, ':nth-child is rejected', P('li:nth-child(2)'), 'pseudo-classes are not supported')
        checkThrows(name, 'the "+" sibling combinator is rejected', P('a + b'), 'sibling combinators are not supported')
        checkThrows(name, 'the "~" sibling combinator is rejected', P('a ~ b'), 'sibling combinators are not supported')

        /* ── malformed class / id ────────────────────────────────────────────── */
        checkThrows(name, 'a bare "." is rejected', P('.'), 'empty class')
        checkThrows(name, '"div." is rejected', P('div.'), 'empty class')
        checkThrows(name, 'a bare "#" is rejected', P('#'), 'empty id')
        checkThrows(name, '"div#" is rejected', P('div#'), 'empty id')

        /* ── malformed attribute selectors ───────────────────────────────────── */
        checkThrows(name, '"[]" is rejected', P('[]'), 'empty attribute name')
        checkThrows(name, '"[ ]" is rejected', P('[ ]'), 'empty attribute name')
        checkThrows(name, '"[a!b]" is rejected', P('[a!b]'), 'expected "=" in an attribute selector')
        checkThrows(name, '"[a<=b]" is rejected', P('[a<=b]'), 'expected "=" in an attribute selector')
        checkThrows(name, 'an unterminated double quote is rejected', P('[a="x]'), 'unterminated string')
        checkThrows(name, 'an unterminated single quote is rejected', P("[a='x]"), 'unterminated string')
        checkThrows(name, 'a missing "]" is rejected', P('[a=x'), 'expected "]"')
        checkThrows(name, 'trailing junk before "]" is rejected', P('[a=x y]'), 'expected "]"')

        /* ── empty / unparseable input ───────────────────────────────────────── */
        checkThrows(name, 'the empty string is rejected', P(''), 'empty selector')
        checkThrows(name, 'whitespace-only input is rejected', P('   '), 'empty selector')
        checkThrows(name, 'a lone "," is rejected', P(','), 'empty selector')
        checkThrows(name, 'an unexpected "%" is rejected', P('%'), 'unexpected "%"')
        checkThrows(name, 'an unexpected "@" is rejected', P('div @'), 'unexpected "@"')
        checkThrows(name, 'an unexpected "(" is rejected', P('('), 'unexpected "("')

        /* ── the message names the selector and the offset ───────────────────── */
        let msg = ''
        try { parseSelector('div:hover') } catch (e) { msg = String((e as Error).message) }
        check(name, 'the message quotes the offending selector', msg.includes("'div:hover'"), true)
        check(name, 'the message names the SSR selector engine', msg.includes('SSR selector engine'), true)
        check(name, 'the message reports the failing offset', msg.includes('at offset 3'), true)

        /* ── the same rejection surfaces through every public entry point ────── */
        const root = el('div', null, el('p', { id: 'p1' }))
        checkThrows(name, 'querySelector propagates the rejection', () => qs(root, ':hover'), 'pseudo-classes')
        checkThrows(name, 'querySelectorAll propagates the rejection', () => qsa(root, ':hover'), 'pseudo-classes')
        checkThrows(name, 'matchesSelector propagates the rejection', () => matchesSelector(root, ':hover'), 'pseudo-classes')
        checkThrows(name, 'element.matches propagates the rejection', () => root.matches(':hover'), 'pseudo-classes')
        checkThrows(name, 'element.closest propagates the rejection', () => root.closest(':hover'), 'pseudo-classes')

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR selector — rejections</h3><p>every unsupported syntax throws SyntaxError</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrSelectorThrows} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrSelectorThrows)
