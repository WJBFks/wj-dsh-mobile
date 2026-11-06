/**
 * wj-dsh-mobile — browser half.
 *
 * Currently active adaptation: the portrait rail replacement (hide the icon
 * rail, pin one sidebar button where it was). The full touch layer stays
 * archived under /archive and can be recalled piece by piece.
 */
import { startMobileRail, type MobileRailHandle } from './rail.ts'
import { createUsagePill } from './usage-pill.tsx'

export const inject = ['layout', 'slots']

interface MobileClientContext {
  get(name: string): unknown
  effect?(factory: () => () => void, label?: string): void
}

export function apply(ctx: MobileClientContext): void {
  const rail: MobileRailHandle = startMobileRail()
  const layout = ctx.get('layout') as { toggleSidebar?: () => void } | undefined
  if (typeof layout?.toggleSidebar === 'function') {
    rail.toggleSidebar = () => {
      try {
        layout.toggleSidebar?.()
      } catch {
        // Boot-order throw before the root entry mounts: a no-op.
      }
    }
  }
  ctx.effect?.(() => () => rail.dispose(), 'wj-dsh-mobile: rail')

  // Compact OpenCode Go usage pill: only when that plugin's remote surface is
  // present, so the mobile layer stays independent of it.
  // OpenCode Go adaptation is a child plugin: when that plugin (or its remote
  // namespace) is absent this stays inactive and the rail keeps working.
  const pluginFn = (ctx as unknown as { plugin?: (plugin: unknown) => unknown }).plugin
  pluginFn?.call(ctx, {
    inject: ['remote', 'remote.opencodeGoUsage'],
    apply(child: unknown) {
      const childCtx = child as { slots?: any; remote?: any }
      const slots = childCtx.slots
      const remote = childCtx.remote
      if (slots === undefined || remote?.opencodeGoUsage === undefined) return
      slots.inject('conversation.input.right', () => {
        slots.register({
          name: 'conversation.input.right',
          id: 'wj-usage-pill',
          order: 1001,
          inject: () => ({}),
        }, createUsagePill(remote))
      })
    },
  })
}
