/**
 * Per-library Custom Element Registry
 *
 * Provides an isolated registry per framework/library so that multiple libraries
 * (woby, react, lit, etc.) can each define custom elements without colliding in
 * the native globalThis.customElements namespace.
 *
 * Architecture
 * ────────────
 *  wobyCustomElements.define('my-el', WobyClass)
 *         │
 *         ├─→ if native slot FREE: customElements.define('my-el', WobyClass) ← fast path!
 *         │    Browser upgrades work natively, no wrapper overhead.
 *         │
 *         └─→ if native slot TAKEN: keep in private Map only
 *              get() returns our WobyClass for programmatic use.
 *              Browser upgrades go to other lib's version (first-come-first-served).
 *
 * No patching or mutation of globalThis.customElements ever occurs.
 * Each library creates its own `new WobyCustomElementsRegistry()` instance.
 */

export class WobyCustomElementsRegistry {
    private readonly _registry: Map<string, CustomElementConstructor> = new Map()
    private readonly _native: typeof globalThis.customElements | null

    constructor() {
        this._native = (typeof globalThis !== 'undefined' && typeof (globalThis as any).customElements !== 'undefined')
            ? (globalThis as any).customElements as typeof globalThis.customElements
            : null
    }

    /**
     * Register a custom element constructor under tagName.
     *
     * If the native slot is free, register the real constructor directly with
     * customElements.define() for optimal performance and correctness.
     *
     * If the native slot is already taken (by another lib), keep in private Map only.
     * The element can still be instantiated programmatically via our get().
     */
    define(tagName: string, ctor: CustomElementConstructor): void {
        if (this._registry.has(tagName)) {
            console.warn(`[WobyCustomElementsRegistry] Element ${tagName} already registered in this registry.`)
            return
        }
        this._registry.set(tagName, ctor)

        if (!this._native) return // SSR – no native registry available

        const existingNative = this._native.get(tagName)

        if (!existingNative) {
            // Native slot is free - register the real constructor directly!
            // This is the fast path: browser upgrades work natively, no wrapper needed.
            this._native.define(tagName, ctor)
        } else {
            // Another lib already owns the native slot.
            // We keep our private record but cannot re-define.
            // Our get() will still return our constructor for programmatic use.
            console.warn(`[WobyCustomElementsRegistry] Native customElements already has "${tagName}"; skipping native define. Programmatic instantiation only.`)
        }
    }

    /**
     * Returns the constructor owned by THIS registry.
     * Falls back to the native registry for tags not owned by this instance
     * (e.g. elements registered by react-custom-elements, lit, etc.).
     */
    get(tagName: string): CustomElementConstructor | undefined {
        return this._registry.get(tagName)
            ?? (this._native?.get(tagName) as CustomElementConstructor | undefined)
    }

    /**
     * Returns `{ ctor, isNative }` where `isNative` is true when the constructor
     * came from the browser's native registry rather than this woby-owned registry.
     * Returns `undefined` when the tag is unknown to both registries.
     */
    getWithMeta(tagName: string): { ctor: CustomElementConstructor; isNative: boolean } | undefined {
        const wobyCtor = this._registry.get(tagName)
        if (wobyCtor) return { ctor: wobyCtor, isNative: false }
        const nativeCtor = this._native?.get(tagName) as CustomElementConstructor | undefined
        if (nativeCtor) return { ctor: nativeCtor, isNative: true }
        return undefined
    }

    /** Mirrors CustomElementRegistry.whenDefined(). */
    whenDefined(tagName: string): Promise<CustomElementConstructor> {
        if (this._registry.has(tagName)) return Promise.resolve(this._registry.get(tagName)!)
        return this._native?.whenDefined(tagName) ?? Promise.resolve(undefined as any)
    }

    /** True only if THIS registry (not just native) owns tagName. */
    has(tagName: string): boolean {
        return this._registry.has(tagName)
    }
}

/** Singleton woby registry – one per bundler chunk / module graph. */
export const wobyCustomElements = new WobyCustomElementsRegistry()
