/* IMPORT */
import useScheduler from './use_scheduler.js';
/* MAIN */
const useAnimationLoop = (callback) => {
    return useScheduler({
        callback,
        loop: true,
        cancel: cancelAnimationFrame,
        schedule: requestAnimationFrame
    });
};
/* EXPORT */
export default useAnimationLoop;
