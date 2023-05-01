/* IMPORT */
import useCleanup from './use_cleanup.js';
import $$ from '../methods/SS.js';
import untrack from '../methods/untrack.js';
/* MAIN */
const useScheduler = ({ loop, callback, cancel, schedule }) => {
    let tickId;
    const work = (value) => {
        if ($$(loop))
            tick();
        $$(callback, false)(value);
    };
    const tick = () => {
        tickId = untrack(() => schedule(work));
    };
    const dispose = () => {
        untrack(() => cancel(tickId));
    };
    tick();
    useCleanup(dispose);
    return dispose;
};
/* EXPORT */
export default useScheduler;
