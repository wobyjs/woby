/* IMPORT */
import h from 'vhtml';
export const createComment = ((name, props, ...args) => h('!', props, ...args));
export const createHTMLNode = h; //as any as FN<[ComponentIntrinsicElement], HTMLElement>
export const createSVGNode = h; //as any as FN<[ComponentIntrinsicElement], SVGElement>
export const createText = ((text) => h('text', null, text));
// export const createDocumentFragment = document.createDocumentFragment as any as FN<[], DocumentFragment>
