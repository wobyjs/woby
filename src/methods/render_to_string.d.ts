import type { Child } from '../types';
import type { SSRDocument } from '../ssr/document';
/**
 * Options for renderToString
 */
export interface RenderToStringOptions {
    /**
     * Custom SSR document instance for isolated context
     * If not provided, a new document instance will be created internally
     */
    document?: SSRDocument;
    /**
     * If true, returns both HTML string and document instance
     * Useful for inspecting what was rendered to document.body (e.g., portals)
     */
    returnDocument?: boolean;
    /**
     * If true, appends to existing content instead of replacing
     * Mirrors the append option in render()
     */
    append?: boolean;
}
/**
 * Render HTML string from a Voby component or JSX element
 *
 * For custom elements: renders only the host element tag (e.g., `<custom-element></custom-element>`)
 * without shadowRoot or slot content. This is intentional because:
 * 1. Custom elements are defined via `customElements.define()` with their own shadow DOM behavior
 * 2. The browser will automatically rebuild the shadowRoot and populate slots when the element is connected
 * 3. Including shadow DOM content in SSR would cause duplication and hydration mismatches
 * 4. The slot content is provided by light DOM children, which are rendered separately
 *
 * TODO - renderToHtml -> which will render all customElement in div so it can be shown in browser without customElement defined in js
 * @param child
 * @param options
 * @returns
 *
 */
export declare function renderToString<T extends RenderToStringOptions = RenderToStringOptions>(child: Child, options?: T): T extends {
    returnDocument: true;
} ? {
    html: string;
    document: SSRDocument;
} : string;
export declare function getNodeContent(node: any): string;
//# sourceMappingURL=render_to_string.d.ts.map