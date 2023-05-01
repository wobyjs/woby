/* IMPORT */
import useAbortSignal from './use_abort_signal.js';
import useResolved from './use_resolved.js';
import useResource from './use_resource.js';
/* MAIN */
const useFetch = (request, init) => {
    return useResource(() => {
        return useResolved([request, init], (request, init = {}) => {
            const signal = useAbortSignal(init.signal || []);
            init.signal = signal;
            return fetch(request, init);
        });
    });
};
/* EXPORT */
export default useFetch;
