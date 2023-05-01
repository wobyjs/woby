/* IMPORT */
import SuspenseContext from './suspense.context.js';
import useMemo from '../hooks/use_memo.js';
import resolve from '../methods/resolve.js';
import $$ from '../methods/SS.js';
import { suspense as _suspense, ternary } from '../oby.js';
/* MAIN */
const Suspense = ({ when, fallback, children }) => {
    return useMemo(() => {
        const suspense = SuspenseContext.new();
        const condition = useMemo(() => !!$$(when) || suspense.active());
        const childrenSuspended = _suspense(condition, () => resolve(children));
        return ternary(condition, fallback, childrenSuspended);
    });
};
/* EXPORT */
export default Suspense;
