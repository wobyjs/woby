import type { Child } from '../types';
declare const template: <P extends JSX.Element>(fn: (props: P) => Child) => (props: P) => () => Child;
export default template;
