/* IMPORT */
import untrack from '../methods/untrack.js';
import { tryCatch } from 'oby';
import { isFunction } from '../utils/lang.js';
/* MAIN */
const ErrorBoundary = ({ fallback, children }) => {
    return tryCatch(children, props => untrack(() => isFunction(fallback) ? fallback(props) : fallback));
};
/* EXPORT */
export default ErrorBoundary;
