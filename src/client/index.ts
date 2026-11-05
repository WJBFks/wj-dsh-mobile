/**
 * wj-dsh-mobile — browser half.
 *
 * Currently active adaptation: the portrait rail replacement (hide the icon
 * rail, pin one sidebar button where it was). The full touch layer stays
 * archived under /archive and can be recalled piece by piece.
 */
import { startMobileRail, type MobileRailHandle } from './rail.ts'

export const inject = ['layout']

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
}
