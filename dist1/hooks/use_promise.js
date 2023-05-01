/* IMPORT */
import useResource from './use_resource.js';
import $$ from '../methods/SS.js';
/* MAIN */
const usePromise = (promise) => {
    return useResource(() => $$(promise));
};
/* EXPORT */
export default usePromise;
