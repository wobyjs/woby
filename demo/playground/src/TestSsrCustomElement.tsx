import { ssr, customElement, wobyCustomElements, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'
import { check, checkFalse, checkTrue, el } from './ssrCheck'

const name = 'TestSsrCustomElement'

const TestSsrCustomElement = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h3>SSR custom elements</h3>
            <p>customElement() guard, dual registration, shadow root, slots</p>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// A fresh tag per expect() run, so a second run never collides with the first one's
// registration (both registries reject a re-define, in different ways).
let seq = 0

TestSsrCustomElement.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>customElement() guard, dual registration, shadow root, slots</p></div>'

        const ces: any = (ssr as any).customElements
        const n = ++seq
        const tag = `x-ssr-ce-${n}`
        const tag2 = `x-ssr-ce-b-${n}`
        const Hello = () => 'hello'
        const Bye = () => 'bye'

        // -- customElement() takes the SSR branch when HTMLElement is missing -------
        // The browser branch's first statement is `class extends HTMLElement`, so the
        // guard requires that global specifically. Deleting it here is what a half-shim
        // (window + document, no DOM constructors) looks like to the dispatcher, and it
        // makes this spec take the same branch under Node and under Chrome.
        const hadHTMLElement = typeof (globalThis as any).HTMLElement === 'function'
        const htmlElementDesc = Object.getOwnPropertyDescriptor(globalThis, 'HTMLElement')
        // Claim the native slots first (browser only) so the woby registry's native
        // define is skipped rather than handed a non-HTMLElement constructor.
        if ((globalThis as any).customElements && hadHTMLElement) {
            const Native = (globalThis as any).HTMLElement
            try { (globalThis as any).customElements.define(tag, class extends Native { }) } catch (e) { }
            try { (globalThis as any).customElements.define(tag2, class extends Native { }) } catch (e) { }
        }

        let Ctor: any
        let Ctor2: any
        let Ctor2b: any
        try {
            delete (globalThis as any).HTMLElement
            checkFalse(name, 'HTMLElement is absent while the guard is exercised', typeof (globalThis as any).HTMLElement === 'function')

            customElement(tag as any, Hello as any)
            Ctor = ces.get(tag)
            checkTrue(name, 'the SSR branch ran (the browser branch never touches ssr.customElements)', typeof Ctor === 'function')

            // the same tag twice: the woby registry keeps the first, the SSR mock takes the last
            customElement(tag2 as any, Hello as any)
            Ctor2 = ces.get(tag2)
            customElement(tag2 as any, Bye as any)
            Ctor2b = ces.get(tag2)
        } finally {
            if (htmlElementDesc) Object.defineProperty(globalThis, 'HTMLElement', htmlElementDesc)
        }
        check(name, 'HTMLElement is restored exactly as it was found', typeof (globalThis as any).HTMLElement === 'function', hadHTMLElement)

        // -- one define(), two registries ------------------------------------------
        check(name, 'ssr.customElements.get returns the generated class', typeof Ctor, 'function')
        check(name, 'wobyCustomElements.get returns the very same class', wobyCustomElements.get(tag), Ctor)
        checkTrue(name, 'wobyCustomElements.has knows the tag', wobyCustomElements.has(tag))
        check(name, 'getWithMeta reports it as woby-owned, not native', wobyCustomElements.getWithMeta(tag)?.isNative, false)
        check(name, 'getWithMeta hands back the same constructor', wobyCustomElements.getWithMeta(tag)?.ctor, Ctor)
        check(name, 'the class carries the component as a static', (Ctor as any).__component__, Hello)
        checkTrue(name, 'the class extends SSRCustomElement', Ctor.prototype instanceof (ssr as any).SSRCustomElement)
        check(name, 'ssr.customElements.get is undefined for an unknown tag', ces.get('x-never-defined'), undefined)
        checkFalse(name, 'wobyCustomElements.has is false for an unknown tag', wobyCustomElements.has('x-never-defined'))
        check(name, 'wobyCustomElements.get is undefined for an unknown tag', wobyCustomElements.get('x-never-defined'), undefined)
        check(name, 'getWithMeta is undefined for an unknown tag', wobyCustomElements.getWithMeta('x-never-defined'), undefined)
        checkTrue(name, 'ssr.customElements.whenDefined returns a thenable', typeof ces.whenDefined(tag)?.then === 'function')
        checkTrue(name, 'wobyCustomElements.whenDefined returns a thenable', typeof wobyCustomElements.whenDefined(tag)?.then === 'function')
        checkTrue(name, 'the registry singleton carries an id', typeof (wobyCustomElements as any).__registry_id__ === 'string')

        // -- re-defining the same tag ----------------------------------------------
        check(name, 'the SSR mock lets the last define win', ces.get(tag2), Ctor2b)
        checkFalse(name, 'and that is a different class from the first', Ctor2b === Ctor2)
        check(name, 'the woby registry keeps the FIRST definition', wobyCustomElements.get(tag2), Ctor2)
        check(name, 'the first class still carries the first component', (Ctor2 as any).__component__, Hello)
        check(name, 'the second class carries the second component', (Ctor2b as any).__component__, Bye)

        // -- instantiating the generated class -------------------------------------
        const props = { a: 1 }
        const inst: any = new Ctor(props)
        check(name, 'the instance tag name is upper-cased', inst.tagName, tag.toUpperCase())
        check(name, 'the instance is an element', inst.nodeType, 1)
        check(name, 'the props object is stored by reference', inst.props, props)
        check(name, 'light-DOM childNodes are cleared', inst.childNodes.length, 0)
        checkTrue(name, 'a shadow root is attached automatically', !!inst.shadowRoot)
        checkTrue(name, 'the shadow root is an SSRShadowRoot', inst.shadowRoot instanceof (ssr as any).SSRShadowRoot)
        check(name, 'the shadow root points back at its host', inst.shadowRoot.host, inst)
        check(name, 'the shadow root tag name is upper-cased too', inst.shadowRoot.tagName, '#SHADOW-ROOT')
        check(name, 'the component result lives in the shadow root', inst.shadowRoot.childNodes.length, 1)
        check(name, 'the shadow root holds the component output', inst.shadowRoot.childNodes[0], 'hello')
        check(name, 'outerHTML renders the shadow content inside the host tag', inst.outerHTML, '<' + tag + '>hello</' + tag + '>')
        check(name, 'the shadow root serialises its children on its own', inst.shadowRoot.outerHTML, 'hello')
        checkFalse(name, 'two instances do not share a shadow root', new Ctor({}).shadowRoot === inst.shadowRoot)

        // -- attributes on the host ------------------------------------------------
        {
            const withAttrs: any = new Ctor({})
            withAttrs.setAttribute('data-Foo', 'bar')
            withAttrs.setAttribute('symbol', 'internal')
            check(name, 'the symbol attribute is stored', withAttrs.attributes['symbol'], 'internal')
            check(name, 'attribute names are lower-cased and symbol is hidden', withAttrs.outerHTML, '<' + tag + ' data-foo="bar">hello</' + tag + '>')
            withAttrs.removeAttribute('data-Foo')
            check(name, 'removing the only visible attribute drops the attribute list', withAttrs.outerHTML, '<' + tag + '>hello</' + tag + '>')
        }

        // -- SSRCustomElement used directly, with no component attached ------------
        {
            const CE: any = (ssr as any).SSRCustomElement
            const bare: any = new CE('bare-el')
            check(name, 'a bare custom element upper-cases its tag', bare.tagName, 'BARE-EL')
            check(name, 'props default to an empty object', JSON.stringify(bare.props), '{}')
            check(name, 'it has no shadow root until one is attached', bare.shadowRoot, null)
            check(name, 'slots start empty', bare.slots.length, 0)
            check(name, 'with no component and no children it renders empty', bare.outerHTML, '<bare-el></bare-el>')

            const kid = el('b', null, 'k')
            const withKid: any = new CE('bare-el2', { children: kid })
            check(name, 'a single children prop becomes one child node', withKid.childNodes.length, 1)
            check(name, 'the light-DOM child is rendered', withKid.outerHTML, '<bare-el2><b>k</b></bare-el2>')

            const withKids: any = new CE('bare-el3', { children: [el('b', null, 'x'), el('i', null, 'y')] })
            check(name, 'an array children prop is kept as is', withKids.childNodes.length, 2)
            check(name, 'every light-DOM child is rendered in order', withKids.outerHTML, '<bare-el3><b>x</b><i>y</i></bare-el3>')

            const attached: any = new CE('bare-el4')
            const sr = attached.attachShadow({ mode: 'open' })
            check(name, 'attachShadow returns the shadow root', sr, attached.shadowRoot)
            check(name, 'an empty shadow root does not suppress light DOM', attached.outerHTML, '<bare-el4></bare-el4>')
            sr.childNodes.push(el('span', null, 's'))
            check(name, 'a populated shadow root replaces the light DOM in outerHTML', attached.outerHTML, '<bare-el4><span>s</span></bare-el4>')
        }

        // -- SSRShadowRoot on its own ----------------------------------------------
        {
            const CE: any = (ssr as any).SSRCustomElement
            const SR: any = (ssr as any).SSRShadowRoot
            const host: any = new CE('host-el')
            const root: any = new SR(host)
            check(name, 'a shadow root is an element node', root.nodeType, 1)
            check(name, 'a shadow root keeps its host', root.host, host)
            check(name, 'an empty shadow root serialises to nothing', root.outerHTML, '')
            root.childNodes.push(el('p', null, 'a'))
            root.childNodes.push(el('p', null, 'b'))
            check(name, 'a shadow root concatenates its children', root.outerHTML, '<p>a</p><p>b</p>')
            checkFalse(name, 'attaching a shadow root by hand does not link the host', host.shadowRoot === root)
        }

        // -- SSRSlotElement --------------------------------------------------------
        {
            const Slot: any = (ssr as any).SSRSlotElement
            const slot: any = new Slot()
            check(name, 'a slot upper-cases its tag like any element', slot.tagName, 'SLOT')
            check(name, 'a slot starts with no assigned nodes', slot.assignedNodes.length, 0)
            check(name, 'an empty slot renders as an empty slot tag', slot.outerHTML, '<slot></slot>')
            slot.setAttribute('name', 'header')
            check(name, 'a named slot carries its name attribute', slot.outerHTML, '<slot name="header"></slot>')
            slot.assignedNodes.push(el('p', null, 'hi'))
            check(name, 'assigned nodes are rendered as slot content', slot.outerHTML, '<slot name="header"><p>hi</p></slot>')
            slot.assignedNodes.push(el('span', null, 'more'))
            check(name, 'every assigned node is rendered in order', slot.outerHTML, '<slot name="header"><p>hi</p><span>more</span></slot>')
            checkFalse(name, 'assignedNodes are not childNodes', slot.childNodes.length > 0)

            const inShadow: any = new (ssr as any).SSRCustomElement('slotted-el')
            const sr = inShadow.attachShadow({ mode: 'open' })
            sr.childNodes.push(slot)
            check(name, 'a SLOT inside a shadow root is rendered via its own outerHTML', inShadow.outerHTML, '<slotted-el><slot name="header"><p>hi</p><span>more</span></slot></slotted-el>')
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>SSR custom elements</h3><p>customElement() guard, dual registration, shadow root, slots</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestSsrCustomElement} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestSsrCustomElement)
