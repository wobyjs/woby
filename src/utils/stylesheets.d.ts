/**
 * Stylesheet utility functions for the Woby framework
 *
 * This module provides utility functions for working with stylesheets in the browser,
 * including converting document stylesheets to constructed stylesheets with caching
 * and observing stylesheet changes.
 *
 * @module stylesheetUtils
 */
/**
 * Converts all document stylesheets to constructed stylesheets with caching
 *
 * This function converts all stylesheets in the document to CSSStyleSheet objects
 * that can be used in shadow DOM. It caches the results for performance and
 * automatically invalidates the cache when stylesheets change.
 *
 * IMPORTANT: If called before stylesheets have fully loaded, will return empty results.
 * Use refreshStylesheetCache() after page load to ensure all styles are captured.
 *
 * TAILWIND CSS V4 COMPATIBILITY:
 * - Extracts @property rules and applies them as :host variables for Shadow DOM compatibility
 * - Shadow DOM doesn't support @property rules (CSS Houdini), so we convert them to regular CSS variables
 * - See: https://meefik.dev/2025/03/19/tailwindcss-and-shadow-dom/
 *
 * @returns Array of CSSStyleSheet objects representing all stylesheets in the document
 *
 * @example
 * ```typescript
 * const stylesheets = convertAllDocumentStylesToConstructed()
 * shadowRoot.adoptedStyleSheets = stylesheets
 * ```
 */
export declare function convertAllDocumentStylesToConstructed(): CSSStyleSheet[];
/**
 * Initializes stylesheet observation to automatically invalidate cache when stylesheets change
 *
 * This function sets up a MutationObserver to watch for changes to the document that
 * might affect stylesheets. When changes are detected, the stylesheet cache is cleared
 * to ensure styles are up-to-date.
 *
 * @example
 * ```typescript
 * observeStylesheetChanges()
 * const stylesheets = convertAllDocumentStylesToConstructed() // Will be cached
 * // When stylesheets change, cache is automatically cleared
 * ```
 */
export declare function observeStylesheetChanges(): void;
/**
 * Stops observing stylesheet changes and cleans up resources
 *
 * This function disconnects the MutationObserver and clears the stylesheet cache.
 * It should be called when the functionality is no longer needed to prevent memory leaks.
 *
 * @example
 * ```typescript
 * unobserveStylesheetChanges() // Clean up resources
 * ```
 */
export declare function unobserveStylesheetChanges(): void;
/**
 * Registers a shadow root for automatic style updates
 *
 * When stylesheets change, all registered shadow roots will have their
 * adoptedStyleSheets updated with the latest styles.
 *
 * @param shadowRoot - The shadow root to register
 */
export declare function registerShadowRoot(shadowRoot: ShadowRoot): void;
/**
 * Unregisters a shadow root from automatic style updates
 *
 * @param shadowRoot - The shadow root to unregister
 */
export declare function unregisterShadowRoot(shadowRoot: ShadowRoot): void;
/**
 * Updates all registered shadow roots with the latest stylesheets
 *
 * This is called automatically when stylesheet changes are detected,
 * but can also be called manually if needed.
 */
export declare function updateAllShadowRoots(): void;
/**
 * Gets all inline styles from <style> tags as a single text string
 *
 * This function collects all CSS text from <style> elements in the document.
 * It's useful for injecting styles into shadow DOM where adoptedStyleSheets
 * might not work or as a fallback/complement to adoptedStyleSheets.
 *
 * @returns A string containing all inline CSS from the document
 *
 * @example
 * ```typescript
 * const stylesText = getAllInlineStylesAsText()
 * const styleEl = document.createElement('style')
 * styleEl.textContent = stylesText
 * shadowRoot.appendChild(styleEl)
 * ```
 */
export declare function getAllInlineStylesAsText(): string;
/**
 * Manually refreshes the stylesheet cache
 *
 * This function clears the cache and forces a fresh conversion of all stylesheets.
 * Useful when stylesheets are dynamically added or modified after initial load.
 *
 * @returns Array of CSSStyleSheet objects representing all stylesheets in the document
 *
 * @example
 * ```typescript
 * // Add a new stylesheet dynamically
 * const newStyle = document.createElement('style')
 * document.head.appendChild(newStyle)
 *
 * // Refresh the cache to include the new stylesheet
 * refreshStylesheetCache()
 * ```
 */
export declare function refreshStylesheetCache(): CSSStyleSheet[];
//# sourceMappingURL=stylesheets.d.ts.map