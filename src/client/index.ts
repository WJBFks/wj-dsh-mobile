/**
 * wj-dsh-mobile — browser half.
 *
 * Installs the portrait-touch adaptation layer (touch targets, safe areas,
 * whale sidebar button, swipe gestures, desktop-surface suppression) and wires
 * its two host hooks: the official layout service (sidebar toggle / details
 * close) and a tiny label seat for the whale button.
 */
import { startMobileAdapt, type RemoteAdaptGlobal } from './mobile-adapt.ts'

export const inject = ['layout']

interface MobileClientContext {
  get(name: string): unknown
  effect?(factory: () => () => void, label?: string): void
}

export function apply(ctx: MobileClientContext): void {
  startMobileAdapt()
  const win = window as unknown as { __dshRemoteAdapt?: RemoteAdaptGlobal }
  const adapt = win.__dshRemoteAdapt
  const layout = ctx.get('layout') as { toggleSidebar?: () => void; closeDetails?: () => void } | undefined

  const call = (fn: (() => void) | undefined): void => {
    try {
      fn?.()
    } catch {
      // Boot-order throw before the root entry mounts: a no-op.
    }
  }

  if (adapt !== undefined && layout !== undefined) {
    if (typeof layout.toggleSidebar === 'function') adapt.toggleSidebar = () => call(layout.toggleSidebar)
    if (typeof layout.closeDetails === 'function') adapt.closeDetails = () => call(layout.closeDetails)
  }
  if (adapt !== undefined && adapt.toggleSidebar === null) {
    adapt.toggleSidebar = () => {
      (document.querySelector('[class$="_railFish"] button, [class$="_logoRow"] [class*="_iconButton"]') as HTMLElement | null)?.click()
    }
  }
  const zh = typeof navigator !== 'undefined' && (navigator.language ?? '').toLowerCase().startsWith('zh')
  if (adapt !== undefined) {
    adapt.translate = (key: string): string => (zh && key === 'mobile.whale.open' ? '打开侧栏' : '')
  }
  ctx.effect?.(() => () => {
    win.__dshRemoteAdapt?.setEnabled?.(false)
  }, 'wj-dsh-mobile: adapt')
}
