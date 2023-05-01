import type { Disposer, FunctionMaybe, ObservableMaybe } from '../types';
declare const useIdleCallback: (callback: ObservableMaybe<IdleRequestCallback>, options?: FunctionMaybe<IdleRequestOptions>) => Disposer;
export default useIdleCallback;
