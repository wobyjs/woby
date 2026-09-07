import { ssr, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkTrue, el, ids, text } from './ssrCheck'

const name = 'TestSsrElement'

const TestSsrElement = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR element API</h3>
            <p>attributes, className, htmlFor, innerHTML, outerHTML, cloneNode</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSsrElement.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>attributes, className, htmlFor, innerHTML, outerHTML, cloneNode</p></div>'

        /* -- tagName is normalised to upper case on construction -------------- */
        check(name, 'tagName is upper-cased', (ssr.createElement('div') as any).tagName, 'DIV')
        check(name, 'an already-upper tag stays upper', (ssr.createElement('DIV') as any).tagName, 'DIV')
        check(name, 'a hyphenated custom tag is upper-cased whole', (ssr.createElement('my-widget') as any).tagName, 'MY-WIDGET')
        check(name, 'a mixed-case custom tag is upper-cased', (ssr.createElement('MyWidget') as any).tagName, 'MYWIDGET')
        check(name, 'a fresh element has no attributes', Object.keys((ssr.createElement('div') as any).attributes).length, 0)
        check(name, 'a fresh element has no children', (ssr.createElement('div') as any).childNodes.length, 0)
        check(name, 'nodeType is 1', (ssr.createElement('div') as any).nodeType, 1)

        /* -- get / set / has / removeAttribute -------------------------------- */
        {
            const e = ssr.createElement('div') as any
            check(name, 'getAttribute on a missing attribute is null', e.getAttribute('data-x'), null)
            checkFalse(name, 'hasAttribute is false before the set', e.hasAttribute('data-x'))
            e.setAttribute('data-x', 'one')
            check(name, 'getAttribute reads back what was set', e.getAttribute('data-x'), 'one')
            checkTrue(name, 'hasAttribute is true after the set', e.hasAttribute('data-x'))
            check(name, 'the raw attributes map carries it too', e.attributes['data-x'], 'one')
            e.setAttribute('data-x', 'two')
            check(name, 'setting again overwrites', e.getAttribute('data-x'), 'two')
            e.setAttribute('data-n', 42)
            check(name, 'a numeric value is stringified', e.getAttribute('data-n'), '42')
            e.setAttribute('data-b', false)
            check(name, 'a boolean value is stringified', e.getAttribute('data-b'), 'false')
            e.setAttribute('data-empty', '')
            check(name, 'an empty string is stored as an empty string', e.getAttribute('data-empty'), '')
            checkTrue(name, 'hasAttribute is true for an empty value', e.hasAttribute('data-empty'))
            e.removeAttribute('data-x')
            check(name, 'removeAttribute makes getAttribute null again', e.getAttribute('data-x'), null)
            checkFalse(name, 'removeAttribute makes hasAttribute false', e.hasAttribute('data-x'))
            checkFalse(name, 'the key is gone from the raw map', 'data-x' in e.attributes)
            check(name, 'removing an absent attribute is a no-op', e.removeAttribute('nope'), undefined)
            check(name, 'the surviving attributes are untouched', e.getAttribute('data-n'), '42')
        }

        /* -- className is mirrored into attributes.class both ways ------------ */
        {
            const e = ssr.createElement('div') as any
            check(name, 'className starts as an empty string', e.className, '')
            e.className = 'a b'
            check(name, 'the className setter writes the class attribute', e.getAttribute('class'), 'a b')
            check(name, 'and the raw map agrees', e.attributes['class'], 'a b')
            e.setAttribute('class', 'c d')
            check(name, 'setAttribute("class") routes through the setter', e.className, 'c d')
            check(name, 'the selector engine sees the new class', e.matches('.c'), true)
            check(name, 'and no longer sees the old one', e.matches('.a'), false)
            e.removeAttribute('class')
            check(name, 'removeAttribute("class") clears the attribute', e.getAttribute('class'), null)
            check(name, 'removeAttribute("class") also clears className', e.className, '')
            check(name, 'the selector engine sees no class at all', e.matches('.c'), false)
        }
        {
            // setAttribute('className', v) is accepted as an alias, and -- documented
            // quirk -- the raw name is ALSO stored alongside the canonical 'class' key.
            const e = ssr.createElement('div') as any
            e.setAttribute('className', 'k')
            check(name, 'setAttribute("className") sets the class attribute', e.getAttribute('class'), 'k')
            check(name, 'setAttribute("className") sets className', e.className, 'k')
            check(name, 'the className alias key is stored too (quirk)', e.attributes['className'], 'k')
            check(name, 'the selector engine matches on the canonical class', e.matches('.k'), true)
            e.removeAttribute('className')
            check(name, 'removing the alias clears className', e.className, '')
            check(name, 'removing the alias drops the alias key', 'className' in e.attributes, false)
        }

        /* -- htmlFor is rewritten to the HTML "for" attribute ----------------- */
        {
            const e = ssr.createElement('label') as any
            e.setAttribute('htmlFor', 'field1')
            check(name, 'htmlFor is stored as "for"', e.getAttribute('for'), 'field1')
            check(name, 'the htmlFor alias key is stored too (quirk)', e.attributes['htmlFor'], 'field1')
            check(name, 'an attribute selector matches on "for"', e.matches('[for="field1"]'), true)
        }

        /* -- id has a real getter/setter pair --------------------------------- */
        {
            const e = ssr.createElement('div') as any
            check(name, 'id is null before it is set', e.id, null)
            e.id = 'ident'
            check(name, 'the id setter writes the attribute', e.getAttribute('id'), 'ident')
            check(name, 'the id getter reads it back', e.id, 'ident')
            check(name, 'an id selector matches', e.matches('#ident'), true)
            e.removeAttribute('id')
            check(name, 'the id getter is null again after removal', e.id, null)
        }

        /* -- style stays a Style object even when the attribute is set -------- */
        {
            const e = ssr.createElement('div') as any
            checkTrue(name, 'style is an object from the start', typeof e.style === 'object' && e.style !== null)
            const before = e.style
            e.setAttribute('style', 'color: red')
            check(name, 'setAttribute("style") stores the string', e.getAttribute('style'), 'color: red')
            check(name, 'but does NOT clobber the Style object', e.style, before)
        }

        /* -- classList.toggle keeps the class attribute in sync --------------- */
        {
            const e = ssr.createElement('div') as any
            check(name, 'toggle adds a missing class and returns true', e.classList.toggle('on'), true)
            check(name, 'the class attribute now holds it', e.getAttribute('class'), 'on')
            check(name, 'toggle removes an existing class and returns false', e.classList.toggle('on'), false)
            check(name, 'the class attribute is emptied', e.getAttribute('class'), '')
            check(name, 'toggle(name, true) forces it on', e.classList.toggle('on', true), true)
            check(name, 'toggle(name, true) again is idempotent', e.getAttribute('class'), 'on')
            e.classList.toggle('two')
            check(name, 'a second class is appended', e.getAttribute('class'), 'on two')
            check(name, 'the selector engine sees both', e.matches('.on.two'), true)
        }

        /* -- the innerHTML getter composes children; the setter does NOT parse - */
        {
            const e = el('div', null, el('span', null, 'hi'), text(' there'))
            check(name, 'innerHTML composes element children as markup', e.innerHTML, '<span>hi</span> there')
            check(name, 'a leaf element has empty innerHTML', el('div').innerHTML, '')
            const only = el('div', null, 'plain')
            check(name, 'a text-only element yields its text', only.innerHTML, 'plain')
        }
        {
            // Known gap: the setter stores the string verbatim in one text node rather
            // than parsing it -- SSR never needs to read markup back out as a tree.
            const e = el('div', null, el('b'), el('i'))
            check(name, 'the element starts with two element children', e.children.length, 2)
            Reflect.set(e, 'innerHTML', '<b>x</b>')
            check(name, 'the setter replaces every child with exactly one node', e.childNodes.length, 1)
            check(name, 'that node is a text node', e.childNodes[0].nodeType, 3)
            check(name, 'the markup is NOT parsed into elements', e.children.length, 0)
            check(name, 'the string round-trips through the getter', e.innerHTML, '<b>x</b>')
            Reflect.set(e, 'innerHTML', '')
            check(name, 'assigning an empty string still leaves one text node', e.childNodes.length, 1)
            check(name, 'and the getter reports an empty string', e.innerHTML, '')
        }

        /* -- outerHTML -------------------------------------------------------- */
        {
            check(name, 'an empty element renders open and close tags', el('div').outerHTML, '<div></div>')
            check(name, 'attributes are rendered in insertion order', el('div', { id: 'a', title: 'T' }).outerHTML, '<div id="a" title="T"></div>')
            check(name, 'attribute names are lower-cased in the output', el('div', { 'DATA-X': 'v' }).outerHTML, '<div data-x="v"></div>')
            check(name, 'children are rendered inside', el('div', null, el('span', null, 'hi')).outerHTML, '<div><span>hi</span></div>')
            check(name, 'a void tag self-closes', el('br').outerHTML, '<br />')
            check(name, 'a void tag with attributes self-closes too', el('img', { src: 's.png' }).outerHTML, '<img src="s.png" />')
            check(name, 'input is void as well', el('input', { type: 'text' }).outerHTML, '<input type="text" />')
            check(name, 'a non-void tag with the same shape is not self-closed', el('span').outerHTML, '<span></span>')
            check(name, 'the tag name is lower-cased in the output', (ssr.createElement('MyWidget') as any).outerHTML, '<mywidget></mywidget>')
        }

        /* -- cloneNode -------------------------------------------------------- */
        {
            const src = el('div', { id: 'src', class: 'k' }, el('span', null, 'child'))
            const shallow = src.cloneNode() as any
            check(name, 'a shallow clone is a different object', shallow === src, false)
            check(name, 'a shallow clone keeps the tag name', shallow.tagName, 'DIV')
            check(name, 'a shallow clone copies attributes', shallow.getAttribute('id'), 'src')
            check(name, 'a shallow clone copies className', shallow.className, 'k')
            check(name, 'a shallow clone has no children', shallow.childNodes.length, 0)
            check(name, 'a shallow clone has no parent', shallow.parentNode, null)
            shallow.setAttribute('id', 'other')
            check(name, 'mutating the clone does not touch the source', src.getAttribute('id'), 'src')

            const deep = src.cloneNode(true) as any
            check(name, 'a deep clone copies the children', deep.children.length, 1)
            check(name, 'the cloned child is a different object', deep.children[0] === src.children[0], false)
            check(name, 'the cloned child keeps its tag', deep.children[0].tagName, 'SPAN')
            check(name, 'the cloned child is re-parented to the clone', deep.children[0].parentNode, deep)
            check(name, 'the deep clone renders the same markup', deep.outerHTML, src.outerHTML)
        }

        /* -- append / before -------------------------------------------------- */
        {
            const root = el('div', null, el('i', { id: 'a' }))
            root.append(el('i', { id: 'b' }), el('i', { id: 'c' }))
            check(name, 'append() adds every node at the end', ids(root.children), 'a,b,c')
            root.firstElementChild.before(el('i', { id: 'z' }))
            check(name, 'before() inserts ahead of the node', ids(root.children), 'z,a,b,c')
            const orphan = el('i')
            orphan.before(el('b'))
            check(name, 'before() on a detached node is a no-op', orphan.childNodes.length, 0)
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR element API</h3><p>attributes, className, htmlFor, innerHTML, outerHTML, cloneNode</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrElement} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrElement)
