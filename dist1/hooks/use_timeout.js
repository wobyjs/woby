/* IMPORT */
import useScheduler from './use_scheduler.js';
import $$ from '../methods/SS.js';
/* MAIN */
const useTimeout = (callback, ms) => {
    return useScheduler({
        callback,
        cancel: clearTimeout,
        schedule: callback => setTimeout(callback, $$(ms))
    });
};
/* EXPORT */
export default useTimeout;
