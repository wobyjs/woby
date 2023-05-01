/* IMPORT */
import useAbortController from './use_abort_controller.js';
/* MAIN */
const useAbortSignal = (signals = []) => {
    return useAbortController(signals).signal;
};
/* EXPORT */
export default useAbortSignal;
