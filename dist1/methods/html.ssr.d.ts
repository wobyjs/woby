import type { Child, ComponentsMap, Element } from '../types';
declare const html: ((strings: TemplateStringsArray, ...values: any[]) => Element<Child> | Element<Child>[]) & {
    register: (components: ComponentsMap) => void;
};
export default html;
