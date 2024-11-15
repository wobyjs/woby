import { SYMBOL_CLONE } from '../constants';
import type { Component, Child, Refs } from '../types';

export interface CloneableType<P extends { children?: Child, ref?: Refs } = unknown /* extends Props */> {
  Component: Component<P>
  props?: P | null;
};

export const wrapCloneElement = <T, P /* extends Props */>(target: T, component: Component<P>, props?: P | null) => {
  target[SYMBOL_CLONE] = { Component: component, props } as CloneableType;
  return target;
};
