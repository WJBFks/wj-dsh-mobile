/**
 * Minimal portrait rail: hide the left rail and keep one draggable round button.
 *
 * The button carries the DSH product mark (the shell favicon), floats over the
 * page, can be dragged anywhere and remembers its position. A tap (no drag)
 * toggles the sidebar through the official layout service.
 */
const STYLE_ID = 'wj-mini-rail-style';
const BUTTON_ID = 'wj-mini-rail-toggle';
const BODY_CLASS = 'wj-mini-rail';
const POS_KEY = 'wj-mini-rail-pos';
const DSH_PATH = 'M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z';
const CSS = `
body.${BODY_CLASS} [class$="_frame"]{grid-template-columns:0 minmax(0,1fr) 0!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{transform:translateX(-100%)!important;opacity:0!important;pointer-events:none!important}
body.${BODY_CLASS} [class*="_centerCol"]{grid-column:1/-1!important}
body.${BODY_CLASS} nav[class*="_nav"]{width:64px!important;min-width:64px!important;max-width:64px!important;flex:0 0 64px!important;padding-left:0!important;padding-right:0!important}
body.${BODY_CLASS} [class*="_navList"]{width:64px!important;align-items:center!important;padding:36px 0 0!important;gap:6px!important}
body.${BODY_CLASS} [class*="_navTitle"]{position:absolute!important;left:12px!important;top:16px!important;width:max-content!important;max-width:calc(100% - 24px)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;z-index:5!important}
body.${BODY_CLASS} [class*="_navCell"]{justify-content:center!important;padding:0!important;width:44px!important;height:44px!important;margin:0 auto!important;border-radius:10px!important}
body.${BODY_CLASS} [class*="_navCell"] [class*="_navLabel"]{display:none!important}
body.${BODY_CLASS} .wj-settings-panel{position:fixed!important;inset:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;margin:0!important;border-radius:0!important}
body.${BODY_CLASS} .wj-settings-overlay{padding:0!important}
body.${BODY_CLASS} [class*="_sidebarCol"]{position:fixed!important;top:0!important;bottom:0!important;left:0!important;width:min(280px,86vw)!important;max-width:86vw!important;z-index:30!important;background:transparent!important;box-shadow:0 0 24px rgba(0,0,0,.22)!important;transition:transform .22s cubic-bezier(.4,0,.2,1),opacity .18s ease!important;transform:translateX(0);opacity:1}
body.${BODY_CLASS} [class$="_frame"][data-rightbar-fullscreen] [class*="_rightbarCol"]{display:block!important;position:fixed!important;inset:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;z-index:1010!important;background:var(--dsw-alias-bg-base)!important;transform:none!important;opacity:1!important;pointer-events:auto!important;box-shadow:-8px 0 24px rgba(0,0,0,.18)!important}
#${BUTTON_ID}{position:fixed;z-index:20;display:flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;border:1px solid var(--dsw-alias-border-l3);border-radius:50%;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.10);cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none}
#${BUTTON_ID}:active{cursor:grabbing;opacity:.86}
#${BUTTON_ID} svg{width:22px;height:22px;display:block}
`;
function shouldActivate() {
    if (typeof window === 'undefined')
        return false;
    if (!window.matchMedia('(orientation: portrait)').matches)
        return false;
    if (!window.matchMedia('(pointer: coarse)').matches)
        return false;
    return window.innerWidth < 1100;
}
export function startMobileRail() {
    const handle = { toggleSidebar: null, dispose: () => { } };
    if (typeof window === 'undefined' || typeof document === 'undefined')
        return handle;
    let active = false;
    let button = null;
    let pos = null;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const readPos = () => {
        try {
            const raw = window.localStorage.getItem(POS_KEY);
            if (raw !== null) {
                const parsed = JSON.parse(raw);
                if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
                    return { left: parsed.left, top: parsed.top };
                }
            }
        }
        catch { /* fall through */ }
        return { left: 10, top: 8 };
    };
    const applyPos = (el) => {
        const p = pos ?? (pos = readPos());
        const left = clamp(p.left, 4, window.innerWidth - 44);
        const top = clamp(p.top, 4, window.innerHeight - 44);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
    };
    const savePos = () => {
        if (pos === null)
            return;
        try {
            window.localStorage.setItem(POS_KEY, JSON.stringify(pos));
        }
        catch { /* ignore */ }
    };
    const ensureStyle = () => {
        const existing = document.getElementById(STYLE_ID);
        if (existing !== null) {
            if (existing.textContent !== CSS)
                existing.textContent = CSS;
            return;
        }
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.dataset.plugin = 'wj-dsh-mobile';
        style.textContent = CSS;
        document.head.appendChild(style);
    };
    const blurComposer = () => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement))
            return;
        if (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT' || active.isContentEditable)
            active.blur();
    };
    /**
     * Close with our own animation first: the official state flip unmounts the
     * sidebar content within a frame, which made the close look instant. Sliding
     * the live element for ~200ms and only then flipping keeps the content on
     * screen for the whole transition.
     */
    const closeWithAnimation = () => {
        const col = document.querySelector('[class*="_sidebarCol"]');
        if (col !== null && typeof col.animate === 'function') {
            try {
                col.animate([
                    { transform: 'translateX(0)', opacity: '1' },
                    { transform: 'translateX(-100%)', opacity: '0' },
                ], { duration: 200, easing: 'cubic-bezier(.4,0,.2,1)' });
            }
            catch { /* no WAAPI */ }
            window.setTimeout(() => {
                // The official outside-dismiss may have flipped the state already; a
                // second toggle here would reopen it (close -> reopen flicker).
                if (!sidebarOpen())
                    return;
                try {
                    handle.toggleSidebar?.();
                }
                catch { /* boot-order */ }
            }, 195);
            return;
        }
        try {
            handle.toggleSidebar?.();
        }
        catch { /* boot-order */ }
    };
    const toggle = () => {
        blurComposer();
        if (sidebarOpen()) {
            closeWithAnimation();
            return;
        }
        try {
            handle.toggleSidebar?.();
        }
        catch { /* boot-order */ }
    };
    /** Whether the expanded sidebar is currently mounted over the page. */
    const sidebarOpen = () => {
        const frame = document.querySelector('[class$="_frame"]');
        return frame !== null && !frame.hasAttribute('data-sidebar-collapsed');
    };
    /**
     * Tap anywhere outside the expanded sidebar to close it. Clicks inside the
     * sidebar, on our toggle, or inside a menu/dialog it opened are ignored.
     */
    const onCollapseClick = (event) => {
        if (!sidebarOpen())
            return;
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const button = target.closest('button[aria-label*="Collapse"], button[aria-label*="折叠"]');
        if (button === null || button.id === BUTTON_ID || button.closest('[class*="_sidebarCol"]') === null)
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        swallowedEnter = true;
        closeWithAnimation();
    };
    const onOutsidePointerDown = (event) => {
        if (!sidebarOpen())
            return;
        const target = event.target;
        if (!(target instanceof Element))
            return;
        if (target.closest(`#${BUTTON_ID}`) !== null)
            return;
        if (target.closest('[class*="_sidebarCol"]') !== null)
            return;
        if (target.closest('[role="menu"], [role="dialog"], [role="listbox"], [class*="_overlay"]') !== null)
            return;
        closeWithAnimation();
    };
    const ensureButton = () => {
        if (button !== null && button.isConnected)
            return;
        // Drop a button left by an earlier module instance (HMR swaps the module
        // without unmounting the DOM).
        document.getElementById(BUTTON_ID)?.remove();
        const el = document.createElement('button');
        el.id = BUTTON_ID;
        el.type = 'button';
        el.setAttribute('aria-label', '打开侧栏');
        el.innerHTML = `<svg viewBox="0 0 50 50" fill="currentColor" aria-hidden="true"><path d="${DSH_PATH}"/></svg>`;
        let drag = null;
        el.addEventListener('pointerdown', (event) => {
            const rect = el.getBoundingClientRect();
            drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
            el.setPointerCapture(event.pointerId);
            event.preventDefault();
        });
        el.addEventListener('pointermove', (event) => {
            if (drag === null || event.pointerId !== drag.id)
                return;
            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;
            if (!drag.moved && Math.hypot(dx, dy) > 4)
                drag.moved = true;
            if (!drag.moved)
                return;
            pos = { left: clamp(drag.left + dx, 4, window.innerWidth - 44), top: clamp(drag.top + dy, 4, window.innerHeight - 44) };
            el.style.left = `${pos.left}px`;
            el.style.top = `${pos.top}px`;
        });
        const finish = (event) => {
            if (drag === null || event.pointerId !== drag.id)
                return;
            const moved = drag.moved;
            drag = null;
            try {
                el.releasePointerCapture(event.pointerId);
            }
            catch { /* ignore */ }
            if (moved)
                savePos();
            else
                toggle();
        };
        el.addEventListener('pointerup', finish);
        el.addEventListener('pointercancel', (event) => {
            if (drag !== null && event.pointerId === drag.id) {
                drag = null;
                savePos();
            }
        });
        document.body.appendChild(el);
        button = el;
        applyPos(el);
    };
    /** Settings nav: icons only, the header carries the active section name. */
    const syncSettingsNav = () => {
        const nav = document.querySelector('nav[class*="_nav"]') ?? document.querySelector('[class*="_navList"]')?.parentElement ?? null;
        if (nav === null)
            return;
        const active = nav.querySelector('[class*="_navCell"][class*="_active"]');
        const title = nav.querySelector('[class*="_navTitle"] [data-slot="settings.header"]')
            ?? nav.querySelector('[class*="_navTitle"]');
        if (active === null || title === null)
            return;
        const label = active.querySelector('[class*="_navLabel"]')?.textContent?.trim() ?? '';
        if (label !== '' && title.textContent !== label)
            title.textContent = label;
        const panel = nav.closest('[role="dialog"]');
        if (panel !== null) {
            panel.classList.add('wj-settings-panel');
            panel.parentElement?.classList.add('wj-settings-overlay');
        }
    };
    /** Swallow the paired keyup so a keyup-based sender cannot fire either. */
    const onComposerKeyUp = (event) => {
        if (event.key !== 'Enter' || !swallowedEnter)
            return;
        swallowedEnter = false;
        if (event.target instanceof Element && event.target.closest('[class*="_composerSeat"], textarea, [contenteditable="true"]') === null)
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
    };
    /**
     * Mobile Enter inserts a line break instead of sending: capture keydown on
     * the composer, stop the app's send handler and insert the break manually.
     */
    let swallowedEnter = false;
    const onComposerKeyDown = (event) => {
        if (event.key !== 'Enter')
            return;
        if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey)
            return;
        if (event.isComposing)
            return;
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const composer = target.closest('[class*="_composerSeat"], textarea, [contenteditable="true"]');
        if (composer === null)
            return;
        if (target.closest('[class*="_overlay"], [role="dialog"]') !== null)
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        swallowedEnter = true;
        try {
            if (target instanceof HTMLTextAreaElement) {
                document.execCommand('insertText', false, String.fromCharCode(10));
                return;
            }
            target.dispatchEvent(new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertLineBreak',
            }));
        }
        catch {
            // No editing command available: leave the key blocked so it cannot send.
        }
    };
    let settingsTimer = null;
    const apply = () => {
        const next = shouldActivate();
        if (next === active)
            return;
        active = next;
        if (active) {
            document.body.classList.add(BODY_CLASS);
            ensureStyle();
            ensureButton();
            document.addEventListener('pointerdown', onOutsidePointerDown, true);
            window.addEventListener('keydown', onComposerKeyDown, true);
            window.addEventListener('keyup', onComposerKeyUp, true);
            document.addEventListener('click', onCollapseClick, true);
            if (settingsTimer === null)
                settingsTimer = window.setInterval(syncSettingsNav, 500);
        }
        else {
            document.body.classList.remove(BODY_CLASS);
            document.removeEventListener('pointerdown', onOutsidePointerDown, true);
            window.removeEventListener('keydown', onComposerKeyDown, true);
            window.removeEventListener('keyup', onComposerKeyUp, true);
            document.removeEventListener('click', onCollapseClick, true);
            if (settingsTimer !== null) {
                window.clearInterval(settingsTimer);
                settingsTimer = null;
            }
            document.getElementById(STYLE_ID)?.remove();
            button?.remove();
            button = null;
        }
    };
    const onResize = () => {
        if (button !== null)
            applyPos(button);
        apply();
    };
    handle.dispose = () => {
        if (active)
            apply();
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    apply();
    return handle;
}
