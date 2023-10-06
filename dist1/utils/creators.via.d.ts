import type { FN } from '../types';
export declare const createComment: FN<[any], Comment>;
export declare const createHTMLNode: FN<[keyof JSX.IntrinsicElements], HTMLElement>;
export declare const createSVGNode: (name: string) => FN<[keyof JSX.IntrinsicElements], SVGElement>;
export declare const createText: FN<[any], Text>;
export declare const createDocumentFragment: FN<[], DocumentFragment>;
