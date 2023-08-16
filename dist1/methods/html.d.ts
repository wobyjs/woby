import type { Child, ComponentsMap, JSX.Element } from '../types';
declare const html: ((strings: TemplateStringsArray, ...values: any[]) => JSX.Element<Child> | JSX.Element<Child>[]) & {
    register: (components: ComponentsMap) => void;
};
export default html;
