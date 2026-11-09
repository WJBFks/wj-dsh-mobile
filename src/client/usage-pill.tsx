/**
 * Compact OpenCode Go usage pill (phone only).
 *
 * Replaces the official three-number capsule with one rotating figure:
 * 日 0% -> 周 43% -> 月 71%, switching every five seconds. Data comes from the
 * plugin's own remote surface (`remote.opencodeGoUsage.read()`), so nothing is
 * parsed out of the DOM.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

interface UsageNumbers {
  rolling: number
  weekly: number
  monthly: number
}

let current: UsageNumbers | null = null
const listeners = new Set<() => void>()
const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
const snapshot = (): UsageNumbers | null => current
const publish = (next: UsageNumbers | null): void => {
  current = next
  for (const listener of listeners) listener()
}

const LABELS = ['日', '周', '月'] as const

const CSS = `
body.wj-mini-rail .wj-usage-pill{display:inline-flex;align-items:center;justify-content:center;min-width:52px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}
.wj-hide-official-pill{display:none!important}
body.wj-mini-rail button[aria-label*="OpenCode Go"]:not(.wj-usage-pill){position:absolute!important;left:-9999px!important;top:0!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
body.wj-mini-rail .wj-usage-pill{border:1px solid var(--dsw-alias-border-l2);cursor:pointer}
body.wj-mini-rail .mAjYhq_panel{position:fixed!important;left:8px!important;right:8px!important;top:auto!important;bottom:var(--wj-ocg-panel-bottom,8px)!important;width:auto!important;max-width:none!important;max-height:min(48dvh,calc(100dvh - var(--wj-ocg-panel-bottom,8px) - 16px))!important;overflow:auto!important;transform:none!important;z-index:1020!important}
`

/** Install the shared stylesheet once. */
function ensureStyle(): void {
  if (document.getElementById('wj-usage-pill-style') !== null) return
  const style = document.createElement('style')
  style.id = 'wj-usage-pill-style'
  style.dataset.plugin = 'wj-dsh-mobile'
  style.textContent = CSS
  document.head.appendChild(style)
}

/**
 * Keep the panel just above the composer: its bottom edge tracks the composer's
 * top edge, so the sheet opens over the conversation rather than the input.
 */
function updatePanelOffset(): void {
  const composer = document.querySelector('[class$="_composerSeat"]') ?? document.querySelector('[class*="_composer"]')
  const rect = composer?.getBoundingClientRect()
  const offset = rect === undefined ? 8 : Math.max(8, Math.round(window.innerHeight - rect.top + 8))
  document.documentElement.style.setProperty('--wj-ocg-panel-bottom', `${offset}px`)
}

/** Hide the official three-number capsule without touching its code. */
function hideOfficialPill(): void {
  const roots = document.querySelectorAll('[data-slot="conversation.input.right"], [class$="_composerSeat"]')
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode()) !== null) {
      const text = node.textContent ?? ''
      if (!/%\s*·\s*\d+%|%\s*·\s*[A-Za-z0-9]/.test(text)) continue
      const holder = node.parentElement?.closest('button, [class*="_pill"], [class*="_usage"]')
      if (holder === null || holder === undefined) continue
      if (holder.closest('.wj-usage-pill') !== null) continue
      holder.classList.add('wj-hide-official-pill')
    }
  }
}

/**
 * Build the slot component bound to one remote surface.
 * @param remote - the injected `remote.opencodeGoUsage` face.
 * @returns the React component registered in the composer slot.
 */
/** Portrait touch viewport: the same rule the rail layer uses. */
function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(pointer: coarse)').matches) return false
  if (!window.matchMedia('(orientation: portrait)').matches) return false
  return window.innerWidth < 1100
}

/** Reactive portrait-touch flag; false on any desktop viewport. */
function useMobileViewport(): boolean {
  const [active, setActive] = useState<boolean>(() => isMobileViewport())
  useEffect(() => {
    const update = (): void => { setActive(isMobileViewport()) }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return active
}

export function createUsagePill(remote: { opencodeGoUsage: { read(): Promise<{ ok: boolean; value?: { rolling?: { percent?: number }; weekly?: { percent?: number }; monthly?: { percent?: number } } }> } }): () => JSX.Element | null {
  ensureStyle()
  const refresh = async (): Promise<void> => {
    try {
      const result = await remote.opencodeGoUsage.read()
      if (!result.ok || result.value === undefined) return
      const read = (window: { percent?: number } | undefined): number => Math.max(0, Math.min(100, Math.round(window?.percent ?? 0)))
      publish({
        rolling: read(result.value.rolling),
        weekly: read(result.value.weekly),
        monthly: read(result.value.monthly),
      })
    } catch {
      // Keep the last reading.
    }
  }
  void refresh()
  window.setInterval(() => { void refresh() }, 60_000)

  return function CompactUsagePill() {
    const mobile = useMobileViewport()
    const usage = useSyncExternalStore(subscribe, snapshot, snapshot)
    const [index, setIndex] = useState(0)
    useEffect(() => {
      const timer = window.setInterval(() => { setIndex(value => (value + 1) % 3) }, 5_000)
      return () => { window.clearInterval(timer) }
    }, [])
    useEffect(() => {
      if (!mobile) return
      updatePanelOffset()
      const onResize = (): void => { updatePanelOffset() }
      window.addEventListener('resize', onResize)
      return () => { window.removeEventListener('resize', onResize) }
    }, [mobile])
    useEffect(() => {
      if (!mobile) return
      hideOfficialPill()
      const observer = new MutationObserver(() => { hideOfficialPill() })
      observer.observe(document.body, { childList: true, subtree: true })
      return () => { observer.disconnect() }
    }, [mobile])
    const ref = useRef<HTMLButtonElement | null>(null)
    const hadPanel = useRef(false)
    if (!mobile || usage === null) return null
    const values = [usage.rolling, usage.weekly, usage.monthly]
    const openOfficial = (): void => {
      // Already open before this gesture (the outside pointerdown may have
      // dismissed it already): do not forward another open click.
      if (hadPanel.current || document.querySelector('[role="dialog"]') !== null) {
        hadPanel.current = false
        const escape = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true } as KeyboardEventInit)
        document.dispatchEvent(escape)
        window.dispatchEvent(escape)
        return
      }
      updatePanelOffset()
      const official = document.querySelector('button[aria-label*="OpenCode Go"]:not(.wj-usage-pill)') as HTMLButtonElement | null
      if (official === null || ref.current === null) return
      const rect = ref.current.getBoundingClientRect()
      const previous = official.getAttribute('style') ?? ''
      official.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:1px;height:1px;opacity:0;pointer-events:auto`
      official.click()
      window.setTimeout(() => { official.setAttribute('style', previous) }, 0)
    }
    return (
      <button
        ref={ref}
        type="button"
        className="wj-usage-pill"
        aria-label="OpenCode Go usage"
        onPointerDown={() => { hadPanel.current = document.querySelector('[role="dialog"]') !== null }}
        onClick={openOfficial}
      >
        {LABELS[index]} {values[index]}%
      </button>
    )
  }
}
