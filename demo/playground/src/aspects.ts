/* ASPECT REPORT
 *
 * Both suites end on a per-test tally keyed by component name. Dumping that map as raw JSON is
 * unreadable in a log tail, so this groups it into the aspect of the framework each test covers
 * (attributes, classes, context, custom elements, …) and prints a pass table instead.
 *
 * The aspect is derived from the component name, which is also the file name — no per-file
 * metadata to keep in sync. Order matters: the first matching rule wins, so the specific groups
 * come before the generic ones (TestClassNameObservable is a Class test, not a Reactivity one).
 */

export type Tally = { instances: number, ticks: number, ssr: number, dom: number, fail: number }

const RULES: Array<[string, RegExp]> = [
    ['Attributes & props', /^Attribute|^Prop|^Spread|^DataAttr|^Id[A-Z]|^TabIndex|^Checkbox|^Progress|^Select/],
    ['Class & style', /^Class|^Style|^Css|^Tailwind/],
    ['Custom elements', /^CustomElement|^Native|^Element|^Shadow|^Slot|^Define/],
    ['Context', /^Context|^Provider/],
    ['Events', /Click|^Event|Mouse|Key(down|up|press)|^Input|^Change|^Focus|^Blur|^Submit/],
    ['Components', /^Component/],
    ['Refs & directives', /^Ref|^Directive|^Use[A-Z]/],
    ['Children & text', /^Child|^Text|^Fragment|^Portal/],
    ['Async & resources', /^Promise|^Resource|^Suspense|^Await/],
    ['Control flow', /^If|^Ternary|^Switch|^For|^Dynamic|^ErrorBoundary|^KeepAlive|^Lazy|^Show|^Nested/],
    ['Value types', /^Boolean|^BigInt|^Number|^String|^Symbol|^Undefined|^Null|^Date|^Array|^Object/],
    ['HTML converters', /^Html|^HTML/],
    ['SVG', /^Svg|^SVG/],
    ['Reactivity', /^Observable|^Memo|^Store|^Effect|^Signal|^Untrack|^Batch|^Computed/],
    ['Rendering & SSR', /^Render|^Ssr|^SSR|^Hydrat|^Mount|^Append|^Template/],
    ['Cleanup & lifecycle', /^Cleanup|^Dispose|^Unmount|^HMR/],
]

export const aspectOf = (testName: string): string => {
    const stem = testName.replace(/^Test/, '')
    for (const [aspect, re] of RULES) if (re.test(stem)) return aspect
    return 'Other'
}

/**
 * Group a per-test tally into an aspect table. `assertions` is what actually ran, `pass` what held.
 * `dom` is browser-only (renderToString needs no document), so it is 0 under `pnpm test`.
 */
export const aspectReport = (tallies: Record<string, Tally>): string[] => {
    const rows: Record<string, { tests: number, ticks: number, ssr: number, dom: number, fail: number }> = {}
    for (const [name, t] of Object.entries(tallies)) {
        const a = aspectOf(name)
        const r = rows[a] ??= { tests: 0, ticks: 0, ssr: 0, dom: 0, fail: 0 }
        r.tests++; r.ticks += t.ticks; r.ssr += t.ssr; r.dom += t.dom; r.fail += t.fail
    }

    const order = Object.entries(rows).sort((a, b) => b[1].ssr + b[1].dom - (a[1].ssr + a[1].dom) || a[0].localeCompare(b[0]))
    const width = Math.max(6, ...order.map(([a]) => a.length))
    const num = (n: number, w: number) => String(n).padStart(w)

    const out = [`${'Aspect'.padEnd(width)}  tests  ticks  assert   pass   fail`]
    out.push('-'.repeat(width + 34))
    for (const [aspect, r] of order) {
        // A passing assertion lands in ssr/dom, a failing one in fail — so attempted is the sum.
        const pass = r.ssr + r.dom
        out.push(`${aspect.padEnd(width)}  ${num(r.tests, 5)}  ${num(r.ticks, 5)}  ${num(pass + r.fail, 6)}  ${num(pass, 5)}  ${num(r.fail, 5)}${r.fail ? '  ❌' : ''}`)
    }
    const tot = Object.values(rows).reduce((a, r) => ({ tests: a.tests + r.tests, ticks: a.ticks + r.ticks, ssr: a.ssr + r.ssr, dom: a.dom + r.dom, fail: a.fail + r.fail }), { tests: 0, ticks: 0, ssr: 0, dom: 0, fail: 0 })
    out.push('-'.repeat(width + 34))
    const totPass = tot.ssr + tot.dom
    out.push(`${'TOTAL'.padEnd(width)}  ${num(tot.tests, 5)}  ${num(tot.ticks, 5)}  ${num(totPass + tot.fail, 6)}  ${num(totPass, 5)}  ${num(tot.fail, 5)}`)
    return out
}
