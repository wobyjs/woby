import { $, ssr, isNode, createDocument, renderToString, Fragment, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkNoThrow, checkTrue, comment, el, text } from './ssrCheck'

const name = 'TestSsrReactiveChild'

const TestSsrReactiveChild = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR reactive children</h3>
            <p>isNode without the Node global, reactive children under renderToString</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

/** renders `fn` through renderToString and compares the whole string. */
const rs = (label: string, fn: any, want: string) => check(name, label, renderToString(fn), want)

TestSsrReactiveChild.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>isNode without the Node global, reactive children under renderToString</p></div>'

        // -- isNode() is structural, not `instanceof Node` --------------------------
        // `Node` is a browser global, so `value instanceof Node` throws ReferenceError
        // under Node.js instead of answering false. Every real DOM node and every node
        // in woby's own SSR tree carries a numeric nodeType, so one test answers in both.
        checkTrue(name, 'isNode accepts an SSR element', isNode(ssr.createElement('p') as any))
        checkTrue(name, 'isNode accepts an SSR text node', isNode(ssr.createText('t') as any))
        checkTrue(name, 'isNode accepts an SSR comment', isNode(ssr.createComment('c') as any))
        checkTrue(name, 'isNode accepts a document fragment', isNode(ssr.createDocumentFragment() as any))
        checkTrue(name, 'isNode accepts an SVG node', isNode((ssr as any).createSVGNode('svg')))
        {
            const doc = createDocument()
            checkTrue(name, 'isNode accepts document.body', isNode(doc.body as any))
            checkTrue(name, 'isNode accepts document.head', isNode(doc.head as any))
            checkFalse(name, 'isNode rejects the SSR document (it carries no nodeType)', isNode(doc as any))
        }
        checkFalse(name, 'isNode rejects null', isNode(null))
        checkFalse(name, 'isNode rejects undefined', isNode(undefined))
        checkFalse(name, 'isNode rejects a string', isNode('x'))
        checkFalse(name, 'isNode rejects a number', isNode(1))
        checkFalse(name, 'isNode rejects a boolean', isNode(true))
        checkFalse(name, 'isNode rejects a plain object', isNode({}))
        checkFalse(name, 'isNode rejects an array', isNode([]))
        checkFalse(name, 'isNode rejects a function', isNode(() => 1))
        checkTrue(name, 'isNode accepts anything with a numeric nodeType (cross-realm safe)', isNode({ nodeType: 1 } as any))
        checkFalse(name, 'isNode rejects a string nodeType', isNode({ nodeType: '1' } as any))
        checkNoThrow(name, 'isNode never throws when the Node global is absent', () => isNode(ssr.createElement('p') as any))

        // -- a reactive child is a function child: it must survive SSR --------------
        // `{() => cond && <p/>}` used to crash before the diff ever ran, because the
        // diff compared against the browser-only `Node` global. These render the whole
        // shape end to end, which is the only way to prove the crash is gone.
        rs('a truthy && renders its element', () => <div>{() => true && <p>yes</p>}</div>, '<div><p>yes</p></div>')
        rs('a falsy && renders nothing', () => <div>{() => false && <p>yes</p>}</div>, '<div></div>')
        rs('a null child renders nothing', () => <div>{() => null}</div>, '<div></div>')
        rs('an undefined child renders nothing', () => <div>{() => undefined}</div>, '<div></div>')
        rs('a bare false child renders nothing', () => <div>{() => false}</div>, '<div></div>')
        rs('a bare true child renders nothing', () => <div>{() => true}</div>, '<div></div>')
        rs('an empty string child renders nothing', () => <div>{() => ''}</div>, '<div></div>')
        rs('a string child renders as text', () => <div>{() => 'txt'}</div>, '<div>txt</div>')
        rs('a number child renders as text', () => <div>{() => 42}</div>, '<div>42</div>')
        rs('zero is rendered, not dropped', () => <div>{() => 0}</div>, '<div>0</div>')
        rs('NaN is rendered as text', () => <div>{() => NaN}</div>, '<div>NaN</div>')
        rs('a ternary picks the true branch', () => <div>{() => (1 > 0 ? <b>t</b> : <i>f</i>)}</div>, '<div><b>t</b></div>')
        rs('a ternary picks the false branch', () => <div>{() => (1 > 2 ? <b>t</b> : <i>f</i>)}</div>, '<div><i>f</i></div>')
        rs('a conditional string child renders', () => <div>{() => true && 'str'}</div>, '<div>str</div>')
        rs('an array child renders every element', () => <div>{() => [<p>a</p>, <p>b</p>]}</div>, '<div><p>a</p><p>b</p></div>')
        rs('a nested array child is flattened', () => <div>{() => [[<p>a</p>], [<p>b</p>]]}</div>, '<div><p>a</p><p>b</p></div>')
        rs('a mixed array drops only the nullish entries', () => <div>{() => ['a', <p>b</p>, null, 3]}</div>, '<div>a<p>b</p>3</div>')
        rs('reactive children nest', () => <div>{() => true && <section>{() => true && <p>deep</p>}</section>}</div>, '<div><section><p>deep</p></section></div>')
        rs('a function returning a function is resolved through', () => <div>{() => () => <p>ff</p>}</div>, '<div><p>ff</p></div>')
        rs('three levels of function are resolved through', () => <div>{() => () => () => 'x'}</div>, '<div>x</div>')
        rs('a reactive child keeps its place between static siblings', () => <div><span>s</span>{() => true && <p>r</p>}<span>e</span></div>, '<div><span>s</span><p>r</p><span>e</span></div>')
        rs('a removed reactive child leaves the siblings in order', () => <div><span>s</span>{() => false && <p>r</p>}<span>e</span></div>, '<div><span>s</span><span>e</span></div>')
        rs('attributes survive alongside a reactive child', () => <div class="c" id="i">{() => true && <p>y</p>}</div>, '<div class="c" id="i"><p>y</p></div>')
        rs('a void element as a reactive child self-closes', () => <div>{() => true && <br />}</div>, '<div><br /></div>')
        rs('a Fragment child is unwrapped', () => <div><Fragment><p>1</p><p>2</p></Fragment></div>, '<div><p>1</p><p>2</p></div>')

        // -- an observable child re-renders with its current value ------------------
        {
            const count = $(0)
            const Counter = () => <div>{() => count()}</div>
            check(name, 'the observable renders its initial value', renderToString(Counter), '<div>0</div>')
            count(1)
            check(name, 'the observable renders the updated value', renderToString(Counter), '<div>1</div>')
            count(2)
            check(name, 'and again on the next change', renderToString(Counter), '<div>2</div>')
        }
        {
            const flag = $(true)
            const Toggle = () => <div>{() => flag() ? <b>on</b> : <i>off</i>}</div>
            check(name, 'an observable ternary renders the true branch', renderToString(Toggle), '<div><b>on</b></div>')
            flag(false)
            check(name, 'an observable ternary renders the false branch', renderToString(Toggle), '<div><i>off</i></div>')
            flag(true)
            check(name, 'and switches back', renderToString(Toggle), '<div><b>on</b></div>')
        }
        {
            const show = $(false)
            const Cond = () => <div>{() => show() && <p>shown</p>}</div>
            check(name, 'an observable && starts hidden', renderToString(Cond), '<div></div>')
            show(true)
            check(name, 'an observable && appears when the value flips', renderToString(Cond), '<div><p>shown</p></div>')
        }
        {
            const items = $([1, 2, 3])
            const List = () => <ul>{() => items().map(i => <li>{i}</li>)}</ul>
            check(name, 'an observable array renders every item', renderToString(List), '<ul><li>1</li><li>2</li><li>3</li></ul>')
            items([])
            check(name, 'an emptied observable array renders nothing', renderToString(List), '<ul></ul>')
            items([9])
            check(name, 'a refilled observable array renders again', renderToString(List), '<ul><li>9</li></ul>')
        }

        // -- reactive children never throw, whatever they hold ----------------------
        checkNoThrow(name, 'a reactive child holding an SSR node does not throw', () => renderToString(() => <div>{() => el('p', null, 'n')}</div>))
        checkNoThrow(name, 'a reactive child holding a comment node does not throw', () => renderToString(() => <div>{() => comment('c')}</div>))
        checkNoThrow(name, 'a reactive child holding a text node does not throw', () => renderToString(() => <div>{() => text('t')}</div>))
        checkNoThrow(name, 'a reactive child holding an empty array does not throw', () => renderToString(() => <div>{() => []}</div>))

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR reactive children</h3><p>isNode without the Node global, reactive children under renderToString</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrReactiveChild} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrReactiveChild)
