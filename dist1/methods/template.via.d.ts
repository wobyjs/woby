import type { Child } from '../types';
declare const template: <P = {}>(fn: (props: P) => Child) => (props: P) => () => Child;
export default template;
