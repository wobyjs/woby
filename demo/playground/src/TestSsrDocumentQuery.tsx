import { renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkTrue, el, ids } from './ssrCheck'

const name = 'TestSsrDocumentQuery'

const TestSsrDocumentQuery = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR document queries</h3>
            <p>querySelector, querySelectorAll, getElementById, contains</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrDocumentQuery.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>querySelector, querySelectorAll, getElementById, contains</p></div>'

        const doc = createDocument()
        const head = doc.head as any
        const body = doc.body as any

        // head:  <style id=hs class="k"/> <meta id=hm/>
        // body:  <main id=bm class="k"><p id=bp class="k"/></main> <span id=bs/>
        const hs = el('style', { id: 'hs', class: 'k' })
        const hm = el('meta', { id: 'hm' })
        head.appendChild(hs); head.appendChild(hm)
        const bp = el('p', { id: 'bp', class: 'k' })
        const bm = el('main', { id: 'bm', class: 'k' }, bp)
        const bs = el('span', { id: 'bs' })
        body.appendChild(bm); body.appendChild(bs)

        /* ── shape of the document object ────────────────────────────────────── */
        check(name, 'document.querySelector is a function', typeof doc.querySelector, 'function')
        check(name, 'document.querySelectorAll is a function', typeof doc.querySelectorAll, 'function')
        check(name, 'document.getElementById is a function', typeof doc.getElementById, 'function')
        check(name, 'document.contains is a function', typeof doc.contains, 'function')
        check(name, 'body is an element', body.nodeType, 1)
        check(name, 'head is an element', head.nodeType, 1)
        check(name, 'body.tagName is BODY', body.tagName, 'BODY')
        check(name, 'head.tagName is HEAD', head.tagName, 'HEAD')

        /* ── querySelector: head is searched first, then body ────────────────── */
        check(name, 'a head-only selector resolves in head', doc.querySelector('style'), hs)
        check(name, 'a body-only selector falls through to body', doc.querySelector('main'), bm)
        check(name, 'a selector present in both prefers head', doc.querySelector('.k'), hs)
        check(name, 'querySelector returns null when nothing matches', doc.querySelector('table'), null)
        check(name, 'querySelector never returns body itself', doc.querySelector('body'), null)
        check(name, 'querySelector never returns head itself', doc.querySelector('head'), null)
        check(name, 'a descendant combinator works inside body', doc.querySelector('main > p'), bp)

        /* ── querySelectorAll: head results first, then body results ─────────── */
        check(name, 'querySelectorAll concatenates head then body', ids(doc.querySelectorAll('.k')), 'hs,bm,bp')
        check(name, 'querySelectorAll returns an Array', Array.isArray(doc.querySelectorAll('.k')), true)
        check(name, 'querySelectorAll over "*" spans both trees', ids(doc.querySelectorAll('*')), 'hs,hm,bm,bp,bs')
        check(name, 'a head-only match returns just that', ids(doc.querySelectorAll('meta')), 'hm')
        check(name, 'a body-only match returns just that', ids(doc.querySelectorAll('span')), 'bs')
        check(name, 'no match yields an empty array', doc.querySelectorAll('table').length, 0)

        /* ── getElementById: head first, then body ───────────────────────────── */
        check(name, 'getElementById finds a head element', doc.getElementById('hm'), hm)
        check(name, 'getElementById finds a body element', doc.getElementById('bs'), bs)
        check(name, 'getElementById finds a nested body element', doc.getElementById('bp'), bp)
        check(name, 'getElementById returns null for an unknown id', doc.getElementById('nope'), null)
        check(name, 'getElementById cannot see body itself', doc.getElementById('body'), null)
        {
            // a duplicate id across the two trees resolves to the head one
            const dupHead = el('link', { id: 'dup' })
            const dupBody = el('em', { id: 'dup' })
            head.appendChild(dupHead); body.appendChild(dupBody)
            check(name, 'a duplicated id resolves in head first', doc.getElementById('dup'), dupHead)
            check(name, 'querySelectorAll still reports both', ids(doc.querySelectorAll('#dup')), 'dup,dup')
            dupHead.remove(); dupBody.remove()
            check(name, 'after removal the id is gone', doc.getElementById('dup'), null)
        }

        /* ── contains: head OR body subtree ──────────────────────────────────── */
        checkTrue(name, 'the document contains its own body', doc.contains(body))
        checkTrue(name, 'the document contains its own head', doc.contains(head))
        checkTrue(name, 'the document contains a body descendant', doc.contains(bp))
        checkTrue(name, 'the document contains a head descendant', doc.contains(hs))
        checkFalse(name, 'the document does not contain a detached node', doc.contains(el('i')))
        checkFalse(name, 'the document does not contain itself', doc.contains(doc))
        checkFalse(name, 'contains(null) is false', doc.contains(null))
        {
            const gone = el('i', { id: 'gone' })
            body.appendChild(gone)
            checkTrue(name, 'contains sees a freshly appended node', doc.contains(gone))
            gone.remove()
            checkFalse(name, 'contains sees the removal', doc.contains(gone))
        }

        /* ── a second document never sees the first one's nodes ──────────────── */
        {
            const other = createDocument()
            check(name, 'a fresh document has an empty body', (other.body as any).childNodes.length, 0)
            check(name, 'a fresh document has an empty head', (other.head as any).childNodes.length, 0)
            check(name, 'a fresh document finds nothing', other.querySelectorAll('*').length, 0)
            checkFalse(name, 'a fresh document does not contain the first one\'s nodes', other.contains(bp))
            check(name, 'getElementById across documents returns null', other.getElementById('bp'), null)
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR document queries</h3><p>querySelector, querySelectorAll, getElementById, contains</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrDocumentQuery} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrDocumentQuery)
