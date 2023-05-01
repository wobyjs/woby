/* IMPORT */
import useScheduler from './use_scheduler.js';
import $$ from '../methods/SS.js';
/* MAIN */
const useInterval = (callback, ms) => {
    return useScheduler({
        callback,
        cancel: clearInterval,
        schedule: callback => setInterval(callback, $$(ms))
    });
};
/* EXPORT */
export default useInterval;
