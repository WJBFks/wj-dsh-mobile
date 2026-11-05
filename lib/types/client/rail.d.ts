export interface MobileRailHandle {
    toggleSidebar: (() => void) | null;
    setEnabled: (enabled: boolean) => void;
    dispose: () => void;
}
/** Install the rail replacement; returns the handle to wire/dispose. */
export declare function startMobileRail(): MobileRailHandle;
//# sourceMappingURL=rail.d.ts.map