import type { Disposer, FunctionMaybe, ObservableMaybe } from '../types';
declare const useIdleLoop: (callback: ObservableMaybe<IdleRequestCallback>, options?: FunctionMaybe<IdleRequestOptions>) => Disposer;
export default useIdleLoop;
