/**
 * Shared assertion helpers for the SSR-API specs (Test Ssr*.tsx).
 *
 * Every helper emits exactly one `✅` console.log per passing check, which is what both
 * harnesses tally: the browser's <TestSnapshots> and the Node runner's runSSRTest() both
 * count `✅` logs raised inside expect(). One helper call === one assertion on both sides,
 * so the two suites stay diffable check-by-check.
 *
 * Deliberately NOT named Test*.tsx — test.tsx would otherwise try to run it as a spec.
 */

import { ssr } from 'woby'
import { assert } from './util'

/* ────────────────────────────────  formatting  ──────────────────────────────── */

const 短 = (v: any): string => {
    if (v === null) return 'null'
    if (v === undefined) return 'undefined'
    if (Array.isArray(v)) return `[${v.map(短).join(', ')}]`
    if (typeof v === 'object' && typeof v.nodeType === 'number') {
        if (v.nodeType === 1) return `<${v.tagName?.toLowerCase()}${v.attributes?.['id'] ? '#' + v.attributes['id'] : ''}>`
        if (v.nodeType === 3) return `#text("${v.textContent}")`
        if (v.nodeType === 8) return `#comment`
        if (v.nodeType === 11) return `#fragment`
        if (v.nodeType === 9) return `#document`
        return `#node(${v.nodeType})`
    }
    return typeof v === 'string' ? JSON.stringify(v) : String(v)
}

/* ────────────────────────────────  primitives  ──────────────────────────────── */

/** Strict-equality check. Passes → one `✅`; fails → one harness failure. */
export const check = (name: string, label: string, actual: any, expected: any): boolean => {
    const ok = Object.is(actual, expected)
    if (ok) console.log(`✅ [${name}] ${label}`)
    else assert(false, `[${name}] ${label} — expected ${短(expected)}, got ${短(actual)}`)
    return ok
}

/** Truthiness check. */
export const checkTrue = (name: string, label: string, actual: any): boolean =>
    check(name, label, !!actual, true)

/** Falsiness check. */
export const checkFalse = (name: string, label: string, actual: any): boolean =>
    check(name, label, !!actual, false)

/** Element-identity list check — compares length then each entry by reference. */
export const checkNodes = (name: string, label: string, actual: any[], expected: any[]): boolean => {
    const ok = Array.isArray(actual)
        && actual.length === expected.length
        && expected.every((e, i) => actual[i] === e)
    if (ok) console.log(`✅ [${name}] ${label}`)
    else assert(false, `[${name}] ${label} — expected ${短(expected)}, got ${短(actual)}`)
    return ok
}

/**
 * `fn()` must throw a SyntaxError whose message contains `why` — the parser's throw table
 * is part of the contract, so both the type and the reason are asserted.
 */
export const checkThrows = (name: string, label: string, fn: () => any, why: string): boolean => {
    let thrown: any = undefined
    let threw = false
    try { fn() } catch (e) { threw = true; thrown = e }
    const ok = threw
        && thrown instanceof SyntaxError
        && String(thrown.message).includes(why)
    if (ok) console.log(`✅ [${name}] ${label}`)
    else assert(false, `[${name}] ${label} — expected SyntaxError containing ${JSON.stringify(why)}, got ${threw ? String(thrown) : 'no throw'}`)
    return ok
}

/* ────────────────────────────────  tree building  ──────────────────────────────── */

export type Kid = any | string

/** `el('div', { id: 'a' }, el('p'), 'text')` — attributes via setAttribute, strings as text nodes. */
export const el = (tag: string, attrs?: Record<string, string> | null, ...kids: Kid[]): any => {
    const node: any = ssr.createElement(tag)
    if (attrs) for (const k of Object.keys(attrs)) node.setAttribute(k, attrs[k])
    for (const k of kids) node.appendChild(typeof k === 'string' ? ssr.createText(k) : k)
    return node
}

export const text = (s: string): any => ssr.createText(s)
export const comment = (s: string): any => ssr.createComment(s)

/** Tag names of an element list, lowercased — handy for order assertions. */
export const tags = (list: any[]): string => list.map((e: any) => String(e?.tagName ?? '?').toLowerCase()).join(',')

/** `id` attributes of an element list — the usual way these specs assert document order. */
export const ids = (list: any[]): string => list.map((e: any) => String(e?.attributes?.['id'] ?? '?')).join(',')

/** `fn()` must throw an Error whose message contains `why` (any Error subclass). */
export const checkError = (name: string, label: string, fn: () => any, why: string): boolean => {
    let thrown: any = undefined
    let threw = false
    try { fn() } catch (e) { threw = true; thrown = e }
    const ok = threw && String(thrown?.message ?? thrown).includes(why)
    if (ok) console.log(`✅ [${name}] ${label}`)
    else assert(false, `[${name}] ${label} — expected an Error containing ${JSON.stringify(why)}, got ${threw ? String(thrown) : 'no throw'}`)
    return ok
}

/** `fn()` must NOT throw. */
export const checkNoThrow = (name: string, label: string, fn: () => any): boolean => {
    try { fn() } catch (e) {
        assert(false, `[${name}] ${label} — threw ${String(e)}`)
        return false
    }
    console.log(`✅ [${name}] ${label}`)
    return true
}
