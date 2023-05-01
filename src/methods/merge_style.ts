import { isObject } from '../utils/lang';
import { CSSProperties } from '../types';

export function mergeStyles(style: string | CSSProperties | StyleProperties = {}, css: string | CSSProperties | StyleProperties = ""): CSSProperties & StyleProperties {
  // Regular expression to match CSS property-value pairs
  const re = /([^:;]+)\s*:\s*([^;(]+(?:\(.*?\))?);?/igm;

  const genObj = (css: string | CSSProperties | StyleProperties = ""): CSSProperties & StyleProperties => {
    let match;

    if (isObject(css))
      return css as CSSProperties & StyleProperties;
    else {
      const style = {} as CSSProperties & StyleProperties;

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
