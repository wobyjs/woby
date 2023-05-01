/* IMPORT */
/* MAIN */
const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment, } = (() => {
    if (typeof via !== 'undefined') {
        const document = via.document;
        const createComment = document.createComment;
        const createHTMLNode = document.createElement;
        const createSVGNode = (name) => document.createElementNS('http://www.w3.org/2000/svg', name);
        const createText = document.createTextNode;
        const createDocumentFragment = document.createDocumentFragment;
        return { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment, };
    }
    else {
        const createComment = document.createComment.bind(document, '');
        const createHTMLNode = document.createElement.bind(document);
        const createSVGNode = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');
        const createText = document.createTextNode.bind(document);
        const createDocumentFragment = document.createDocumentFragment.bind(document);
        return { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment };
    }
})();
/* EXPORT */
export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment };
