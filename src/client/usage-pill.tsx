/**
 * Compact OpenCode Go usage pill (phone only).
 *
 * Replaces the official three-number capsule with one rotating figure:
 * 日 0% -> 周 43% -> 月 71%, switching every five seconds. Data comes from the
 * plugin's own remote surface (`remote.opencodeGoUsage.read()`), so nothing is
 * parsed out of the DOM.
 */
import { useEffect, useState, useSyncExternalStore } from 'react'

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
.wj-usage-pill{display:inline-flex;align-items:center;justify-content:center;min-width:52px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}
.wj-hide-official-pill{display:none!important}
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
    const usage = useSyncExternalStore(subscribe, snapshot, snapshot)
    const [index, setIndex] = useState(0)
    useEffect(() => {
      const timer = window.setInterval(() => { setIndex(value => (value + 1) % 3) }, 5_000)
      return () => { window.clearInterval(timer) }
    }, [])
    useEffect(() => {
      hideOfficialPill()
      const observer = new MutationObserver(() => { hideOfficialPill() })
      observer.observe(document.body, { childList: true, subtree: true })
      return () => { observer.disconnect() }
    }, [])
    if (usage === null) return null
    const values = [usage.rolling, usage.weekly, usage.monthly]
    return (
      <div className="wj-usage-pill" role="status" aria-live="off">
        {LABELS[index]} {values[index]}%
      </div>
    )
  }
}
