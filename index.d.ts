declare module 'simple-in-js' {
    export function css(rules: TemplateStringsArray, ...res: any[]): string;
    export function useCSS(rules: TemplateStringsArray, ...res: any[]): {with: (...res: string[]) => string, name: string, toString: () => string, [key: string]: string}
}