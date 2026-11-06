/**
 * wj-dsh-mobile — browser half.
 *
 * Currently active adaptation: the portrait rail replacement (hide the icon
 * rail, pin one sidebar button where it was). The full touch layer stays
 * archived under /archive and can be recalled piece by piece.
 */
import { startMobileRail } from "./rail.js";
import { createUsagePill } from "./usage-pill.js";
export const inject = ['layout', 'slots'];
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
    const dbg = window.__wjMobileDebug ??= {};
    dbg.apply = true;
    const ctxAny = ctx;
    dbg.hasInject = typeof ctxAny.inject === 'function';
    dbg.hasRemote = ctxAny.remote !== undefined;
    dbg.hasUsageNs = ctxAny.remote?.opencodeGoUsage !== undefined;
    ctxAny.inject?.(['remote'], (r) => {
        dbg.remoteInjected = true;
        dbg.rHasInject = typeof r.inject === 'function';
        dbg.rHasSlots = r.slots !== undefined;
        dbg.rHasUsageNs = r.remote?.opencodeGoUsage !== undefined;
        r.inject?.(['remote.opencodeGoUsage'], (ready) => {
            dbg.usageInjected = true;
            const slots = ready.slots ?? r.slots ?? ctxAny.slots;
            const remote = ready.remote ?? r.remote ?? ctxAny.remote;
            if (slots === undefined || remote?.opencodeGoUsage === undefined)
                return;
            slots.inject('conversation.input.right', () => {
                dbg.registered = true;
                slots.register({
                    name: 'conversation.input.right',
                    id: 'wj-usage-pill',
                    order: 1001,
                    inject: () => ({}),
                }, createUsagePill(remote));
            });
        });
    });
}
