/**
 * Style class for handling CSS properties in SSR
 */
export class Style {
    [key: string]: any

    constructor() {
        // Add setProperty method for CSS custom properties
        this.setProperty = (name: string, value: string) => {
            this[name] = value
        }
    }

    setProperty(name: string, value: string): void {
        this[name] = value
    }

    removeProperty(name: string): void {
        delete this[name]
    }
}
