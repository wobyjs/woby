import { ssr, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkNodes, comment, el, ids, text } from './ssrCheck'

const name = 'TestSsrTraversal'

const TestSsrTraversal = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR node traversal</h3>
            <p>children, *ElementChild, *ElementSibling, parentElement</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrTraversal.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>children, *ElementChild, *ElementSibling, parentElement</p></div>'

        /* ── fixture: elements deliberately padded with text and comment nodes ──
           <div id=root> "lead" <p id=p1/> <!--c1--> <p id=p2/> "mid" "mid2" <p id=p3/> "tail" </div> */
        const p1 = el('p', { id: 'p1' })
        const p2 = el('p', { id: 'p2' })
        const p3 = el('p', { id: 'p3' })
        const c1 = comment('c1')
        const root = el('div', { id: 'root' },
            text('lead'), p1, c1, p2, text('mid'), text('mid2'), p3, text('tail'))

        /* ── children: elements only ─────────────────────────────────────────── */
        check(name, 'childNodes counts text and comments too', root.childNodes.length, 8)
        checkNodes(name, 'children is elements only, in order', root.children, [p1, p2, p3])
        check(name, 'children returns an Array', Array.isArray(root.children), true)
        check(name, 'children of a leaf element is empty', p1.children.length, 0)
        const textOnly = el('span', null, text('a'), text('b'))
        check(name, 'children of a text-only element is empty', textOnly.children.length, 0)
        const commentOnly = el('span', null, comment('x'))
        check(name, 'children of a comment-only element is empty', commentOnly.children.length, 0)

        /* ── firstElementChild / lastElementChild ────────────────────────────── */
        check(name, 'firstElementChild skips the leading text node', root.firstElementChild, p1)
        check(name, 'firstChild does NOT skip it (contrast)', root.firstChild, root.childNodes[0])
        check(name, 'lastElementChild skips the trailing text node', root.lastElementChild, p3)
        check(name, 'lastChild does NOT skip it (contrast)', root.lastChild, root.childNodes[7])
        check(name, 'firstElementChild is null with no element children', textOnly.firstElementChild, null)
        check(name, 'lastElementChild is null with no element children', textOnly.lastElementChild, null)
        check(name, 'firstElementChild is null with no children at all', p1.firstElementChild, null)
        check(name, 'lastElementChild is null with no children at all', p1.lastElementChild, null)

        /* ── nextElementSibling / previousElementSibling ─────────────────────── */
        check(name, 'nextElementSibling skips an intervening comment', p1.nextElementSibling, p2)
        check(name, 'nextSibling does NOT skip it (contrast)', p1.nextSibling, c1)
        check(name, 'nextElementSibling skips two text nodes', p2.nextElementSibling, p3)
        check(name, 'nextElementSibling is null at the end', p3.nextElementSibling, null)
        check(name, 'previousElementSibling skips two text nodes', p3.previousElementSibling, p2)
        check(name, 'previousElementSibling skips a comment', p2.previousElementSibling, p1)
        check(name, 'previousElementSibling is null before the first element', p1.previousElementSibling, null)
        check(name, 'previousSibling still sees the leading text (contrast)', p1.previousSibling, root.childNodes[0])
        check(name, 'a detached node has no element siblings', el('i').nextElementSibling, null)
        check(name, 'a detached node has no previous element sibling', el('i').previousElementSibling, null)

        /* ── the comment itself participates in sibling walks ────────────────── */
        check(name, 'a comment node reports its next element sibling', c1.nextElementSibling, p2)
        check(name, 'a comment node reports its previous element sibling', c1.previousElementSibling, p1)

        /* ── parentElement is parentNode narrowed to elements ────────────────── */
        check(name, 'parentElement of a child element is the parent', p1.parentElement, root)
        check(name, 'parentElement of a text child is the parent element', root.childNodes[0].parentElement, root)
        check(name, 'parentElement of a detached root is null', root.parentElement, null)
        check(name, 'parentNode of a detached root is null too', root.parentNode, null)
        const frag = ssr.createDocumentFragment()
        const inFrag = el('b', { id: 'inFrag' })
        frag.appendChild(inFrag)
        check(name, 'parentNode inside a fragment is the fragment', inFrag.parentNode, frag)
        check(name, 'parentElement inside a fragment is null (nodeType 11)', inFrag.parentElement, null)
        const doc = createDocument()
        check(name, 'body.parentNode is the document', (doc.body as any).parentNode, doc)
        check(name, 'body.parentElement is null (the document is not an element)', (doc.body as any).parentElement, null)

        /* ── the getters agree with the selector engine ──────────────────────── */
        check(name, 'children matches "#root > *"', ids(root.querySelectorAll('#root > *')), ids(root.children))
        check(name, 'firstElementChild matches querySelector("*")', root.querySelector('*'), root.firstElementChild)

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR node traversal</h3><p>children, *ElementChild, *ElementSibling, parentElement</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrTraversal} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrTraversal)
