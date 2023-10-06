import type { FN } from '../types';
declare const createComment: FN<[any], Comment>, createHTMLNode: FN<[keyof JSX.IntrinsicElements], HTMLElement>, createSVGNode: ((name: string) => FN<[keyof JSX.IntrinsicElements], SVGElement>) | FN<[keyof JSX.IntrinsicElements], Element>, createText: FN<[any], Text>, createDocumentFragment: FN<[], DocumentFragment>;
export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment };
