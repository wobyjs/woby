/* IMPORT */
import useDisposed from './use_disposed.js';
import { with as _with } from '../oby.js';
/* MAIN */
const useMicrotask = (fn) => {
    const disposed = useDisposed();
    const runWithOwner = _with();
    queueMicrotask(() => {
        if (disposed())
            return;
        runWithOwner(fn);
    });
};
/* EXPORT */
export default useMicrotask;
