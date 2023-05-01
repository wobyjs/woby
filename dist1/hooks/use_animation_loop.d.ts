import type { Disposer, ObservableMaybe } from '../types';
declare const useAnimationLoop: (callback: ObservableMaybe<FrameRequestCallback>) => Disposer;
export default useAnimationLoop;
