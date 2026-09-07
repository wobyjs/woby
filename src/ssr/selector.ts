/**
 * CSS selector engine for the SSR node tree.
 *
 * The SSR nodes were built to *emit* HTML — attributes in, `outerHTML` out — and had no
 * way to read the tree back: no `querySelector`, no `matches`, no `closest`. That makes
 * the SSR document unusable for anything that inspects what it just built, which is most
 * of what a test does. This file is the missing half; `base_node.ts` and `document.ts`
 * expose it under the standard DOM names.
 *
 * === Supported grammar ===
 *
 *   *                       universal
 *   tag                     type (case-insensitive; non-ASCII tag names welcome)
 *   #id  .class             id / class
 *   [a] [a=v] [a~=v]        attribute presence and value, values quoted or bare
 *   [a|=v] [a^=v]
 *   [a$=v] [a*=v]
 *   div.a[b]                compound
 *   a b     a > b           descendant / child combinators
 *   a, b                    selector list
 *
 * Deliberately absent: pseudo-classes and pseudo-elements, the sibling combinators
 * (`+`, `~`), and namespaces. Anything unrecognised throws rather than quietly matching
 * nothing — a typo in a selector should not read back as "no results".
 */

type Simple =
    | { t: 'any' }
    | { t: 'tag', v: string }
    | { t: 'id', v: string }
    | { t: 'class', v: string }
    | { t: 'attr', name: string, op?: string, value?: string }

type Compound = Simple[]

/**
 * One complex selector, left to right. An entry's `combinator` describes its relation to
 * the entry BEFORE it, so the first entry always carries `null`.
 */
type Complex = Array<{ compound: Compound, combinator: ' ' | '>' | null }>

/** Characters allowed in a tag name, class, id or attribute name. */
const IDENT = /[A-Za-z0-9_\u00A0-\uFFFF-]/
const SPACE = /[ \t\r\n\f]/

const 语法错误 = (sel: string, at: number, why: string): never => {
    throw new SyntaxError(`'${sel}' is not a valid selector for the SSR selector engine (${why}, at offset ${at}).`)
}

const readIdent = (sel: string, i: number): [string, number] => {
    let out = ''
    while (i < sel.length && IDENT.test(sel[i])) { out += sel[i]; i++ }
    return [out, i]
}

/** `[name]` or `[name op value]`; `i` is just past the `[`. Returns the simple + index past `]`. */
const readAttr = (sel: string, i: number): [Simple, number] => {
    while (i < sel.length && SPACE.test(sel[i])) i++
    const [name, afterName] = readIdent(sel, i)
    if (!name) return 语法错误(sel, i, 'empty attribute name')
    i = afterName
    while (i < sel.length && SPACE.test(sel[i])) i++

    if (sel[i] === ']') return [{ t: 'attr', name }, i + 1]

    let op = ''
    if (i < sel.length && '~|^$*'.includes(sel[i])) { op = sel[i]; i++ }
    if (sel[i] !== '=') return 语法错误(sel, i, 'expected "=" in an attribute selector')
    op += '='
    i++
    while (i < sel.length && SPACE.test(sel[i])) i++

    let value = ''
    const quote = sel[i]
    if (quote === '"' || quote === '\'') {
        i++
        while (i < sel.length && sel[i] !== quote) {
            if (sel[i] === '\\' && i + 1 < sel.length) i++   // backslash escapes the next char
            value += sel[i]; i++
        }
        if (sel[i] !== quote) return 语法错误(sel, i, 'unterminated string')
        i++
    } else {
        const [bare, afterBare] = readIdent(sel, i)
        value = bare; i = afterBare
    }

    while (i < sel.length && SPACE.test(sel[i])) i++
    // the case-sensitivity flag is accepted and ignored; matching here is always exact
    if (i < sel.length && 'iIsS'.includes(sel[i])) {
        i++
        while (i < sel.length && SPACE.test(sel[i])) i++
    }
    if (sel[i] !== ']') return 语法错误(sel, i, 'expected "]"')
    return [{ t: 'attr', name, op, value }, i + 1]
}

const cache = new Map<string, Complex[]>()

/** Parse a selector list. Memoised — selectors are overwhelmingly literals in hot loops. */
export const parseSelector = (sel: string): Complex[] => {
    const hit = cache.get(sel)
    if (hit) return hit

    const list: Complex[] = []
    let complex: Complex = []
    let compound: Compound = []
    let combinator: ' ' | '>' | null = null
    let pendingSpace = false
    let i = 0

    const flushCompound = () => {
        if (compound.length) {
            complex.push({ compound, combinator })
            compound = []
            combinator = null
        }
    }
    const flushComplex = () => {
        flushCompound()
        if (complex.length) list.push(complex)
        complex = []
    }

    while (i < sel.length) {
        const c = sel[i]

        if (SPACE.test(c)) { i++; pendingSpace = compound.length > 0; continue }
        if (c === ',') { flushComplex(); pendingSpace = false; i++; continue }
        if (c === '>') { flushCompound(); combinator = '>'; pendingSpace = false; i++; continue }

        // Whitespace only becomes a descendant combinator once a real token follows it, and
        // it must never downgrade an explicit `>` that sat between the two ("a > b").
        if (pendingSpace) {
            flushCompound()
            if (combinator === null) combinator = ' '
            pendingSpace = false
        }

        if (c === '*') { compound.push({ t: 'any' }); i++; continue }
        if (c === '#' || c === '.') {
            const [v, next] = readIdent(sel, i + 1)
            if (!v) return 语法错误(sel, i, `empty ${c === '#' ? 'id' : 'class'}`)
            compound.push({ t: c === '#' ? 'id' : 'class', v })
            i = next; continue
        }
        if (c === '[') {
            const [simple, next] = readAttr(sel, i + 1)
            compound.push(simple); i = next; continue
        }
        if (c === ':') return 语法错误(sel, i, 'pseudo-classes are not supported')
        if (c === '+' || c === '~') return 语法错误(sel, i, 'sibling combinators are not supported')

        const [tag, next] = readIdent(sel, i)
        if (!tag) return 语法错误(sel, i, `unexpected "${c}"`)
        compound.push({ t: 'tag', v: tag })
        i = next
    }
    flushComplex()

    if (!list.length) return 语法错误(sel, 0, 'empty selector')
    cache.set(sel, list)
    return list
}

const 是元素 = (n: any): boolean => !!n && n.nodeType === 1

const 类列表 = (el: any): string[] => {
    const raw = el.attributes?.['class']
    return typeof raw === 'string' && raw ? raw.split(/[ \t\r\n\f]+/).filter(Boolean) : []
}

const matchSimple = (el: any, s: Simple): boolean => {
    switch (s.t) {
        case 'any': return true
        case 'tag': return typeof el.tagName === 'string' && el.tagName.toLowerCase() === s.v.toLowerCase()
        case 'id': return el.attributes?.['id'] === s.v
        case 'class': return 类列表(el).includes(s.v)
        case 'attr': {
            const v = el.attributes?.[s.name]
            if (v === undefined || v === null) return false
            if (!s.op) return true
            const want = s.value ?? ''
            switch (s.op) {
                case '=': return String(v) === want
                case '~=': return want !== '' && String(v).split(/[ \t\r\n\f]+/).includes(want)
                case '|=': return String(v) === want || String(v).startsWith(want + '-')
                case '^=': return want !== '' && String(v).startsWith(want)
                case '$=': return want !== '' && String(v).endsWith(want)
                case '*=': return want !== '' && String(v).includes(want)
            }
            return false
        }
    }
}

const matchCompound = (el: any, compound: Compound): boolean =>
    compound.every(s => matchSimple(el, s))

/**
 * Match `complex[0..i]` ending at `node`, walking leftwards. Descendant steps backtrack
 * over every ancestor instead of taking the nearest match, so `a b > c` behaves.
 */
const matchFrom = (node: any, complex: Complex, i: number): boolean => {
    if (!是元素(node)) return false
    if (!matchCompound(node, complex[i].compound)) return false
    const combinator = complex[i].combinator
    if (combinator === null) return true
    if (combinator === '>') return matchFrom(node.parentNode, complex, i - 1)
    for (let p = node.parentNode; 是元素(p); p = p.parentNode)
        if (matchFrom(p, complex, i - 1)) return true
    return false
}

const matchAny = (el: any, parsed: Complex[]): boolean =>
    parsed.some(complex => matchFrom(el, complex, complex.length - 1))

/** `element.matches(selector)`. */
export const matchesSelector = (el: any, selector: string): boolean =>
    是元素(el) && matchAny(el, parseSelector(selector))

/** `element.closest(selector)` — self first, then ancestors. */
export const closestSelector = (el: any, selector: string): any | null => {
    const parsed = parseSelector(selector)
    for (let n = el; 是元素(n); n = n.parentNode)
        if (matchAny(n, parsed)) return n
    return null
}

/**
 * Every element descendant of `root`, in document order.
 *
 * Shadow trees are NOT entered, matching the real DOM: a custom element's `shadowRoot`
 * lives outside its `childNodes`, and `document.querySelector` cannot see into it.
 */
export function* descendantElements(root: any): Generator<any> {
    const kids: any[] = root?.childNodes ?? []
    for (const child of kids) {
        if (!是元素(child)) continue
        yield child
        yield* descendantElements(child)
    }
}

/**
 * `root.querySelectorAll(selector)`.
 *
 * Returns a plain array rather than a NodeList: `SimpleNodeList` has neither `forEach`
 * nor numeric indexing, so it is the worse stand-in of the two. An array satisfies
 * `.length`, `[i]`, `for…of`, `Array.from` and spread, which is every way callers
 * actually consume the result.
 */
export const querySelectorAll = (root: any, selector: string): any[] => {
    const parsed = parseSelector(selector)
    const out: any[] = []
    for (const el of descendantElements(root))
        if (matchAny(el, parsed)) out.push(el)
    return out
}

/** `root.querySelector(selector)` — first match in document order, or null. */
export const querySelector = (root: any, selector: string): any | null => {
    const parsed = parseSelector(selector)
    for (const el of descendantElements(root))
        if (matchAny(el, parsed)) return el
    return null
}

/** `root.getElementById(id)` — first element whose `id` attribute matches exactly. */
export const getElementById = (root: any, id: string): any | null => {
    for (const el of descendantElements(root))
        if (el.attributes?.['id'] === id) return el
    return null
}
