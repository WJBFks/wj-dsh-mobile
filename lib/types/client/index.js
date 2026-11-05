/**
 * wj-dsh-mobile — browser half.
 *
 * Currently active adaptation: the portrait rail replacement (hide the icon
 * rail, pin one sidebar button where it was). The full touch layer stays
 * archived under /archive and can be recalled piece by piece.
 */
import { startMobileRail } from "./rail.js";
export const inject = ['layout'];
export function apply(ctx) {
    const rail = startMobileRail();
    const layout = ctx.get('layout');
    if (typeof layout?.toggleSidebar === 'function') {
        rail.toggleSidebar = () => {
            try {
                layout.toggleSidebar?.();
            }
            catch {
                // Boot-order throw before the root entry mounts: a no-op.
            }
        };
    }
    ctx.effect?.(() => () => rail.dispose(), 'wj-dsh-mobile: rail');
}
