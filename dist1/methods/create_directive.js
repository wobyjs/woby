/* IMPORT */
import { DIRECTIVE_OUTSIDE_SUPER_ROOT, SYMBOLS_DIRECTIVES } from '../constants.js';
import useMemo from '../hooks/use_memo.js';
import resolve from './resolve.js';
import { context, owner } from '../oby.js';
import '../jsx/types.js';
/* MAIN */
const createDirective = (name, fn, options) => {
    const immediate = !!options?.immediate;
    const data = { fn, immediate };
    const symbol = SYMBOLS_DIRECTIVES[name] || (SYMBOLS_DIRECTIVES[name] = Symbol());
    const Provider = ({ children }) => {
        return useMemo(() => {
            register();
            return resolve(children);
        });
    };
    const ref = (...args) => {
        return (element) => {
            fn(element, ...args);
        };
    };
    const register = () => {
        DIRECTIVE_OUTSIDE_SUPER_ROOT.current || (DIRECTIVE_OUTSIDE_SUPER_ROOT.current = !owner().isSuperRoot);
        context(symbol, data);
    };
    return { Provider, ref, register };
};
/* EXPORT */
export default createDirective;
