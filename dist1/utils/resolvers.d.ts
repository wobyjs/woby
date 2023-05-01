import type { Classes, ObservableMaybe } from '../types';
declare const resolveChild: <T>(value: any, setter: (value: T | T[], dynamic: boolean) => void, _dynamic?: boolean) => void;
declare const resolveClass: (classes: Classes, resolved?: Record<string, true>) => Record<string, true>;
declare const resolveArraysAndStatics: (values: any[]) => [any[], boolean];
export { resolveChild, resolveClass, resolveArraysAndStatics };
