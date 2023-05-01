declare const classesToggle: <T extends {
    className: string;
    classList: any;
}, K extends keyof T, V extends T[K]>(props: T, classes: string, force: null | undefined | boolean) => void;
export { classesToggle };
