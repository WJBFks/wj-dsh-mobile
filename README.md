# wj-dsh-mobile

Portrait-touch adaptation layer for the DeepSeek Harness Web GUI, extracted
from `wj-dsh-remote`.

**Status: archived.** Every adaptation rule is parked under `archive/` and the
runtime half is a no-op. The plugin keeps its bundle row so pieces can be
recalled without re-introducing the package; see
[`archive/README.md`](archive/README.md) for the inventory, the former wiring,
and the recall checklist.

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
