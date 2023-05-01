/* IMPORT */
import { forValue } from '../oby.js';
/* MAIN */
const ForValue = ({ values, fallback, children }) => {
    return forValue(values, children, fallback);
};
/* EXPORT */
export default ForValue;
