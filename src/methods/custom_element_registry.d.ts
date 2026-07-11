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
export declare class WobyCustomElementsRegistry {
    private readonly _registry;
    private readonly _native;
    private readonly _warnedTags;
    constructor();
    /**
     * Register a custom element constructor under tagName.
     *
     * If the native slot is free, register the real constructor directly with
     * customElements.define() for optimal performance and correctness.
     *
     * If the native slot is already taken (by another lib), keep in private Map only.
     * The element can still be instantiated programmatically via our get().
     */
    define(tagName: string, ctor: CustomElementConstructor): void;
    /**
     * Returns the constructor owned by THIS registry.
     * Falls back to the native registry for tags not owned by this instance
     * (e.g. elements registered by react-custom-elements, lit, etc.).
     */
    get(tagName: string): CustomElementConstructor | undefined;
    /**
     * Returns `{ ctor, isNative }` where `isNative` is true when the constructor
     * came from the browser's native registry rather than this woby-owned registry.
     * Returns `undefined` when the tag is unknown to both registries.
     */
    getWithMeta(tagName: string): {
        ctor: CustomElementConstructor;
        isNative: boolean;
    } | undefined;
    /** Mirrors CustomElementRegistry.whenDefined(). */
    whenDefined(tagName: string): Promise<CustomElementConstructor>;
    /** True only if THIS registry (not just native) owns tagName. */
    has(tagName: string): boolean;
}
/** Singleton woby registry – one per bundler chunk / module graph. */
export declare const wobyCustomElements: WobyCustomElementsRegistry;
//# sourceMappingURL=custom_element_registry.d.ts.map