import { ssr, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkTrue, el, ids, text } from './ssrCheck'

const name = 'TestSsrSelectorMatch'

const TestSsrSelectorMatch = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR selector — matching</h3>
            <p>attribute operators, matches, closest</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrSelectorMatch.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>attribute operators, matches, closest</p></div>'

        const { matchesSelector: m, closestSelector, querySelectorAll: qsa } = ssr

        /* ── the node under test carries one attribute of every interesting shape ── */
        const node = el('a', {
            id: 'target',
            class: 'alpha beta gamma',
            'data-lang': 'en-GB',
            'data-empty': '',
            'data-path': '/docs/intro.html',
            'data-num': '42',
            title: 'Hello World',
        })

        /* ── tag / id / class ────────────────────────────────────────────────── */
        checkTrue(name, 'tag matches', m(node, 'a'))
        checkTrue(name, 'tag matching ignores case', m(node, 'A'))
        checkFalse(name, 'a different tag does not match', m(node, 'b'))
        checkTrue(name, '#id matches', m(node, '#target'))
        checkFalse(name, 'a different #id does not match', m(node, '#other'))
        checkTrue(name, 'a class in the middle of the list matches', m(node, '.beta'))
        checkTrue(name, 'several classes must all match', m(node, '.alpha.gamma'))
        checkFalse(name, 'one missing class fails the compound', m(node, '.alpha.delta'))
        checkFalse(name, 'class matching is case-sensitive', m(node, '.Alpha'))
        checkFalse(name, 'a class is matched whole, not as a prefix', m(node, '.alph'))

        /* ── attribute presence ──────────────────────────────────────────────── */
        checkTrue(name, '[attr] matches on presence', m(node, '[data-lang]'))
        checkTrue(name, '[attr] matches an attribute present but empty', m(node, '[data-empty]'))
        checkFalse(name, '[attr] fails when absent', m(node, '[data-missing]'))
        checkTrue(name, 'whitespace inside [ ] is allowed', m(node, '[ data-lang ]'))

        /* ── "=" exact ───────────────────────────────────────────────────────── */
        checkTrue(name, '[a=v] bare value', m(node, '[data-lang=en-GB]'))
        checkTrue(name, '[a="v"] double-quoted', m(node, '[data-lang="en-GB"]'))
        checkTrue(name, "[a='v'] single-quoted", m(node, "[data-lang='en-GB']"))
        checkTrue(name, 'a quoted value may contain spaces', m(node, '[title="Hello World"]'))
        checkFalse(name, 'a bare value cannot span the space', m(node, '[title=Hello]'))
        checkTrue(name, 'a numeric attribute is compared as a string', m(node, '[data-num="42"]'))
        checkTrue(name, '[a=""] matches an empty attribute', m(node, '[data-empty=""]'))
        checkFalse(name, '[a=""] does not match a non-empty one', m(node, '[data-lang=""]'))
        checkTrue(name, 'a backslash escapes the closing quote', m(el('i', { d: 'a"b' }), '[d="a\\"b"]'))

        /* ── "~=" whitespace-separated membership ────────────────────────────── */
        checkTrue(name, '[class~=beta] finds a list member', m(node, '[class~=beta]'))
        checkFalse(name, '[class~=bet] does not match a prefix', m(node, '[class~=bet]'))
        checkFalse(name, '[class~=""] never matches', m(node, '[class~=""]'))
        checkFalse(name, '[data-empty~=""] never matches either', m(node, '[data-empty~=""]'))

        /* ── "|=" exact or hyphen-prefixed ───────────────────────────────────── */
        checkTrue(name, '[a|=en] matches "en-GB"', m(node, '[data-lang|=en]'))
        checkTrue(name, '[a|=en-GB] matches exactly', m(node, '[data-lang|=en-GB]'))
        checkFalse(name, '[a|=e] does not match "en-GB"', m(node, '[data-lang|=e]'))
        checkTrue(name, '[a|=""] matches an empty attribute (empty is not special here)', m(node, '[data-empty|=""]'))

        /* ── "^=" / "$=" / "*=" substring family ─────────────────────────────── */
        checkTrue(name, '[a^=/docs] matches the prefix', m(node, '[data-path^="/docs"]'))
        checkFalse(name, '[a^=docs] is anchored at the start', m(node, '[data-path^="docs"]'))
        checkTrue(name, '[a$=.html] matches the suffix', m(node, '[data-path$=".html"]'))
        checkFalse(name, '[a$=.htm] is anchored at the end', m(node, '[data-path$=".htm"]'))
        checkTrue(name, '[a*=intro] matches anywhere', m(node, '[data-path*="intro"]'))
        checkFalse(name, '[a*=nope] fails when absent', m(node, '[data-path*="nope"]'))
        checkFalse(name, '[a^=""] never matches', m(node, '[data-path^=""]'))
        checkFalse(name, '[a$=""] never matches', m(node, '[data-path$=""]'))
        checkFalse(name, '[a*=""] never matches', m(node, '[data-path*=""]'))

        /* ── the case-sensitivity flag is accepted and ignored ───────────────── */
        checkTrue(name, 'the "i" flag parses', m(node, '[data-lang="en-GB" i]'))
        checkTrue(name, 'the "s" flag parses', m(node, '[data-lang="en-GB" s]'))
        checkFalse(name, 'the flag is ignored — matching stays exact', m(node, '[data-lang="EN-GB" i]'))

        /* ── matches() only ever answers for elements ────────────────────────── */
        checkFalse(name, 'a text node never matches', m(text('hi'), '*'))
        checkFalse(name, 'a comment never matches', m(ssr.createComment('c'), '*'))
        checkFalse(name, 'null never matches', m(null, '*'))
        checkFalse(name, 'a document fragment never matches', m(ssr.createDocumentFragment(), '*'))

        /* ── closest(): self first, then ancestors ───────────────────────────── */
        const leaf = el('span', { id: 'leaf', class: 'hit' })
        const inner = el('section', { id: 'inner' }, leaf)
        const outer = el('div', { id: 'outer', class: 'hit' }, inner)
        check(name, 'closest matches self before any ancestor', closestSelector(leaf, '.hit'), leaf)
        check(name, 'closest walks up to the nearest matching ancestor', closestSelector(leaf, 'div'), outer)
        check(name, 'closest stops at the first match going up', closestSelector(leaf, '#inner'), inner)
        check(name, 'closest returns null when nothing matches', closestSelector(leaf, 'nope'), null)
        check(name, 'closest on a detached root can still match itself', closestSelector(outer, '#outer'), outer)
        check(name, 'closest on a text node returns null', closestSelector(text('t'), '*'), null)

        /* ── ancestor steps see past the query root (documented :scope gap) ──── */
        check(name, 'an ancestor above the query root still satisfies a descendant step', ids(qsa(inner, 'div span')), 'leaf')

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR selector — matching</h3><p>attribute operators, matches, closest</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrSelectorMatch} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrSelectorMatch)
