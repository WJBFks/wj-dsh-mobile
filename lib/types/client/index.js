/**
 * wj-dsh-mobile — browser half.
 *
 * Currently active adaptation: the portrait rail replacement (hide the icon
 * rail, pin one sidebar button where it was). The full touch layer stays
 * archived under /archive and can be recalled piece by piece.
 */
import { startMobileRail } from "./rail.js";
import { createUsagePill } from "./usage-pill.js";
export const inject = ['layout', 'slots', 'remote', 'remote.opencodeGoUsage'];
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
    // Compact OpenCode Go usage pill: only when that plugin's remote surface is
    // present, so the mobile layer stays independent of it.
    const ctxAny = ctx;
    const slots = ctxAny.slots ?? ctxAny.get?.('slots');
    const remote = ctxAny.remote ?? ctxAny.get?.('remote');
    if (slots !== undefined && remote?.opencodeGoUsage !== undefined) {
        slots.inject('conversation.input.right', () => {
            slots.register({
                name: 'conversation.input.right',
                id: 'wj-usage-pill',
                order: 1001,
                inject: () => ({}),
            }, createUsagePill(remote));
        });
    }
}
