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
  const dbg = (window as unknown as { __wjMobileDebug?: Record<string, unknown> }).__wjMobileDebug ??= {}
  dbg.apply = true
  const ctxAny = ctx as unknown as { inject?: (deps: string[], fn: (scope: any) => void) => void; remote?: any; slots?: any }
  dbg.hasInject = typeof ctxAny.inject === 'function'
  dbg.hasRemote = ctxAny.remote !== undefined
  dbg.hasUsageNs = ctxAny.remote?.opencodeGoUsage !== undefined
  ctxAny.inject?.(['remote'], (r: any) => {
    dbg.remoteInjected = true
    dbg.rHasInject = typeof r.inject === 'function'
    dbg.rHasSlots = r.slots !== undefined
    dbg.rHasUsageNs = r.remote?.opencodeGoUsage !== undefined
    r.inject?.(['remote.opencodeGoUsage'], (ready: any) => {
      dbg.usageInjected = true
      const slots = ready.slots ?? r.slots ?? ctxAny.slots
      const remote = ready.remote ?? r.remote ?? ctxAny.remote
      if (slots === undefined || remote?.opencodeGoUsage === undefined) return
      slots.inject('conversation.input.right', () => {
        dbg.registered = true
        slots.register({
          name: 'conversation.input.right',
          id: 'wj-usage-pill',
          order: 1001,
          inject: () => ({}),
        }, createUsagePill(remote as never))
      })
    })
  })
}
