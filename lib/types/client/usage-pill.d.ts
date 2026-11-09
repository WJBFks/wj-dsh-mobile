export declare function createUsagePill(remote: {
    opencodeGoUsage: {
        read(): Promise<{
            ok: boolean;
            value?: {
                rolling?: {
                    percent?: number;
                };
                weekly?: {
                    percent?: number;
                };
                monthly?: {
                    percent?: number;
                };
            };
        }>;
    };
}): () => JSX.Element | null;
//# sourceMappingURL=usage-pill.d.ts.map