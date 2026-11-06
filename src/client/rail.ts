/**
 * Minimal portrait rail: hide the left rail and keep one draggable round button.
 *
 * The button carries the DSH product mark (the shell favicon), floats over the
 * page, can be dragged anywhere and remembers its position. A tap (no drag)
 * toggles the sidebar through the official layout service.
 */
const STYLE_ID = 'wj-mini-rail-style'
const BUTTON_ID = 'wj-mini-rail-toggle'
const BODY_CLASS = 'wj-mini-rail'
const POS_KEY = 'wj-mini-rail-pos'

const DSH_PATH = 'path'

const CSS = `
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed]{grid-template-columns:minmax(0,1fr)!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{display:none!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_centerCol"]{grid-column:1/-1!important}
body.${BODY_CLASS} [class$="_frame"][data-rightbar-fullscreen] [class*="_rightbarCol"]{display:block!important;position:fixed!important;inset:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;z-index:2147482600!important;background:var(--dsw-alias-bg-base)!important;transform:none!important;opacity:1!important;pointer-events:auto!important;box-shadow:-8px 0 24px rgba(0,0,0,.18)!important}
#${BUTTON_ID}{position:fixed;z-index:2147482999;display:flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;border:1px solid var(--dsw-alias-border-l3);border-radius:50%;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.10);cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none}
#${BUTTON_ID}:active{cursor:grabbing;opacity:.86}
#${BUTTON_ID} svg{width:22px;height:22px;display:block}
`

export interface MobileRailHandle {
  toggleSidebar: (() => void) | null
  dispose: () => void
}

function shouldActivate(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(orientation: portrait)').matches) return false
  if (!window.matchMedia('(pointer: coarse)').matches) return false
  return window.innerWidth < 1100
}

export function startMobileRail(): MobileRailHandle {
  const handle: MobileRailHandle = { toggleSidebar: null, dispose: () => {} }
  if (typeof window === 'undefined' || typeof document === 'undefined') return handle

  let active = false
  let button: HTMLButtonElement | null = null
  let pos: { left: number; top: number } | null = null

  const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value))

  const readPos = (): { left: number; top: number } => {
    try {
      const raw = window.localStorage.getItem(POS_KEY)
      if (raw !== null) {
        const parsed = JSON.parse(raw) as { left?: unknown; top?: unknown }
        if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
          return { left: parsed.left, top: parsed.top }
        }
      }
    } catch { /* fall through */ }
    return { left: 10, top: 8 }
  }

  const applyPos = (el: HTMLElement): void => {
    const p = pos ?? (pos = readPos())
    const left = clamp(p.left, 4, window.innerWidth - 44)
    const top = clamp(p.top, 4, window.innerHeight - 44)
    el.style.left = `${left}px`
    el.style.top = `${top}px`
  }

  const savePos = (): void => {
    if (pos === null) return
    try { window.localStorage.setItem(POS_KEY, JSON.stringify(pos)) } catch { /* ignore */ }
  }

  const ensureStyle = (): void => {
    if (document.getElementById(STYLE_ID) !== null) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.dataset.plugin = 'wj-dsh-mobile'
    style.textContent = CSS
    document.head.appendChild(style)
  }

  const toggle = (): void => {
    try { handle.toggleSidebar?.() } catch { /* boot-order */ }
  }

  const ensureButton = (): void => {
    if (button !== null && button.isConnected) return
    const el = document.createElement('button')
    el.id = BUTTON_ID
    el.type = 'button'
    el.setAttribute('aria-label', '打开侧栏')
    el.innerHTML = `<svg viewBox="0 0 50 50" fill="currentColor" aria-hidden="true"><path d="${DSH_PATH}"/></svg>`
    let drag: { id: number; x: number; y: number; left: number; top: number; moved: boolean } | null = null
    el.addEventListener('pointerdown', (event) => {
      const rect = el.getBoundingClientRect()
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false }
      el.setPointerCapture(event.pointerId)
      event.preventDefault()
    })
    el.addEventListener('pointermove', (event) => {
      if (drag === null || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true
      if (!drag.moved) return
      pos = { left: clamp(drag.left + dx, 4, window.innerWidth - 44), top: clamp(drag.top + dy, 4, window.innerHeight - 44) }
      el.style.left = `${pos.left}px`
      el.style.top = `${pos.top}px`
    })
    const finish = (event: PointerEvent): void => {
      if (drag === null || event.pointerId !== drag.id) return
      const moved = drag.moved
      drag = null
      try { el.releasePointerCapture(event.pointerId) } catch { /* ignore */ }
      if (moved) savePos()
      else toggle()
    }
    el.addEventListener('pointerup', finish)
    el.addEventListener('pointercancel', (event) => {
      if (drag !== null && event.pointerId === drag.id) { drag = null; savePos() }
    })
    document.body.appendChild(el)
    button = el
    applyPos(el)
  }

  const apply = (): void => {
    const next = shouldActivate()
    if (next === active) return
    active = next
    if (active) {
      document.body.classList.add(BODY_CLASS)
      ensureStyle()
      ensureButton()
    } else {
      document.body.classList.remove(BODY_CLASS)
      document.getElementById(STYLE_ID)?.remove()
      button?.remove()
      button = null
    }
  }

  const onResize = (): void => {
    if (button !== null) applyPos(button)
    apply()
  }

  handle.dispose = (): void => {
    if (active) apply()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  apply()
  return handle
}
