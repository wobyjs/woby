import { ssr, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkTrue, comment, el, text } from './ssrCheck'

const name = 'TestSsrIdentity'

const TestSsrIdentity = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR node identity</h3>
            <p>contains, getRootNode, ownerDocument stamping</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrIdentity.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>contains, getRootNode, ownerDocument stamping</p></div>'

        /* ── contains(): self and every descendant ───────────────────────────── */
        {
            const leaf = el('b', { id: 'leaf' })
            const mid = el('section', { id: 'mid' }, leaf)
            const root = el('div', { id: 'root' }, mid)
            const outsider = el('div', { id: 'outsider' })
            const t = text('t')
            root.appendChild(t)

            checkTrue(name, 'a node contains itself', root.contains(root))
            checkTrue(name, 'a node contains its direct child', root.contains(mid))
            checkTrue(name, 'a node contains a deep descendant', root.contains(leaf))
            checkTrue(name, 'a node contains a text descendant', root.contains(t))
            checkTrue(name, 'the intermediate node contains the leaf', mid.contains(leaf))
            checkFalse(name, 'a descendant does not contain its ancestor', leaf.contains(root))
            checkFalse(name, 'an unrelated node is not contained', root.contains(outsider))
            checkFalse(name, 'a detached node is not contained', root.contains(el('i')))
            checkFalse(name, 'contains(null) is false', root.contains(null))
            checkFalse(name, 'contains(undefined) is false', root.contains(undefined))
            leaf.remove()
            checkFalse(name, 'contains reflects removal immediately', root.contains(leaf))
            checkTrue(name, 'the removed node still contains itself', leaf.contains(leaf))
        }

        /* ── getRootNode(): topmost node of the tree, not the owner document ─── */
        {
            const leaf = el('b', { id: 'leaf' })
            const mid = el('section', null, leaf)
            const root = el('div', { id: 'top' }, mid)
            check(name, 'getRootNode from a leaf finds the detached top', leaf.getRootNode(), root)
            check(name, 'getRootNode from mid finds the same top', mid.getRootNode(), root)
            check(name, 'getRootNode on the top returns itself', root.getRootNode(), root)
        }
        {
            const orphan = el('i')
            check(name, 'getRootNode on a lone node is that node', orphan.getRootNode(), orphan)
            const frag = ssr.createDocumentFragment()
            const inside = el('i')
            frag.appendChild(inside)
            check(name, 'getRootNode inside a fragment is the fragment', inside.getRootNode(), frag)
        }
        {
            const doc = createDocument()
            const node = doc.createElement('p')
            doc.body.appendChild(node as any)
            check(name, 'getRootNode from inside body reaches the document', (node as any).getRootNode(), doc)
            check(name, 'getRootNode from body itself reaches the document', (doc.body as any).getRootNode(), doc)
            // head is stamped but deliberately has no parentNode — only body is linked upward
            check(name, 'getRootNode from head stops at head (head has no parentNode)', (doc.head as any).getRootNode(), doc.head)
        }

        /* ── ownerDocument: stamped by every factory ─────────────────────────── */
        {
            const doc = createDocument()
            check(name, 'createElement stamps the document', (doc.createElement('div') as any)._ownerDocument, doc)
            check(name, 'createElement ownerDocument resolves while detached', (doc.createElement('div') as any).ownerDocument, doc)
            check(name, 'createTextNode stamps the document', (doc.createTextNode('t') as any).ownerDocument, doc)
            check(name, 'createComment stamps the document', (doc.createComment('c') as any).ownerDocument, doc)
            check(name, 'createDocumentFragment stamps the document', (doc.createDocumentFragment() as any).ownerDocument, doc)
            check(name, 'createElementNS stamps the document', (doc.createElementNS('http://www.w3.org/1999/xhtml', 'span') as any).ownerDocument, doc)
            check(name, 'createElementNS(svg) stamps the document too', (doc.createElementNS('http://www.w3.org/2000/svg', 'svg') as any).ownerDocument, doc)
            check(name, 'body carries the stamp', (doc.body as any)._ownerDocument, doc)
            check(name, 'head carries the stamp', (doc.head as any)._ownerDocument, doc)
        }
        {
            // The bare module-level factories belong to no document until they are inserted.
            const bare = ssr.createElement('div')
            check(name, 'a bare factory node has no owner document', (bare as any).ownerDocument, null)
            check(name, 'a bare factory node has a null _ownerDocument field', (bare as any)._ownerDocument, null)

            const doc = createDocument()
            const owned = doc.createElement('section')
            owned.appendChild(bare as any)
            check(name, 'inserting under an owned parent gives it that owner', (bare as any).ownerDocument, doc)
            check(name, 'the stamp itself is NOT copied down the tree', (bare as any)._ownerDocument, null)

            const deep = ssr.createElement('b')
            ;(bare as any).appendChild(deep)
            check(name, 'ownerDocument resolves through several ancestors', (deep as any).ownerDocument, doc)
            ;(bare as any).remove()
            check(name, 'detaching the subtree drops the inherited owner', (deep as any).ownerDocument, null)

            const t = ssr.createText('x')
            doc.body.appendChild(t as any)
            check(name, 'a bare text node inserted into body inherits the owner', (t as any).ownerDocument, doc)
            const cm = ssr.createComment('x')
            doc.head.appendChild(cm as any)
            check(name, 'a bare comment inserted into head inherits the owner', (cm as any).ownerDocument, doc)
        }

        /* ── documents are isolated from one another ─────────────────────────── */
        {
            const d1 = createDocument()
            const d2 = createDocument()
            check(name, 'two documents are distinct objects', d1 === d2, false)
            check(name, 'their bodies are distinct', (d1.body as any) === (d2.body as any), false)
            check(name, 'their heads are distinct', (d1.head as any) === (d2.head as any), false)
            const n1 = d1.createElement('p')
            check(name, 'a node made by d1 is owned by d1', (n1 as any).ownerDocument, d1)
            check(name, 'and is not owned by d2', (n1 as any).ownerDocument === d2, false)
            d2.body.appendChild(n1 as any)
            check(name, 'the creating document still wins over the containing one', (n1 as any).ownerDocument, d1)
        }

        /* ── isConnected: a documented gap — createDocument() has no nodeType 9 ─ */
        {
            const doc = createDocument()
            const node = doc.createElement('p')
            doc.body.appendChild(node as any)
            check(name, 'the SSR document deliberately carries no nodeType', (doc as any).nodeType, undefined)
            checkFalse(name, 'isConnected stays false inside body (known gap)', (node as any).isConnected)
            checkFalse(name, 'isConnected is false for a detached node', el('i').isConnected)
        }

        /* ── isSameNode / isEqualNode / hasChildNodes ────────────────────────── */
        {
            const a = el('i', { id: 'a' })
            checkTrue(name, 'isSameNode is reference identity', a.isSameNode(a))
            checkFalse(name, 'isSameNode is false for a twin', a.isSameNode(el('i', { id: 'a' })))
            checkTrue(name, 'isEqualNode is true for itself', a.isEqualNode(a))
            checkFalse(name, 'hasChildNodes is false when empty', a.hasChildNodes())
            a.appendChild(comment('c'))
            checkTrue(name, 'hasChildNodes counts non-element children', a.hasChildNodes())
            check(name, 'but children stays empty for a comment', a.children.length, 0)
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR node identity</h3><p>contains, getRootNode, ownerDocument stamping</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrIdentity} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrIdentity)
