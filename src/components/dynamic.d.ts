import type { Child, Component, FunctionMaybe, ObservableMaybe } from '../types';
export declare const Dynamic: <P extends Record<string, any> = {}>({ component, props: propsProp, children, ...restProps }: {
    component: ObservableMaybe<Component<P> | string>;
    props?: FunctionMaybe<P>;
    children?: Child;
} & Omit<P, "props" | "children"> & Record<string, any>) => Child;
//# sourceMappingURL=dynamic.d.ts.map