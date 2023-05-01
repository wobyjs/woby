/* IMPORT */
import { SYMBOL_SUSPENSE } from '../constants.js';
import useMemo from '../hooks/use_memo.js';
import $ from '../methods/S.js';
import { context } from '../oby.js';
/* MAIN */
const SuspenseContext = {
    new: () => {
        const data = SuspenseContext.create();
        SuspenseContext.set(data);
        return data;
    },
    create: () => {
        const parent = SuspenseContext.get();
        const count = $(0);
        const active = useMemo(() => !!count());
        const increment = (nr = 1) => { parent?.increment(nr); count(prev => prev + nr); };
        const decrement = (nr = -1) => queueMicrotask(() => { parent?.decrement(nr); count(prev => prev + nr); });
        const data = { active, increment, decrement };
        return data;
    },
    get: () => {
        return context(SYMBOL_SUSPENSE);
    },
    set: (data) => {
        return context(SYMBOL_SUSPENSE, data);
    }
};
/* EXPORT */
export default SuspenseContext;
