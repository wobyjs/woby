import { renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkError, checkNoThrow, checkNodes, el, ids, text } from './ssrCheck'

const name = 'TestSsrMutation'

const TestSsrMutation = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR tree mutation</h3>
            <p>single-parent invariant, insertBefore indexing, remove, replaceWith</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrMutation.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>single-parent invariant, insertBefore indexing, remove, replaceWith</p></div>'

        /* ── appendChild enforces one parent per node ────────────────────────── */
        {
            const moved = el('span', { id: 'moved' })
            const from = el('div', { id: 'from' }, moved)
            const to = el('div', { id: 'to' })
            check(name, 'the node starts in its first parent', ids(from.children), 'moved')
            to.appendChild(moved)
            check(name, 'appendChild detaches it from the old parent', from.childNodes.length, 0)
            check(name, 'appendChild attaches it to the new parent', ids(to.children), 'moved')
            check(name, 'parentNode points at the new parent only', moved.parentNode, to)
            check(name, 'the old parent no longer contains it', from.contains(moved), false)
            check(name, 'the new parent contains it', to.contains(moved), true)
        }

        /* ── appendChild within the same parent moves to the end ─────────────── */
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' }), c = el('i', { id: 'c' })
            const root = el('div', null, a, b, c)
            root.appendChild(a)
            check(name, 're-appending an existing child moves it to the end', ids(root.children), 'b,c,a')
            check(name, 'the child is not duplicated', root.childNodes.length, 3)
        }

        /* ── append() takes several nodes ────────────────────────────────────── */
        {
            const root = el('div')
            root.append(el('i', { id: 'x' }), el('i', { id: 'y' }))
            check(name, 'append() adds every node in order', ids(root.children), 'x,y')
        }

        /* ── insertBefore detaches BEFORE indexing the reference node ────────── */
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' }), c = el('i', { id: 'c' })
            const root = el('div', null, a, b, c)
            root.insertBefore(c, a)
            check(name, 'moving a later child before an earlier one lands correctly', ids(root.children), 'c,a,b')
            check(name, 'the moved child is not duplicated', root.childNodes.length, 3)
        }
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' }), c = el('i', { id: 'c' })
            const root = el('div', null, a, b, c)
            root.insertBefore(a, c)
            check(name, 'moving an earlier child before a later one lands correctly', ids(root.children), 'b,a,c')
        }
        {
            const a = el('i', { id: 'a' })
            const root = el('div', null, a)
            const fresh = el('i', { id: 'fresh' })
            root.insertBefore(fresh, a)
            check(name, 'inserting a fresh node before the first child', ids(root.children), 'fresh,a')
            const tail = el('i', { id: 'tail' })
            root.insertBefore(tail, null)
            check(name, 'insertBefore(node, null) appends', ids(root.children), 'fresh,a,tail')
            check(name, 'insertBefore returns the inserted node', root.insertBefore(el('i', { id: 'r' }), a), root.childNodes[1])
            checkError(name, 'an unrelated reference node throws', () => root.insertBefore(el('i'), el('i')), 'Reference node not found')
        }
        {
            const from = el('div', null, el('i', { id: 'm' }))
            const m = from.firstElementChild
            const target = el('div', null, el('i', { id: 't' }))
            target.insertBefore(m, target.firstElementChild)
            check(name, 'insertBefore across parents detaches from the old one', from.childNodes.length, 0)
            check(name, 'insertBefore across parents inserts at the right index', ids(target.children), 'm,t')
        }

        /* ── removeChild / remove ────────────────────────────────────────────── */
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' })
            const root = el('div', null, a, b)
            check(name, 'removeChild returns the removed node', root.removeChild(a), a)
            check(name, 'removeChild detaches it', a.parentNode, null)
            check(name, 'the parent no longer lists it', ids(root.children), 'b')
            checkError(name, 'removing a non-child throws', () => root.removeChild(el('i')), 'Child node not found')
        }
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' }), c = el('i', { id: 'c' })
            const root = el('div', null, a, b, c)
            b.remove()
            check(name, 'remove() detaches the node from its parent', ids(root.children), 'a,c')
            check(name, 'remove() clears parentNode', b.parentNode, null)
            checkNoThrow(name, 'remove() a second time is a no-op', () => b.remove())
            check(name, 'the second remove() left the tree alone', ids(root.children), 'a,c')
            checkNoThrow(name, 'remove() on a never-attached node is a no-op', () => el('i').remove())
            const t = text('gone')
            root.appendChild(t)
            t.remove()
            check(name, 'remove() works on text nodes too', root.childNodes.length, 2)
        }

        /* ── replaceChild ───────────────────────────────────────────────────── */
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' })
            const root = el('div', null, a, b)
            const fresh = el('i', { id: 'fresh' })
            check(name, 'replaceChild returns the old child', root.replaceChild(fresh, a), a)
            check(name, 'the new child took the slot', ids(root.children), 'fresh,b')
            check(name, 'the old child is detached', a.parentNode, null)
            check(name, 'the new child is attached', fresh.parentNode, root)
            checkError(name, 'replacing a non-child throws', () => root.replaceChild(el('i'), el('i')), 'Old child node not found')
        }

        /* ── replaceWith, including the last-child case ─────────────────────── */
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' })
            const root = el('div', null, a, b)
            const x = el('i', { id: 'x' })
            b.replaceWith(x)
            check(name, 'replaceWith on the LAST child substitutes in place', ids(root.children), 'a,x')
            check(name, 'replaceWith does not append a duplicate', root.childNodes.length, 2)
            check(name, 'the replaced node is detached', b.parentNode, null)
            check(name, 'the replacement is attached', x.parentNode, root)
        }
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' })
            const root = el('div', null, a, b)
            a.replaceWith(el('i', { id: 'x' }))
            check(name, 'replaceWith on the FIRST child substitutes in place', ids(root.children), 'x,b')
        }
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' }), c = el('i', { id: 'c' })
            const root = el('div', null, a, b, c)
            b.replaceWith(el('i', { id: 'x' }), el('i', { id: 'y' }))
            check(name, 'replaceWith accepts several replacements', ids(root.children), 'a,x,y,c')
            check(name, 'the child count reflects all of them', root.childNodes.length, 4)
        }
        {
            const a = el('i', { id: 'a' })
            const root = el('div', null, a)
            a.replaceWith('plain text')
            check(name, 'replaceWith turns a string into a text node', root.childNodes.length, 1)
            check(name, 'the text node carries the string', root.childNodes[0].textContent, 'plain text')
            check(name, 'the text node has nodeType 3', root.childNodes[0].nodeType, 3)
            check(name, 'it is not counted as an element child', root.children.length, 0)
        }
        {
            const a = el('i', { id: 'a' }), b = el('i', { id: 'b' })
            const root = el('div', null, a, b)
            a.replaceWith()
            check(name, 'replaceWith() with no arguments removes the node', ids(root.children), 'b')
        }
        checkNoThrow(name, 'replaceWith on a detached node is a no-op', () => el('i').replaceWith(el('b')))

        /* ── mutations are visible to the selector engine immediately ────────── */
        {
            const root = el('div', { id: 'live' }, el('p', { id: 'p1', class: 'k' }))
            check(name, 'the query sees the initial child', ids(root.querySelectorAll('.k')), 'p1')
            root.appendChild(el('p', { id: 'p2', class: 'k' }))
            check(name, 'the query sees an appended child', ids(root.querySelectorAll('.k')), 'p1,p2')
            root.firstElementChild.remove()
            check(name, 'the query sees a removed child', ids(root.querySelectorAll('.k')), 'p2')
            checkNodes(name, 'querySelectorAll agrees with children after mutation', root.querySelectorAll('.k'), root.children)
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR tree mutation</h3><p>single-parent invariant, insertBefore indexing, remove, replaceWith</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrMutation} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrMutation)
