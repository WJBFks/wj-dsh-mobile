# wj-dsh-mobile

Portrait-touch adaptation layer for the DeepSeek Harness Web GUI, extracted
from `wj-dsh-remote`.

**Status: one active adaptation, the rest archived.** The portrait rail
replacement is live: on a portrait touch viewport the official 56px icon rail
is hidden and a single floating button at the same spot opens the sidebar
drawer. Everything else stays parked under `archive/`; see
[`archive/README.md`](archive/README.md) for the inventory and recall steps.

## Layout

```text
archive/mobile-adapt.ts   the whole touch layer (CSS, gestures, whale button)
archive/README.md         what it did, how to recall it
src/client/index.ts       no-op client entry
src/index.ts              no-op host entry
cordis.patch.yml          single plugin row
```

## Install

```bash
dsh plugin --profile web add github:WJBFks/wj-dsh-mobile
```

No restart is needed for a client-only change; refresh the page.

## Build

```bash
pnpm install
pnpm build   # tsc -b && tsdown (uses ../../shared/tsdown.client.ts in the workspace)
```

## License

Apache-2.0. See LICENSE and NOTICE.
