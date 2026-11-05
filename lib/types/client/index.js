/**
 * wj-dsh-mobile — browser half.
 *
 * Installs the portrait-touch adaptation layer (touch targets, safe areas,
 * whale sidebar button, swipe gestures, desktop-surface suppression) and wires
 * its two host hooks: the official layout service (sidebar toggle / details
 * close) and a tiny label seat for the whale button.
 */
import { startMobileAdapt } from "./mobile-adapt.js";
export const inject = ['layout'];
export function apply(ctx) {
    startMobileAdapt();
    const win = window;
    const adapt = win.__dshRemoteAdapt;
    const layout = ctx.get('layout');
    const call = (fn) => {
        try {
            fn?.();
        }
        catch {
            // Boot-order throw before the root entry mounts: a no-op.
        }
    };
    if (adapt !== undefined && layout !== undefined) {
        if (typeof layout.toggleSidebar === 'function')
            adapt.toggleSidebar = () => call(layout.toggleSidebar);
        if (typeof layout.closeDetails === 'function')
            adapt.closeDetails = () => call(layout.closeDetails);
    }
    if (adapt !== undefined && adapt.toggleSidebar === null) {
        adapt.toggleSidebar = () => {
            document.querySelector('[class$="_railFish"] button, [class$="_logoRow"] [class*="_iconButton"]')?.click();
        };
    }
    const zh = typeof navigator !== 'undefined' && (navigator.language ?? '').toLowerCase().startsWith('zh');
    if (adapt !== undefined) {
        adapt.translate = (key) => (zh && key === 'mobile.whale.open' ? '打开侧栏' : '');
    }
    ctx.effect?.(() => () => {
        win.__dshRemoteAdapt?.setEnabled?.(false);
    }, 'wj-dsh-mobile: adapt');
}
