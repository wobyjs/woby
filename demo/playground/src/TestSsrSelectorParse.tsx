import { ssr, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkNodes, el, ids, tags } from './ssrCheck'

const name = 'TestSsrSelectorParse'

const TestSsrSelectorParse = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR selector — parsing</h3>
            <p>grammar, combinators, memoisation</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrSelectorParse.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>grammar, combinators, memoisation</p></div>'

        const { parseSelector, querySelector: qs, querySelectorAll: qsa } = ssr
        const json = (s: string) => JSON.stringify(parseSelector(s))

        /* ── fixture ────────────────────────────────────────────────────────────
           <div id=root>
             <section id=s1><b id=b1><i id=i1/></b></section>
             <b id=b2><i id=i2/></b>
           </div>                                                              */
        const i1 = el('i', { id: 'i1' })
        const i2 = el('i', { id: 'i2' })
        const b1 = el('b', { id: 'b1' }, i1)
        const b2 = el('b', { id: 'b2' }, i2)
        const s1 = el('section', { id: 's1' }, b1)
        const root = el('div', { id: 'root' }, s1, b2)

        /* ── shape of the parse result ───────────────────────────────────────── */
        check(name, 'parseSelector returns an array', Array.isArray(parseSelector('div')), true)
        check(name, 'a bare tag is one complex selector', parseSelector('div').length, 1)
        check(name, 'a selector list splits on ","', parseSelector('div, p, span').length, 3)
        check(name, 'a descendant chain is one complex of 2 steps', parseSelector('div p')[0].length, 2)
        check(name, 'first step carries a null combinator', parseSelector('div p')[0][0].combinator, null)
        check(name, 'a descendant step carries " "', parseSelector('div p')[0][1].combinator, ' ')
        check(name, 'a child step carries ">"', parseSelector('div > p')[0][1].combinator, '>')

        /* ── whitespace around ">" must not downgrade it to a descendant ─────── */
        check(name, '"a>b" === "a > b" after parse', json('a>b'), json('a > b'))
        check(name, '"a>b" === "a  >  b" after parse', json('a>b'), json('a  >  b'))
        check(name, '"a>b" === "a\\n>\\nb" after parse', json('a>b'), json('a\n>\nb'))
        check(name, '"a b" is NOT "a>b"', json('a b') === json('a>b'), false)
        check(name, 'leading/trailing space is trimmed', json('  div  '), json('div'))
        check(name, 'runs of whitespace collapse to one descendant step', json('a \t\r\n b'), json('a b'))

        /* ── combinators against the fixture ─────────────────────────────────── */
        checkNodes(name, '"section b" finds only the nested b', qsa(root, 'section b'), [b1])
        checkNodes(name, '"section > b" finds only the direct child', qsa(root, 'section > b'), [b1])
        checkNodes(name, '"b i" finds both i, in document order', qsa(root, 'b i'), [i1, i2])
        checkNodes(name, '"div > b" skips b1 (grandchild)', qsa(root, 'div > b'), [b2])
        check(name, '"section > i" matches nothing (i is a grandchild)', qsa(root, 'section > i').length, 0)

        /* ── descendant steps backtrack over every ancestor ──────────────────────
           <x id=x1><y id=yB><div id=mid><y id=yC><z id=z1/>
           "x > y z": the NEAREST y ancestor of z1 (yC) is a child of <div>, not <x>.
           Only a parser that keeps walking upward finds yB and matches.           */
        const z1 = el('z', { id: 'z1' })
        const yC = el('y', { id: 'yC' }, z1)
        const mid = el('div', { id: 'mid' }, yC)
        const yB = el('y', { id: 'yB' }, mid)
        const x1 = el('x', { id: 'x1' }, yB)
        checkNodes(name, '"x > y z" backtracks past the nearest y', qsa(x1, 'x > y z'), [z1])
        // Scoping the query narrows the RESULTS, never the ancestor walk: z1 still matches
        // from yB because the matcher climbs past the scope root to reach x1.
        check(name, 'a scoped query still climbs past its scope root', qsa(yB, 'x > y z').length, 1)
        // Detach the x parent and the same selector stops matching — that is the real control.
        yB.remove()
        check(name, 'without the x parent nothing matches', qsa(yB, 'x > y z').length, 0)
        check(name, 'and the x subtree no longer holds it either', qsa(x1, 'x > y z').length, 0)

        /* ── selector lists ──────────────────────────────────────────────────── */
        checkNodes(name, 'a list returns document order, not list order', qsa(root, '#i2, #i1'), [i1, i2])
        checkNodes(name, 'an element matching twice is still returned once', qsa(root, 'b, #b1'), [b1, b2])
        check(name, 'a trailing comma is tolerated', parseSelector('div,').length, 1)
        check(name, 'a leading comma is tolerated', parseSelector(',div').length, 1)

        /* ── compound selectors are order-independent ────────────────────────── */
        const k1 = el('span', { id: 'k1', class: 'k', 'data-x': '1' })
        const k2 = el('span', { id: 'k2', class: 'k' })
        const kroot = el('div', null, k1, k2)
        checkNodes(name, 'span.k[data-x] matches', qsa(kroot, 'span.k[data-x]'), [k1])
        checkNodes(name, '.k[data-x]span matches the same node', qsa(kroot, '.k[data-x]span'), [k1])
        checkNodes(name, '[data-x]span.k matches the same node', qsa(kroot, '[data-x]span.k'), [k1])

        /* ── universal, case-insensitive tags, non-ASCII identifiers ─────────── */
        check(name, '"*" returns every descendant', ids(qsa(root, '*')), 's1,b1,i1,b2,i2')
        check(name, '"div > *" is direct children only', ids(qsa(root, 'div > *')), 's1,b2')
        checkNodes(name, 'tag matching is case-insensitive', qsa(root, 'SECTION'), [s1])
        checkNodes(name, 'the selector may be uppercase too', qsa(root, 'SECTION > B'), [b1])
        const cjk = el('div', null, el('测试', { id: 'cjk1' }))
        check(name, 'non-ASCII tag names parse and match', ids(qsa(cjk, '测试')), 'cjk1')

        /* ── memoisation: same string → same parsed object ───────────────────── */
        check(name, 'parseSelector memoises by source string', parseSelector('main > p.x') === parseSelector('main > p.x'), true)
        check(name, 'differently-spelled equivalents are separate cache entries', parseSelector('a>b') === parseSelector('a > b'), false)
        // a failed parse must NOT be cached — it has to throw again, not return a stale hit
        let firstThrow = false, secondThrow = false
        try { parseSelector('p:hover') } catch { firstThrow = true }
        try { parseSelector('p:hover') } catch { secondThrow = true }
        check(name, 'a rejected selector throws on the first parse', firstThrow, true)
        check(name, 'a rejected selector throws again (never cached)', secondThrow, true)

        /* ── querySelector is querySelectorAll[0] ────────────────────────────── */
        check(name, 'querySelector returns the first match', qs(root, 'i'), i1)
        check(name, 'querySelector returns null when nothing matches', qs(root, 'nope'), null)
        check(name, 'the root itself is never a match candidate', qs(root, 'div'), null)

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR selector — parsing</h3><p>grammar, combinators, memoisation</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrSelectorParse} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrSelectorParse)
