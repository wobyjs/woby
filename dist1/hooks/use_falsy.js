/* IMPORT */
import useGuarded from './use_guarded.js';
import { isFalsy } from '../utils/lang.js';
/* MAIN */
//TODO: Maybe port this to oby
const useFalsy = (value) => {
    return useGuarded(value, isFalsy);
};
/* EXPORT */
export default useFalsy;
