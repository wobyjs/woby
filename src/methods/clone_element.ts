
/* IMPORT */

import type { Child, Props } from '../types';;
import { isFunction, isPrimitive } from '../utils/lang';
import { SYMBOL_CLONE } from '../constants';
import createElement from '../methods/create_element';
import { CloneableType, wrapCloneElement } from '../methods/wrap_clone_element';

/* MAIN */

export const cloneElement = <P extends Props>(element: Child | Element, props: P): Child => {
  if (isPrimitive(element))
    return element;
  else if (isFunction(element)) {
    if (!element[SYMBOL_CLONE])
      throw new Error('target is not cloneable, it is not created by jsx.createElement');

    const { component, props: oldProps } = element[SYMBOL_CLONE] as CloneableType<P>;
    const newProps = { ...oldProps, ...props };

    return wrapCloneElement(createElement<P>(component as any, newProps), component, newProps);
  }
  else if (Array.isArray(element))
    return element.map(e => cloneElement(e, props));
  else if (element.cloneNode) //native html
    return element.cloneNode();

  throw new Error("Unknown element");
};

export default cloneElement

