export declare function createContainer(type?: 'browser' | 'ssr' | 'via'): HTMLElement;
export declare function createHeading(text: string, type?: 'browser' | 'ssr' | 'via'): HTMLElement;
export declare function createElementFactory(type?: 'browser' | 'ssr' | 'via'): {
    div: () => HTMLElement;
    text: (content: string) => Text;
    heading: (text: string) => HTMLElement;
};
//# sourceMappingURL=practical_example.d.ts.map