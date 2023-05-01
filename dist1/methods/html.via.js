/* IMPORT */
import htm from 'htm';
import createElement from './create_element.via.js';
import { assign } from '../utils/lang.js';
/* HELPERS */
const registry = {};
const h = (type, props, ...children) => createElement(registry[type] || type, props, ...children);
const register = (components) => void assign(registry, components);
/* MAIN */
const html = assign(htm.bind(h), { register });
/* EXPORT */
export default html;
