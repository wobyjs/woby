
/* IMPORT */

import htm from 'htm';
import createElement from '../methods/create_element';
import { assign } from '../utils/lang';
import type { Child, ComponentsMap, Element, Props } from '../types';

/* HELPERS */

const registry: ComponentsMap = {};
const h = (type: string, props?: Props | null, key?: string, isStatic?: boolean, source?: { fileName: string; lineNumber: number; columnNumber: number; }, self?: any): Element => createElement((registry[type] || type) as any, props, key, isStatic, source, self);
const register = (components: ComponentsMap): void => void assign(registry, components);

/* MAIN */

const html = assign(htm.bind(h), { register });

/* EXPORT */

export default html;
