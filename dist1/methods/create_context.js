/* IMPORT */
import { CONTEXTS_DATA } from '../constants.js';
import useMemo from '../hooks/use_memo.js';
import resolve from './resolve.js';
import { context } from '../oby.js';
function createContext(defaultValue) {
    const symbol = Symbol();
    const Provider = ({ value, children }) => {
        return useMemo(() => {
            register(value);
            return resolve(children);
        });
    };
    const register = (value) => {
        context(symbol, value);
    };
    const Context = { Provider, register };
    CONTEXTS_DATA.set(Context, { symbol, defaultValue });
    return Context;
}
/* EXPORT */
export default createContext;
