/* IMPORT */
import useMemo from '../hooks/use_memo.js';
import createElement from '../methods/create_element.js';
import resolve from '../methods/resolve.js';
import $$ from '../methods/SS.js';
/* MAIN */
const Dynamic = ({ component, props, children }) => {
    return useMemo(() => {
        return resolve(createElement($$(component, false), $$(props), children));
    });
};
/* EXPORT */
export default Dynamic;
