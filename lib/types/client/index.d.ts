export declare const inject: string[];
interface MobileClientContext {
    get(name: string): unknown;
    effect?(factory: () => () => void, label?: string): void;
}
export declare function apply(ctx: MobileClientContext): void;
export {};
//# sourceMappingURL=index.d.ts.map