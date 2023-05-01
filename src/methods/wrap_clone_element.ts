import { SYMBOL_CLONE } from '../constants';
import type { Component, Props } from '../types';

export interface CloneableType<P extends Props> {
  component: Component<P>;
  props?: P | null;
};

export const wrapCloneElement = <T, P extends Props>(target: T, component: Component<P>, props?: P | null) => {
  target[SYMBOL_CLONE] = { component, props };
  return target;
};
