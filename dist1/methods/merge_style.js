import { isObject } from '../utils/lang.js';
export function mergeStyles(style = {}, css = "") {
    // Regular expression to match CSS property-value pairs
    const re = /([^:;]+)\s*:\s*([^;(]+(?:\(.*?\))?);?/igm;
    const genObj = (css = "") => {
        let match;
        if (isObject(css))
            return css;
        else {
            const style = {};
            // Loop over each match in the CSS string
            while ((match = re.exec(css))) {
                const [, property, value] = match;
                // Trim leading/trailing whitespace from property and value
                const trimmedProperty = property.trim();
                const trimmedValue = value.trim();
                // Set the property in the style object
                style[trimmedProperty] = trimmedValue;
            }
            return style;
        }
    };
    const sty = genObj(style);
    return Object.assign(sty, genObj(css));
}
