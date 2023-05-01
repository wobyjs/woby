import type { Context, ContextWithDefault } from '../types';
declare function createContext<T>(defaultValue: T): ContextWithDefault<T>;
declare function createContext<T>(defaultValue?: T): Context<T>;
export default createContext;
