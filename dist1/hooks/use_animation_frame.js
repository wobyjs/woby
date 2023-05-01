/* IMPORT */
import useScheduler from './use_scheduler.js';
/* MAIN */
const useAnimationFrame = (callback) => {
    return useScheduler({
        callback,
        cancel: cancelAnimationFrame,
        schedule: requestAnimationFrame
    });
};
/* EXPORT */
export default useAnimationFrame;
