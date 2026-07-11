import type { Classes, ObservableMaybe, Styles } from '../types';
import { Stack } from '../soby';
export declare const resolveChild: <T>(value: ObservableMaybe<T>, setter: ((value: T | T[], dynamic: boolean, stack: Stack) => void), _dynamic: boolean | undefined, stack: Stack) => void;
export declare const resolveClass: (classes: Classes, resolved?: Record<string, true>) => Record<string, true>;
export declare const resolveStyle: (styles: Styles, resolved?: Record<string, null | undefined | number | string> | string) => Record<string, null | undefined | number | string> | string;
export declare const resolveArraysAndStatics: (values: any[]) => [any[], boolean];
//# sourceMappingURL=resolvers.d.ts.map