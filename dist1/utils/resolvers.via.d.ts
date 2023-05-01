import type { Classes, ObservableMaybe } from '../types';
declare const resolveChild: <T>(value: any, _dynamic?: boolean) => T | T[];
declare const resolveClass: (classes: Classes, resolved?: Record<string, true>) => Record<string, true>;
declare const resolveArraysAndStatics: (values: any[]) => [any[], boolean];
export { resolveChild, resolveClass, resolveArraysAndStatics };
