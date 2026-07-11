import type { Child, Context, ObservableMaybe, ContextWithDefault } from '../types';
import { ElementAttributes } from './custom_element';
interface ContextProviderProps {
    value?: ObservableMaybe<any>;
    children?: ObservableMaybe<Child>;
    symbol?: ObservableMaybe<Symbol>;
    isStatic?: boolean;
    visible?: boolean;
}
declare const ContextProvider: (props: Partial<ContextProviderProps> & {
    children?: import("woby").CustomElementChildren;
} & import("woby").StyleEncapsulationProps) => globalThis.JSX.Element;
declare module '../index' {
    namespace JSX {
        interface IntrinsicElements {
            'context-provider': ElementAttributes<typeof ContextProvider>;
        }
    }
}
export declare function createContext<T>(defaultValue: T): ContextWithDefault<T>;
export declare function createContext<T>(defaultValue?: T): Context<T>;
export {};
//# sourceMappingURL=create_context.d.ts.map