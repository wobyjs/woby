import type { Child, Component, JSX.Element } from '../types';
declare function h<P = {}>(component: Component<P>, child: Child): JSX.Element;
declare function h<P = {}>(component: Component<P>, props?: P | null, ...children: Child[]): JSX.Element;
export default h;
