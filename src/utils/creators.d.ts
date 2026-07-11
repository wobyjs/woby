import type { FN } from '../types';
import { createComment as createCommentSSR, createText as createTextSSR, createDocumentFragment as createDocumentFragmentSSR, createElement as createHTMLNodeSSR } from '../ssr/document';
import { createSVGNode as createSVGNodeSSR } from '../ssr/document';
declare const createComment: FN<[string], import("../ssr").Comment> | FN<[any], Comment>, createHTMLNode: FN<[string], HTMLElement> | FN<[keyof import("woby").JSX.IntrinsicElements], HTMLElement>, createSVGNode: FN<[string], SVGElement> | FN<[keyof import("woby").JSX.IntrinsicElements], SVGElement> | FN<[keyof import("woby").JSX.IntrinsicElements], Element>, createText: FN<[string], Text> | FN<[any], Text>, createDocumentFragment: FN<[], DocumentFragment>;
export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment };
export { createCommentSSR, createHTMLNodeSSR, createSVGNodeSSR, createTextSSR, createDocumentFragmentSSR };
//# sourceMappingURL=creators.d.ts.map