# Archived adaptations

Everything the plugin used to install is parked here, inert. The plugin's
runtime half is intentionally a no-op so the adaptation can be recalled one
piece at a time.

## What is archived

| File | Was |
|---|---|
| `mobile-adapt.ts` | The whole portrait-touch layer: activation check (portrait + coarse pointer + `< 1100px`), injected CSS (touch targets, safe areas, type scale, nav/composer compaction, desktop-surface suppression), the draggable whale sidebar button, swipe gestures, long-press session menus, and the `setEnabled` master switch. |

The former `src/client/index.ts` wiring (official `layout.toggleSidebar` /
`closeDetails`, the whale label seat, and the plugin-lifecycle teardown) lived
with it; it is reproduced at the bottom of this file for reference.

## How to recall

1. Move the file back into the build tree:
   `git mv archive/mobile-adapt.ts src/client/mobile-adapt.ts`
2. Restore the wiring in `src/client/index.ts` (see below).
3. Re-add the client inject list in `package.json` if you want the layout and
   locale modules ordered ahead of this plugin:
   `"inject": ["@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-ui-sidebar"]`
4. Rebuild (`pnpm build`), commit, publish, reinstall, and refresh the page.

## Reference wiring

```ts
import { startMobileAdapt, type RemoteAdaptGlobal } from './mobile-adapt.ts'

export const inject = ['layout']

export function apply(ctx) {
  startMobileAdapt()
  const win = window as unknown as { __dshRemoteAdapt?: RemoteAdaptGlobal }
  const adapt = win.__dshRemoteAdapt
  const layout = ctx.get('layout')
  const call = (fn) => { try { fn?.() } catch {} }
  if (adapt && layout) {
    if (typeof layout.toggleSidebar === 'function') adapt.toggleSidebar = () => call(layout.toggleSidebar)
    if (typeof layout.closeDetails === 'function') adapt.closeDetails = () => call(layout.closeDetails)
  }
  if (adapt && adapt.toggleSidebar === null) {
    adapt.toggleSidebar = () => {
      document.querySelector('[class$="_railFish"] button, [class$="_logoRow"] [class*="_iconButton"]')?.click()
    }
  }
  const zh = (navigator.language ?? '').toLowerCase().startsWith('zh')
  if (adapt) adapt.translate = (key) => (zh && key === 'mobile.whale.open' ? '打开侧栏' : '')
  ctx.effect?.(() => () => win.__dshRemoteAdapt?.setEnabled?.(false))
}
```

## Notes

- Manual opt-out key: `sessionStorage['wj-dsh-mobile-force-desktop'] = '1'`.
- The layer targets the official GUI's CSS-Modules semantic suffixes; re-run a
  real portrait QA round before recalling it onto a new DSH cohort.
