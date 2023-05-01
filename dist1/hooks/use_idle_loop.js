/* IMPORT */
import useScheduler from './use_scheduler.js';
import $$ from '../methods/SS.js';
/* MAIN */
const useIdleLoop = (callback, options) => {
    return useScheduler({
        callback,
        loop: true,
        cancel: cancelIdleCallback,
        schedule: callback => requestIdleCallback(callback, $$(options))
    });
};
/* EXPORT */
export default useIdleLoop;
