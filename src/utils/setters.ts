import { DIRECTIVES, SYMBOLS_DIRECTIVES, SYMBOL_DOM, /* SYMBOL_DOM, */ SYMBOL_UNCACHED, isSSR } from '../constants'
import { useMicrotask } from '../hooks/use_microtask'
import { useRenderEffect } from '../hooks/use_render_effect'
import { isStore } from '../methods/soby'
import { $$, isObservable } from '../methods/soby'
import { store } from '../methods/soby'
import { untrack } from '../methods/soby'
import { context, with as _with, batch, Observable, SYMBOL_OBSERVABLE_WRITABLE } from '../soby'
import { SYMBOL_STORE_OBSERVABLE } from '../soby'
import { classesToggle } from '../utils/classlist'
import { Env, getEnv } from '../utils/creators'

import { diff } from '../utils/diff'
import { FragmentUtils } from '../utils/fragment'
import { castArray, flatten, isArray, isBoolean, isFunction, isFunctionReactive, isNil, isObject, isString, isSVG, isTemplateAccessor, isVoidChild } from '../utils/lang'
import { resolveChild, resolveClass, resolveStyle } from '../utils/resolvers'
import { setNestedAttribute } from '../utils/nested'
import type { Child, Classes, DirectiveData, EventListener, Fragment, FunctionMaybe, ObservableMaybe, Ref, TemplateActionProxy } from '../types'
import { Stack } from '../soby'

export const setRef = <T>(element: T, value: null | undefined | Ref<T> | (null | undefined | Ref<T>)[]): void => { // Scheduling a microtask to dramatically increase the probability that the element will get connected to the DOM in the meantime, which would be more convenient

    if (isNil(value)) return

    const values = flatten(castArray(value)).filter(Boolean)

    if (!values.length) return

    const stack = new Stack()
    useMicrotask(() => untrack(() => values.forEach(value => value?.(element))), stack)

}

export const getSetters = (env?: Env) => {
    const { createText, createComment, Comment, Text } = getEnv(env)

    const setAttributeStatic = (() => {

        const attributesBoolean = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'disabled', 'formnovalidate', 'hidden', 'indeterminate', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'seamless', 'selected'])
        const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/ //URL: https://regex101.com/r/I8Wm4S/1
        const attributesCache: Record<string, string> = {}
        const uppercaseRe = /[A-Z]/g

        const normalizeKeySvg = (key: string): string => {

            return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, char => `-${char.toLowerCase()}`))

        }

        return (element: HTMLElement, key: string, value: null | undefined | boolean | number | string): void => {
            // Handle nested properties with "." or "$" syntax
            if (key.includes('.') || key.includes('$')) {
                setNestedAttribute(element, key, value)
                return
            }

            if (isSVG(element)) {

                key = (key === 'xlinkHref' || key === 'xlink:href') ? 'href' : normalizeKeySvg(key)

                if (isNil(value) || (value === false && attributesBoolean.has(key))) {

                    element.removeAttribute(key)

                } else {

                    element.setAttribute(key, String(value))

                }

            } else {

                if (isNil(value) || (value === false && attributesBoolean.has(key))) {

                    element.removeAttribute(key)

                } else {

                    value = (value === true) ? '' : String(value)

                    element.setAttribute(key, value)

                }

            }

        }

    })()

    const setAttribute = (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>, stack: Stack): void => {

        if (isFunction(value) && isFunctionReactive(value))
            if (isObservable(value) && value[SYMBOL_OBSERVABLE_WRITABLE]?.options?.toHtml) {
                useRenderEffect((options) => {
                    const unwrappedValue = value()
                    const opts = value[SYMBOL_OBSERVABLE_WRITABLE].options
                    const htmlValue = opts.toHtml(unwrappedValue)
                    setAttributeStatic(element, key, htmlValue)
                }, env, stack)
            } else {
                useRenderEffect((options) => {
                    setAttributeStatic(element, key, value())
                }, env, stack)
            }
        else
            setAttributeStatic(element, key, $$(value))
    }

    const setChildReplacementFunction = (parent: HTMLElement | Node, fragment: Fragment, child: (() => Child), stack: Stack): void => {

        useRenderEffect((options) => {

            let valueNext = child()

            while (isFunction(valueNext)) {

                valueNext = valueNext()

            }

            setChildStatic(parent, fragment, false, /* child[SYMBOL_DOM] = valueNext */ null, true, child, stack)

        }, env, stack)

    }

    const setChildReplacementText = (child: string, childPrev: Node): Node => {

        if (childPrev.nodeType === 3) {

            childPrev.nodeValue = child

            return childPrev

        } else {

            const parent = childPrev.parentElement

            if (!parent) throw new Error('Invalid child replacement')

            const textNode = createText(child)

            parent.replaceChild(textNode as any, childPrev)

            return textNode as any

        }

    }

    const setChildReplacement = (child: Child, childPrev: Node, stack: Stack): void => {

        const type = typeof child

        if (type === 'string' || type === 'number' || type === 'bigint') {

            setChildReplacementText(String(child), childPrev)

        } else {

            const parent = childPrev.parentElement ?? childPrev.parentNode

            if (!parent) throw new Error('Invalid child replacement')

            const fragment = FragmentUtils.makeWithNode(childPrev)

            if (type === 'function') {

                setChildReplacementFunction(parent, fragment, child as (() => Child), stack) //TSC

            } else {

                setChild(parent, child, fragment, stack)

            }

        }

    }

    /**
     * Sets child nodes on a parent element with static (non-reactive) values.
     * 
     * This function efficiently updates the DOM by comparing the current children (in the fragment)
     * with the new children and applying the minimal set of DOM operations needed.
     * 
     * The function handles several optimization cases:
     * 1. Fast path for appending a node the first time
     * 2. Fast path for single text child replacement
     * 3. Fast path for removing all children or replacing placeholders
     * 4. General diffing algorithm for complex changes
     * 
     * @param parent - The parent DOM element to update
     * @param fragment - A fragment representing the current children state
     * @param fragmentOnly - Whether to only update the fragment without touching the actual DOM
     * @param child - The new child or children to set
     * @param dynamic - Whether the child is dynamic (reactive) or static
     * @param stack - The stack trace for debugging purposes
     * 
     * @example
     * ```ts
     * // Set a simple text child
     * setChildStatic(parent, fragment, false, "Hello World", false, stack)
     * 
     * // Set multiple children
     * setChildStatic(parent, fragment, false, [node1, node2, "text"], false, stack)
     * 
     * // Set a function child (will be resolved)
     * setChildStatic(parent, fragment, false, () => "Dynamic content", true, stack)
     * ```
     */
    const setChildStatic = (parent: HTMLElement | Node, fragment: Fragment, fragmentOnly: boolean, child: Child, dynamic: boolean, childComp: Function, stack: Stack): void => {
        // Generate unique ID for this call
        const callId = Math.random().toString(36).substr(2, 9)
        console.log(`=== SET_CHILD_STATIC CALLED (${callId}) ===`)
        console.log('Child:', child)
        console.log('Dynamic:', dynamic)
        console.log('Child type:', typeof child)
        console.log('Parent nodeType:', parent?.nodeType)

        if (Array.isArray(child)) {
            console.log('Child is array, length:', child.length)
            child.forEach((c, i) => {
                console.log(`Child[${i}]:`, c)
                console.log(`  nodeType:`, (c as any)?.nodeType)
                console.log(`  textContent:`, (c as any)?.textContent)
            })
        }

        // Handle placeholder creation for reactive content in SSR
        if (dynamic && env === 'ssr') {
            console.log('Creating placeholder for reactive SSR content')
            const placeholder = FragmentUtils.makePlaceholder('ssr')

            if (!fragmentOnly) {
                parent.appendChild(placeholder)
            }

            FragmentUtils.replaceWithNode(fragment, placeholder)

            // Store placeholder reference for later replacement
            if (childComp) {
                childComp[SYMBOL_DOM] = placeholder
                console.log('Stored placeholder in childComp SYMBOL_DOM')
            }

            // Set up effect to replace placeholder when content is ready
            useRenderEffect((options) => {
                console.log('Reactive effect triggered, resolving child:', child)
                resolveChild(child, (resolvedChild, isDynamic, stack) => {
                    console.log('Resolved child for replacement:', resolvedChild)
                    // Replace the placeholder with actual content
                    FragmentUtils.replacePlaceholder(placeholder, resolvedChild as Node, childComp)
                }, true, stack, 'ssr')
            }, 'ssr', stack)

            return
        }

        if (!dynamic && isVoidChild(child)) return // Ignoring static undefined children, avoiding inserting some useless placeholder nodes

        if (childComp) {
            const e = childComp[SYMBOL_DOM] as HTMLElement
            if (e) {

                console.log('Element e properties and methods:', {
                    element: e,
                    properties: Object.getOwnPropertyNames(e),
                    methods: Object.getOwnPropertyNames(Object.getPrototypeOf(e)),
                    nodeType: e.nodeType,
                    nodeName: e.nodeName,
                    parentNode: e.parentNode,
                    parentElement: e.parentElement,
                    nextSibling: e.nextSibling,
                    previousSibling: e.previousSibling
                })
                e.replaceWith(child as any)

                childComp[SYMBOL_DOM] = child
                return
            }
        }

        // Debug fragment children retrieval
        console.log('Getting children from fragment...')
        const prev = FragmentUtils.getChildren(fragment)
        console.log('Fragment children result:', prev)
        console.log('Fragment children type:', typeof prev)
        if (Array.isArray(prev)) {
            prev.forEach((child, i) => {
                console.log(`Fragment child[${i}]:`, child)
                console.log(`  nodeType:`, (child as any)?.nodeType)
                console.log(`  textContent:`, (child as any)?.textContent)
            })
        } else if (prev) {
            console.log('Single fragment child:', prev)
            console.log('  nodeType:', (prev as any)?.nodeType)
            console.log('  textContent:', (prev as any)?.textContent)
        }

        const prevIsArray = (prev instanceof Array)
        const prevLength = prevIsArray ? prev.length : 1
        const prevFirst = prevIsArray ? prev[0] : prev
        const prevLast = prevIsArray ? prev[prevLength - 1] : prev
        const prevSibling = prevLast?.nextSibling || null

        console.log('prevIsArray:', prevIsArray)
        console.log('prevLength:', prevLength)
        console.log('prevFirst nodeType:', (prevFirst as any)?.nodeType)

        if (prevLength === 0) { // Fast path for appending a node the first time

            const type = typeof child

            if (type === 'string' || type === 'number' || type === 'bigint') {

                const textNode = createText(child as any)

                if (!fragmentOnly) {

                    parent.appendChild(textNode as any)

                }

                FragmentUtils.replaceWithNode(fragment, textNode)

                return

            } else if (type === 'object' && child !== null && typeof (child as Node).nodeType === 'number') { //TSC
                console.log('=== FAST PATH ARRAY LOOP (prevLength === 0) ===')
                console.log('Original child in fast path:', child)
                console.log('Child nodeType:', (child as Node).nodeType)
                console.log('Child textContent:', (child as any).textContent)
                console.log('Child objectId:', (child as any).objectId)
                console.log('Child constructor:', child?.constructor?.name)

                // Check if this is our problematic TextNode conversion
                if ((child as Node).nodeType === 1 && (child as any).textContent === '') {
                    console.log('🚨 CRITICAL: TextNode converted in fast path!')
                    console.log('This should be nodeType: 3 with textContent: "Custom element"')
                }

                console.log('Parent before insert:', parent.childNodes?.length)

                const node = child as Node
                console.log('Node to insert:', node)
                console.log('  Node nodeType:', node?.nodeType)
                console.log('  Node textContent:', node?.textContent)
                console.log('  Node objectId:', (node as any)?.objectId)
                console.log('  Parent before insertion:', parent.childNodes?.length)

                if (!fragmentOnly) {
                    console.log('Performing insert...')
                    parent.insertBefore(node, null)
                    console.log('Insert completed')
                }
                console.log('  Parent after insertion:', parent.childNodes?.length)
                const insertedChild = parent.childNodes?.[parent.childNodes?.length - 1]
                console.log('  Last child after insertion:', insertedChild)
                console.log('  Inserted child nodeType:', insertedChild?.nodeType)
                console.log('  Inserted child textContent:', (insertedChild as any)?.textContent)
                console.log('Parent after insert:', parent.childNodes?.length)
                console.log('Inserted node:', insertedChild)

                FragmentUtils.replaceWithNode(fragment, node)

                return

            }

        }

        if (prevLength === 1) { // Fast path for single text child

            const type = typeof child

            if (type === 'string' || type === 'number' || type === 'bigint') {

                const node = setChildReplacementText(String(child), prevFirst) //TODO: maybe "fragmentOnly" should be passed on here, but it seems unnecessary

                FragmentUtils.replaceWithNode(fragment, node)

                return

            }

        }

        const fragmentNext = FragmentUtils.make()
        console.log(`Created fragmentNext (${callId}):`, fragmentNext)

        const children = (isArray(child) ? child : [child]) as Node[] //TSC
        console.log('Array processing - children array:', children)
        console.log('Children array length:', children.length)

        // Deep clone children array to prevent mutation issues
        const clonedChildren = [...children]
        console.log('Cloned children array:', clonedChildren)

        for (let i = 0, l = clonedChildren.length; i < l; i++) {
            console.log(`Processing child[${i}]:`, clonedChildren[i])
            console.log(`  Before assignment - clonedChildren[${i}] nodeType:`, (clonedChildren[i] as any)?.nodeType)
            console.log(`  Before assignment - clonedChildren[${i}] textContent:`, (clonedChildren[i] as any)?.textContent)

            const child = clonedChildren[i]
            console.log(`  After assignment - child nodeType:`, (child as any)?.nodeType)
            console.log(`  After assignment - child textContent:`, (child as any)?.textContent)
            const type = typeof child

            if (type === 'string' || type === 'number' || type === 'bigint') {

                const textNode = createText(child as any) as any
                console.log('Creating text node in loop:', textNode)
                console.log('Text node nodeType:', textNode?.nodeType)
                console.log('Text node textContent:', textNode?.textContent)
                FragmentUtils.pushNode(fragmentNext, textNode)
                // parent.appendChild(textNode)

            } else if (type === 'object' && child !== null && typeof child.nodeType === 'number') {

                console.log('=== ARRAY LOOP OBJECT PROCESSING ===')
                console.log('Original child object:', child)
                console.log('Child nodeType:', child?.nodeType)
                console.log('Child textContent:', (child as any)?.textContent)
                console.log('Child objectId:', (child as any)?.objectId)
                console.log('Child constructor name:', child?.constructor?.name)

                // Check if this is our TextNode that got converted
                if (child?.nodeType === 1 && (child as any)?.textContent === '') {
                    console.log('⚠️  WARNING: TextNode converted to Element!')
                    console.log('Expected nodeType: 3, got:', child?.nodeType)
                    console.log('Expected textContent: "Custom element", got:', (child as any)?.textContent)
                }

                console.log('Pushing existing child node:', child)
                console.log('fragmentNext before push:', fragmentNext)
                console.log('fragmentNext.length before push:', fragmentNext.length)
                FragmentUtils.pushNode(fragmentNext, child)
                console.log('fragmentNext after push:', fragmentNext)
                console.log('fragmentNext.length after push:', fragmentNext.length)
                // parent.appendChild(child as any)

            } else if (type === 'function') {

                const fragment = FragmentUtils.make()

                // const n = parent.appendChild(createComment('') as any)

                // let childFragmentOnly = !fragmentOnly // Avoiding mutating the DOM immediately, letting the parent handle it

                FragmentUtils.pushFragment(fragmentNext, fragment)

                // parent.appendChild(fragment)

                resolveChild(child, (child, dynamic, stack) => {
                    // const fragmentOnly = childFragmentOnly
                
                    // n.replaceWith(child)
                
                    // const e = children[i][SYMBOL_DOM]
                    // parent.replaceChild(child, n)
                
                    // children[i][SYMBOL_DOM] = child
                    // parent.replaceChild(child, children[i])
                    setChildStatic(parent, fragment, true, child, dynamic, clonedChildren[i] as any, stack)
                
                }, false, stack, env)

            }

        }

        console.log(`=== BEFORE GETTING CHILDREN FROM FRAGMENT_NEXT (${callId}) ===`)
        console.log('fragmentNext:', fragmentNext)
        console.log('fragmentNext.length:', fragmentNext.length)
        console.log('fragmentNext.values:', fragmentNext.values)

        console.log(`=== GETTING CHILDREN FROM FRAGMENT_NEXT (${callId}) ===`)
        let next = FragmentUtils.getChildren(fragmentNext)
        console.log('Got next from fragmentNext:', next)
        console.log('next type:', typeof next)
        console.log('Array.isArray(next):', Array.isArray(next))
        console.log('next instanceof Array:', next instanceof Array)

        if (Array.isArray(next)) {
            console.log('next array length:', next.length)
            next.forEach((child, i) => {
                console.log(`next[${i}]:`, child)
                console.log(`  nodeType:`, (child as any)?.nodeType)
                console.log(`  textContent:`, (child as any)?.textContent)
                console.log(`  objectId:`, (child as any)?.objectId)
                console.log(`  constructor:`, child?.constructor?.name)
            })
        } else if (next) {
            console.log('Single next:', next)
            console.log('  nodeType:', (next as any)?.nodeType)
            console.log('  textContent:', (next as any)?.textContent)
            console.log('  objectId:', (next as any)?.objectId)
            console.log('  constructor:', next?.constructor?.name)
        }
        let nextLength = fragmentNext.length
        console.log('=== CALCULATING nextLength ===')
        console.log('fragmentNext.length:', fragmentNext.length)
        console.log('Assigned nextLength:', nextLength)
        console.log('fragmentNext at this point:', fragmentNext)
        console.log('fragmentNext.values:', fragmentNext.values)
        console.log('fragmentNext.length (again):', fragmentNext.length)

        if (nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8) { // It's a placeholder already, no need to replace it

            return

        }

        if (!fragmentOnly && (nextLength === 0 || (prevLength === 1 && prevFirst.nodeType === 8) || children[SYMBOL_UNCACHED])) { // Fast path for removing all children and/or replacing the placeholder

            const { childNodes } = parent

            if (childNodes.length === prevLength) { // Maybe this fragment doesn't handle all children but only a range of them, checking for that here

                parent.textContent = ''

                if (nextLength === 0) { // Placeholder, to keep the right spot in the array of children

                    const placeholder = /* childComp[SYMBOL_DOM] = */ createComment('')

                    FragmentUtils.pushNode(fragmentNext, placeholder as any)

                    if (next !== fragmentNext.values) {

                        next = placeholder as any
                        nextLength += 1

                    }

                }

                if (prevSibling) {

                    if (next instanceof Array) {

                        prevSibling.before.apply(prevSibling, next)

                    } else {

                        parent.insertBefore(next, prevSibling)

                    }

                } else {

                    console.log('=== FAST PATH INSERTION ===')
                    console.log('next:', next)
                    console.log('next type:', typeof next)
                    console.log('Array.isArray(next):', Array.isArray(next))
                    console.log('next instanceof Array:', next instanceof Array)

                    if (next instanceof Array) {
                        console.log('Inserting array of nodes, length:', next.length)
                        next.forEach((node, i) => {
                            console.log(`Inserting node[${i}]:`, node)
                            console.log(`  nodeType:`, (node as any)?.nodeType)
                            console.log(`  textContent:`, (node as any)?.textContent)
                            console.log(`  objectId:`, (node as any)?.objectId)
                            console.log(`  constructor:`, node?.constructor?.name)
                        })
                        // parent.append.apply(parent, next)
                        for (const node of next) parent.appendChild(node)

                    } else {
                        console.log('Inserting single node:', next)
                        console.log('  nodeType:', (next as any)?.nodeType)
                        console.log('  textContent:', (next as any)?.textContent)
                        console.log('  objectId:', (next as any)?.objectId)
                        console.log('  constructor:', next?.constructor?.name)
                        parent.appendChild(next)

                    }

                }

                FragmentUtils.replaceWithFragment(fragment, fragmentNext)

                return

            }

        }

        if (nextLength === 0) { // Placeholder, to keep the right spot in the array of children

            const placeholder = /* childComp[SYMBOL_DOM] = */ createComment('')

            FragmentUtils.pushNode(fragmentNext, placeholder as any)

            if (next !== fragmentNext.values) {

                next = placeholder as any
                nextLength += 1

            }

        }

        if (!fragmentOnly) {

            diff(parent, prev, next, prevSibling, env)

        }

        FragmentUtils.replaceWithFragment(fragment, fragmentNext)

    }

    const setChild = (parent: HTMLElement | Node, child: Child, fragment: Fragment = FragmentUtils.make(), stack: Stack): void => {
        const cd = child
        console.log('setChild called with child:', child)
        resolveChild(cd, (child, dynamic, stack) => {
            console.log('Setter function called with child:', child)
            console.log('Child type:', typeof child)
            if (Array.isArray(child)) {
                child.forEach((c, i) => {
                    console.log(`Child[${i}]:`, c)
                    console.log(`  nodeType:`, (c as any)?.nodeType)
                    console.log(`  textContent:`, (c as any)?.textContent)
                })
            }
            setChildStatic(parent, fragment, false, child, dynamic, /* cd as any */null, stack)
        }, false, stack, env)
    }

    const setClassStatic = classesToggle

    const setClass = (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean>, stack: Stack): void => {

        if (isFunction(value) && isFunctionReactive(value)) {

            useRenderEffect((options) => {

                setClassStatic(element, key, value())

            }, env, stack)

        } else {

            setClassStatic(element, key, $$(value))

        }

    }

    const setClassBooleanStatic = (element: HTMLElement, value: boolean, key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string): void => {

        if (keyPrev && keyPrev !== true) {

            setClassStatic(element, keyPrev, false)

        }

        if (key && key !== true) {

            setClassStatic(element, key, value)

        }

    }

    const setClassBoolean = (element: HTMLElement, value: boolean, key: FunctionMaybe<null | undefined | boolean | string>, stack: Stack): void => {

        if (isFunction(key) && isFunctionReactive(key)) {

            let keyPrev: null | undefined | boolean | string

            useRenderEffect((options) => {

                const keyNext = key()

                setClassBooleanStatic(element, value, keyNext, keyPrev)

                keyPrev = keyNext

            }, env, stack)

        } else {

            setClassBooleanStatic(element, value, $$(key))

        }

    }

    const setClassesStatic = (element: HTMLElement, object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, stack: Stack): void => {

        if (isString(object)) {

            if (isSVG(element)) {

                element.setAttribute('class', object)

            } else {

                element.className = object

            }

        } else {

            if (objectPrev) {

                if (isString(objectPrev)) {

                    if (objectPrev) {

                        if (isSVG(element)) {

                            element.setAttribute('class', '')

                        } else {

                            element.className = ''

                        }

                    }

                } else if (isArray(objectPrev)) {

                    objectPrev = store.unwrap(objectPrev)

                    for (let i = 0, l = objectPrev.length; i < l; i++) {

                        if (!objectPrev[i]) continue

                        setClassBoolean(element, false, objectPrev[i], stack)

                    }

                } else {

                    objectPrev = store.unwrap(objectPrev)

                    for (const key in objectPrev) {

                        if (object && key in object) continue

                        setClass(element, key, false, stack)

                    }

                }

            }

            if (isArray(object)) {

                if (isStore(object)) {

                    for (let i = 0, l = object.length; i < l; i++) {

                        const fn = untrack(() => isFunction(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i))) as (() => string | boolean | null | undefined) //TSC

                        setClassBoolean(element, true, fn, stack)

                    }

                } else {
                    //@ts-ignore
                    for (let i = 0, l = object.length; i < l; i++) {

                        if (!object[i]) continue

                        setClassBoolean(element, true, object[i], stack)

                    }

                }

            } else {

                if (isStore(object)) {

                    for (const key in object) {

                        const fn = untrack(() => isFunction(object[key]) ? object[key] : (object as any)[SYMBOL_STORE_OBSERVABLE](key)) as (() => boolean | null | undefined) //TSC

                        setClass(element, key, fn, stack)

                    }

                } else {
                    //@ts-ignore
                    for (const key in object) {

                        setClass(element, key, object[key], stack)

                    }

                }

            }

        }

    }

    const setClasses = (element: HTMLElement, object: Classes, stack: Stack): void => {

        if (isFunction(object) || isArray(object)) {

            let objectPrev: Record<string, boolean> | undefined

            useRenderEffect((options) => {

                const objectNext = resolveClass(object)

                setClassesStatic(element, objectNext, objectPrev, stack)

                objectPrev = objectNext

            }, env, stack)

        } else {

            setClassesStatic(element, object, null, stack)

        }

    }

    const setDirective = <T extends unknown[]>(element: HTMLElement, directive: string, args: T): void => {

        const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol()
        const data = context<DirectiveData<T>>(symbol) || DIRECTIVES[symbol]

        if (!data) throw new Error(`Directive "${directive}" not found`)

        const call = () => data.fn(element, ...castArray(args) as any) //TSC

        const stack = new Error()

        if (data.immediate) {

            call()

        } else {

            useMicrotask(call, stack)

        }

    }

    const setEventStatic = (() => {

        // Expanded event delegation for better memory efficiency
        // Added more events: mouse events, pointer events, and touch events for improved performance
        // TODO: Implement proper cleanup mechanism for event delegation
        const delegatedEvents = <const>{
            // onauxclick: ['_onauxclick', false],
            // onbeforeinput: ['_onbeforeinput', false],
            // onclick: ['_onclick', false],
            // ondblclick: ['_ondblclick', false],
            // onfocusin: ['_onfocusin', false],
            // onfocusout: ['_onfocusout', false],
            // oninput: ['_oninput', false],
            // onkeydown: ['_onkeydown', false],
            // onkeyup: ['_onkeyup', false],
            // onmousedown: ['_onmousedown', false],
            // onmouseenter: ['_onmouseenter', false],
            // onmouseleave: ['_onmouseleave', false],
            // onmousemove: ['_onmousemove', false],
            // onmouseout: ['_onmouseout', false],
            // onmouseover: ['_onmouseover', false],
            // onmouseup: ['_onmouseup', false],
            // onpointerdown: ['_onpointerdown', false],
            // onpointermove: ['_onpointermove', false],
            // onpointerout: ['_onpointerout', false],
            // onpointerover: ['_onpointerover', false],
            // onpointerup: ['_onpointerup', false],
            // ontouchend: ['_ontouchend', false],
            // ontouchmove: ['_ontouchmove', false],
            // ontouchstart: ['_ontouchstart', false]
        }

        const delegate = (event: string): void => {

            const key = `_${event}`

            document.addEventListener(event.slice(2), event => {

                const targets = event.composedPath()
                let target: EventTarget | null = null

                Object.defineProperty(event, 'currentTarget', {
                    configurable: true,
                    get() {
                        return target
                    }
                })

                for (let i = 0, l = targets.length; i < l; i++) {

                    target = targets[i]
                    const handler = target[key]

                    if (!handler) continue

                    handler(event)

                    if (event.cancelBubble) break

                }

                target = null

            })

        }

        return (element: HTMLElement, event: string, value: null | undefined | EventListener): void => {

            if (event.startsWith('onmiddleclick')) { // Special-cased synthetic event, somewhat ugly but very convenient

                const _value = value

                event = `onauxclick${event.slice(13)}`
                value = _value && ((event: Event) => event['button'] === 1 && _value(event))

            }

            const delegated = delegatedEvents[event]

            if (delegated) {

                if (!delegated[1]) { // Not actually delegating yet

                    delegated[1] = true

                    delegate(event)

                }

                element[delegated[0]] = value

            } else if (event.endsWith('passive')) {

                const isCapture = event.endsWith('capturepassive')
                const type = event.slice(2, -7 - (isCapture ? 7 : 0))
                const key = `_${event}`

                const valuePrev = element[key]

                if (valuePrev) element.removeEventListener(type, valuePrev, { capture: isCapture })

                if (value) element.addEventListener(type, value, { passive: true, capture: isCapture })

                element[key] = value

            } else if (event.endsWith('capture')) {

                const type = event.slice(2, -7)
                const key = `_${event}`

                const valuePrev = element[key]

                if (valuePrev) element.removeEventListener(type, valuePrev, { capture: true })

                if (value) element.addEventListener(type, value, { capture: true })

                element[key] = value

            } else {

                element[event] = value

            }

        }

    })()

    const setEvent = (element: HTMLElement, event: string, value: ObservableMaybe<null | undefined | EventListener>): void => {

        setEventStatic(element, event, value)

    }

    const setHTMLStatic = (element: HTMLElement, value: null | undefined | number | string): void => {

        element.innerHTML = String(isNil(value) ? '' : value)

    }

    const setHTML = (element: HTMLElement, value: FunctionMaybe<{ __html: FunctionMaybe<null | undefined | number | string> }>, stack: Stack): void => {

        useRenderEffect((options) => {

            setHTMLStatic(element, $$($$(value).__html))

        }, env, stack)

    }

    const setPropertyStatic = (element: HTMLElement | Comment, key: string, value: null | undefined | boolean | number | string): void => {
        const isComment = (element instanceof Comment)

        if (key === 'tabIndex' && isBoolean(value)) {

            value = value ? 0 : undefined

        }

        if (key === 'value' && !isComment) {

            if ((element as HTMLElement)?.tagName === 'PROGRESS') {

                value ??= null

            } else if ((element as HTMLElement)?.tagName === 'SELECT' && !element['_$inited']) {

                element['_$inited'] = true

                queueMicrotask(() => element[key] = value)

            }

        }

        try { // Trying setting the property

            element[key] = value

            if (isNil(value) && !isComment) {

                setAttributeStatic(element as any, key, null)

            }

        } catch { // If it fails, maybe because like HTMLInputElement.form there's only a getter, we try as an attribute instead //TODO: Figure out something better than this

            if (!isComment)
                setAttributeStatic(element as any, key, value)

        }

    }

    const setProperty = (element: HTMLElement | Comment, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>, stack: Stack): void => {

        if (isFunction(value) && isFunctionReactive(value)) {

            useRenderEffect((options) => {

                setPropertyStatic(element, key, value())

            }, env, stack)

        } else {

            setPropertyStatic(element, key, $$(value))

        }

    }


    const setStyleStatic = (() => {

        // From Preact: https://github.com/preactjs/preact/blob/e703a62b77c9de45e886d8a7f59bd0db658318f9/src/constants.js#L3
        // const propertyNonDimensionalRe = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
        // From this Preact issue: https://github.com/preactjs/preact/issues/2607
        const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i
        const propertyNonDimensionalCache: Partial<Record<string, boolean>> = {}

        return (element: HTMLElement, key: string, value: null | undefined | number | string): void => {

            if (key.charCodeAt(0) === 45) { // /^-/

                if (isNil(value)) {

                    element.style.removeProperty(key)

                } else {

                    element.style.setProperty(key, String(value))

                }

            } else if (isNil(value)) {

                element.style[key] = null

            } else {

                element.style[key] = (isString(value) || isObject(value) || (propertyNonDimensionalCache[key] ||= propertyNonDimensionalRe.test(key)) ? value : `${value}px`)

            }

        }

    })()

    const setStyle = (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | number | string>, stack: Stack): void => {

        if (isFunction(value) && isFunctionReactive(value)) {

            useRenderEffect((options) => {

                setStyleStatic(element, key, value())

            }, env, stack)

        } else {

            setStyleStatic(element, key, $$(value))

        }

    }

    const setStylesStatic = (element: HTMLElement, object: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, objectPrev: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, stack: Stack): void => {

        if (isString(object)) {

            element.setAttribute('style', object)

        } else {

            if (objectPrev) {

                if (isString(objectPrev)) {

                    if (objectPrev) {

                        element.style.cssText = ''

                    }

                } else {

                    objectPrev = store.unwrap(objectPrev)

                    for (const key in objectPrev) {

                        if (object && key in object) continue

                        setStyleStatic(element, key, null)

                    }

                }

            }

            if (isStore(object)) {

                for (const key in object) {

                    const fn = untrack(() => isFunction(object[key]) ? object[key] : (object as any)[SYMBOL_STORE_OBSERVABLE](key)) as (() => number | string | null | undefined) //TSC

                    setStyle(element, key, fn, stack)

                }

            } else {
                //@ts-ignore
                for (const key in object) {

                    setStyle(element, key, object[key], stack)

                }

            }

        }

    }

    const setStyles = (element: HTMLElement, object: FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>>, stack: Stack): void => {

        if (isFunction(object) || isArray(object)) {

            let objectPrev: null | undefined | string | Record<string, null | undefined | number | string>

            useRenderEffect((options) => {

                const objectNext = resolveStyle(object)

                setStylesStatic(element, objectNext, objectPrev, stack)

                objectPrev = objectNext

            }, env, stack)

        } else {

            setStylesStatic(element, $$(object), null, stack)

        }

    }


    const setTemplateAccessor = (element: HTMLElement, key: string, value: TemplateActionProxy): void => {

        if (key === 'children') {

            const placeholder = createText('') // Using a Text node rather than a Comment as the former may be what we actually want ultimately

            element.insertBefore(placeholder as any, null as any)

            value(element, 'setChildReplacement', undefined, placeholder as any)

        } else if (key === 'ref') {

            value(element, 'setRef')

        } else if (key === 'style') {

            value(element, 'setStyles')

        } else if (key === 'class' || key === 'className') {

            if (!isSVG(element)) {

                element.className = '' // Ensuring the attribute is present

            }

            value(element, 'setClasses')

        } else if (key === 'dangerouslySetInnerHTML') {

            value(element, 'setHTML')

        } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) { // /^on/

            value(element, 'setEvent', key.toLowerCase())

        } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) { // /^u..:/

            value(element, 'setDirective', key.slice(4))

        } else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' || key === 'className') {

            // Forbidden props

        } else if (key in element && !isSVG(element)) {

            value(element, 'setProperty', key)

        } else {

            element.setAttribute(key, '') // Ensuring the attribute is present

            value(element, 'setAttribute', key)

        }

    }

    // if (isSSR) { globalThis.Comment = class { } as any; globalThis.Text = class { } as any }

    const setProp = (element: HTMLElement | Comment, key: string, value: any, stack: Stack): void => {
        if (element.nodeType === 8 || element.nodeType === 3) {
            if (key === 'ref')
                setRef(element, value)
            else if (key in element)
                setProperty(element, key, value, stack)
        }
        else {
            if (value === undefined) return // Ignoring undefined props, for performance

            if (isTemplateAccessor(value)) {

                setTemplateAccessor(element as any, key, value)

            } else if (key === 'children') {

                setChild(element, value, FragmentUtils.make(), stack)

            } else if (key === 'ref') {

                setRef(element, value)

            } else if (key === 'style') {

                setStyles(element as any, value, stack)

            } else if (key === 'class' || key === 'className') {

                setClasses(element as any, value, stack)

            } else if (key === 'dangerouslySetInnerHTML') {

                setHTML(element as any, value, stack)

            } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) { // /^on/

                setEvent(element as any, key.toLowerCase(), value)

            } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) { // /^u..:/

                setDirective(element as any, key.slice(4), value)

            } else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' || key === 'className') {

                // Forbidden props

            } else if (key in element && !isSVG(element)) {

                setProperty(element, key, value, stack)

            } else {

                setAttribute(element as any, key, value, stack)

            }

        }

    }

    const setProps = (element: HTMLElement | Comment, object: Record<string, unknown>, stack: Stack): void => {

        for (const key in object) {

            setProp(element, key, object[key], stack)

        }

    }

    return {
        setAttributeStatic, setAttribute, setChildReplacementFunction, setChildReplacementText, setChildReplacement, setChildStatic,
        setChild, setClassStatic, setClass, setClassBooleanStatic, setClassBoolean, setClassesStatic, setClasses, setDirective,
        setEvent, setHTML, setProperty, setStyles, setTemplateAccessor, setProp, setProps
    }

}
