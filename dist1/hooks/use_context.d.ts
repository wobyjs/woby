import type { Context, ContextWithDefault } from '../types';
declare function useContext<T>(Context: ContextWithDefault<T>): T;
declare function useContext<T>(Context: Context<T>): T | undefined;
export default useContext;
