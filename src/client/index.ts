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
  dbg.hasInject = typeof (ctx as unknown as { inject?: unknown }).inject === 'function'
  const injectFn = (ctx as unknown as { inject?: (deps: string[], fn: (scope: unknown) => void) => void }).inject
  injectFn?.call(ctx, ['remote.opencodeGoUsage'], (scope: unknown) => {
    const mounted = scope as {
      slots?: { inject(name: string, fn: () => void): void; register(entry: Record<string, unknown>, component: unknown): void }
      remote?: { opencodeGoUsage?: unknown }
    }
    const slots = mounted.slots ?? (ctx as unknown as { slots?: typeof mounted.slots }).slots
    const remote = mounted.remote ?? (ctx as unknown as { remote?: typeof mounted.remote }).remote
    dbg.scope = true
    dbg.hasSlots = slots !== undefined
    dbg.hasUsage = remote?.opencodeGoUsage !== undefined
    if (slots === undefined || remote?.opencodeGoUsage === undefined) return
    dbg.registered = true
    slots.inject('conversation.input.right', () => {
      slots.register({
        name: 'conversation.input.right',
        id: 'wj-usage-pill',
        order: 1001,
        inject: () => ({}),
      }, createUsagePill(remote as never))
    })
  })
}
