/* IMPORT */
import useScheduler from './use_scheduler.js';
import $$ from '../methods/SS.js';
/* MAIN */
const useIdleCallback = (callback, options) => {
    return useScheduler({
        callback,
        cancel: cancelIdleCallback,
        schedule: callback => requestIdleCallback(callback, $$(options))
    });
};
/* EXPORT */
export default useIdleCallback;
