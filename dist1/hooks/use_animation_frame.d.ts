import type { Disposer, ObservableMaybe } from '../types';
declare const useAnimationFrame: (callback: ObservableMaybe<FrameRequestCallback>) => Disposer;
export default useAnimationFrame;
