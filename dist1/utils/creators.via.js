///// <reference path="../../../via/dist/controller/index.d.ts" />
import 'via';
/* MAIN */
if (typeof via !== 'undefined')
    var document = via.document;
export const createComment = document.createComment;
export const createHTMLNode = document.createElement;
export const createSVGNode = (name) => document.createElementNS('http://www.w3.org/2000/svg', name);
export const createText = document.createTextNode;
export const createDocumentFragment = document.createDocumentFragment;
/* EXPORT */
