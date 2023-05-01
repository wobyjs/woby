/* IMPORT */
import useGuarded from './use_guarded.js';
import { isTruthy } from '../utils/lang.js';
/* MAIN */
//TODO: Maybe port this to oby
const useTruthy = (value) => {
    return useGuarded(value, isTruthy);
};
/* EXPORT */
export default useTruthy;
