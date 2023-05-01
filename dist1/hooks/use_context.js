/* IMPORT */
import { CONTEXTS_DATA } from '../constants.js';
import { context } from '../oby.js';
import { isNil } from '../utils/lang.js';
function useContext(Context) {
    const { symbol, defaultValue } = CONTEXTS_DATA.get(Context) || { symbol: Symbol() };
    const valueContext = context(symbol);
    const value = isNil(valueContext) ? defaultValue : valueContext;
    return value;
}
/* EXPORT */
export default useContext;
