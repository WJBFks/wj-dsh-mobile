# wj-dsh-mobile

Portrait-touch adaptation layer for the DeepSeek Harness Web GUI, extracted from
`wj-dsh-remote`.

While a touch device is in portrait and the viewport is under 1100px the plugin
injects a CSS + gesture layer over the official GUI: 44px touch targets, 16px
inputs (no iOS focus zoom), safe-area padding, a draggable whale button as the
collapsed-sidebar entry, swipe gestures, long-press session menus, and desktop
surface suppression. Landscape, desktop and wide viewports are untouched.

Opt out manually: `sessionStorage['wj-dsh-mobile-force-desktop'] = '1'`.

## Install

```bash
dsh plugin --profile web add github:WJBFks/wj-dsh-mobile
```

Then restart the profile once (a new bundle row must be loaded).

## Layout

- `src/client/mobile-adapt.ts` — the layer itself (DOM/CSS/gestures)
- `src/client/index.ts` — mounts it and wires the official `layout` service
- `src/index.ts` — empty host half (the bundle needs a node-side entry)
- `cordis.patch.yml` — inserts the single plugin row

## Build

```bash
pnpm install
pnpm build   # tsc -b && tsdown (uses ../../shared/tsdown.client.ts in the monorepo workspace)
```

## License

Apache-2.0. See LICENSE and NOTICE (extracted from wj-dsh-remote, which derives
from @linxin666/dsh-remote-web-ui).
