import { ssr, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkNodes, checkTrue, comment, el, ids, tags, text } from './ssrCheck'

const name = 'TestSsrSelectorQuery'

const TestSsrSelectorQuery = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR selector — queries</h3>
            <p>descendantElements, querySelectorAll, getElementsBy*</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrSelectorQuery.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>descendantElements, querySelectorAll, getElementsBy*</p></div>'

        const { descendantElements, querySelector: qs, querySelectorAll: qsa, getElementById: byId } = ssr

        /* ── fixture ────────────────────────────────────────────────────────────
           <div id=root>
             "lead text"  <!--c-->
             <ul id=list>
               <li id=l1 class="item on">a</li>
               <li id=l2 class="item">b</li>
               <li id=l3 class="item on wide">c</li>
             </ul>
             <p id=foot class="note">z</p>
           </div>                                                              */
        const l1 = el('li', { id: 'l1', class: 'item on' }, 'a')
        const l2 = el('li', { id: 'l2', class: 'item' }, 'b')
        const l3 = el('li', { id: 'l3', class: 'item on wide' }, 'c')
        const list = el('ul', { id: 'list' }, l1, l2, l3)
        const foot = el('p', { id: 'foot', class: 'note' }, 'z')
        const root = el('div', { id: 'root' }, text('lead text'), comment('c'), list, foot)

        /* ── descendantElements: element-only, document order, a generator ───── */
        const walked = [...descendantElements(root)]
        check(name, 'descendantElements yields document order', ids(walked), 'list,l1,l2,l3,foot')
        check(name, 'descendantElements skips text and comment nodes', walked.length, 5)
        check(name, 'descendantElements never yields the root itself', walked.includes(root), false)
        checkTrue(name, 'descendantElements is a generator (lazy)', typeof (descendantElements(root) as any).next === 'function')
        check(name, 'descendantElements of a leaf is empty', [...descendantElements(l1)].length, 0)
        check(name, 'descendantElements tolerates a childless node', [...descendantElements(text('x'))].length, 0)
        check(name, 'descendantElements tolerates null', [...descendantElements(null)].length, 0)

        /* ── querySelectorAll returns a real array ───────────────────────────── */
        const all = qsa(root, 'li')
        checkTrue(name, 'querySelectorAll returns an Array', Array.isArray(all))
        check(name, 'the array has .length', all.length, 3)
        check(name, 'the array is numerically indexable', all[1], l2)
        check(name, 'the array supports for…of', (() => { let n = 0; for (const _ of all) n++; return n })(), 3)
        check(name, 'the array spreads', [...all].length, 3)
        check(name, 'the array has .forEach', typeof all.forEach, 'function')
        check(name, 'the array has .map/.filter', typeof all.map === 'function' && typeof all.filter === 'function', true)
        check(name, 'Array.from works on it', Array.from(all).length, 3)
        check(name, 'no match yields an empty array, not null', qsa(root, 'table').length, 0)

        /* ── querySelector picks the first in document order ─────────────────── */
        check(name, 'querySelector returns the first li', qs(root, 'li'), l1)
        check(name, 'querySelector honours the compound', qs(root, 'li.on'), l1)
        check(name, 'querySelector honours a child combinator', qs(root, 'ul > li.on'), l1)
        check(name, 'querySelector returns null on no match', qs(root, 'table'), null)

        /* ── getElementById ──────────────────────────────────────────────────── */
        check(name, 'getElementById finds a nested element', byId(root, 'l3'), l3)
        check(name, 'getElementById matches the id exactly', byId(root, 'l'), null)
        check(name, 'getElementById never returns the root itself', byId(root, 'root'), null)
        check(name, 'getElementById returns null for an unknown id', byId(root, 'nope'), null)

        /* ── getElementsByTagName ────────────────────────────────────────────── */
        check(name, 'getElementsByTagName("li") finds all three', ids(root.getElementsByTagName('li')), 'l1,l2,l3')
        check(name, 'getElementsByTagName is case-insensitive', ids(root.getElementsByTagName('LI')), 'l1,l2,l3')
        check(name, 'getElementsByTagName("*") is every descendant', ids(root.getElementsByTagName('*')), 'list,l1,l2,l3,foot')
        check(name, 'getElementsByTagName excludes the root', root.getElementsByTagName('div').length, 0)
        check(name, 'getElementsByTagName returns [] when absent', root.getElementsByTagName('table').length, 0)

        /* ── getElementsByClassName: all listed classes must be present ──────── */
        check(name, 'one class matches every element carrying it', ids(root.getElementsByClassName('item')), 'l1,l2,l3')
        check(name, 'two classes require both', ids(root.getElementsByClassName('item on')), 'l1,l3')
        check(name, 'the order of the requested classes is irrelevant', ids(root.getElementsByClassName('on item')), 'l1,l3')
        check(name, 'an element may carry extra classes', ids(root.getElementsByClassName('wide')), 'l3')
        check(name, 'multiple spaces between class names are collapsed', ids(root.getElementsByClassName('item   on')), 'l1,l3')
        check(name, 'an empty string yields []', root.getElementsByClassName('').length, 0)
        check(name, 'a whitespace-only string yields []', root.getElementsByClassName('   ').length, 0)
        check(name, 'an unknown class yields []', root.getElementsByClassName('missing').length, 0)

        /* ── element-scoped queries start below the element ──────────────────── */
        check(name, 'list.querySelectorAll("li") is scoped to the list', ids(list.querySelectorAll('li')), 'l1,l2,l3')
        check(name, 'foot.querySelectorAll("li") sees nothing', foot.querySelectorAll('li').length, 0)
        check(name, 'element.querySelector delegates to the engine', list.querySelector('li'), l1)
        checkTrue(name, 'element.matches delegates to the engine', l3.matches('li.wide'))
        check(name, 'element.closest delegates to the engine', l3.closest('#root'), root)
        check(name, 'element.closest returns null above the tree', l3.closest('body'), null)

        /* ── shadow trees are never entered ──────────────────────────────────── */
        const hostChild = el('span', { id: 'light' })
        const host = el('x-host', { id: 'host' }, hostChild)
            ; (host as any).shadowRoot = el('div', null, el('span', { id: 'shadow' }))
        check(name, 'a light-DOM child is found', ids(qsa(host, 'span')), 'light')
        checkFalse(name, 'a shadow-DOM child is NOT found', !!qs(host, '#shadow'))
        check(name, 'tag order across the fixture is stable', tags(qsa(root, '*')), 'ul,li,li,li,p')

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR selector — queries</h3><p>descendantElements, querySelectorAll, getElementsBy*</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrSelectorQuery} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrSelectorQuery)
