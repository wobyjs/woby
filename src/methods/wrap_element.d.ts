import { Stack } from 'soby';
export declare const SYMBOL_STACK: unique symbol;
export interface StackTaggedFunction extends Function {
    [SYMBOL_STACK]?: Stack;
}
export declare const wrapElement: <T extends Function>(element: T) => T & StackTaggedFunction;
//# sourceMappingURL=wrap_element.d.ts.map