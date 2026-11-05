/**
 * Portrait rail replacement.
 *
 * On a portrait touch viewport the official collapsed sidebar renders as a
 * 56px icon rail on the left. This layer hides that rail and puts one floating
 * button at the same spot (left of the title) that opens the sidebar drawer.
 */
const STYLE_ID = 'wj-mobile-rail-style';
const BUTTON_ID = 'wj-mobile-rail-button';
const BODY_CLASS = 'wj-mobile-rail';
const CSS = `
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{display:none!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed]{grid-template-columns:0 minmax(0,1fr) 0!important}
body.${BODY_CLASS} [class$="_titleRow"]{padding-left:44px}
#${BUTTON_ID}{position:fixed;top:calc(6px + env(safe-area-inset-top));left:calc(8px + env(safe-area-inset-left));z-index:2147482999;width:34px;height:34px;padding:0;border-radius:10px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.22)}
#${BUTTON_ID}:active{opacity:.72}
#${BUTTON_ID} svg{width:18px;height:18px;display:block}
`;
/** Whether the current viewport is the phone portrait context this targets. */
function shouldActivate() {
    if (typeof window === 'undefined')
        return false;
    if (!window.matchMedia('(orientation: portrait)').matches)
        return false;
    if (!window.matchMedia('(pointer: coarse)').matches)
        return false;
    return window.innerWidth < 1100;
}
/** Install the rail replacement; returns the handle to wire/dispose. */
export function startMobileRail() {
    const handle = { toggleSidebar: null, setEnabled: () => { }, dispose: () => { } };
    if (typeof window === 'undefined' || typeof document === 'undefined')
        return handle;
    let enabled = true;
    let button = null;
    let active = false;
    const ensureStyle = () => {
        if (document.getElementById(STYLE_ID) !== null)
            return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.dataset.plugin = 'wj-dsh-mobile';
        style.textContent = CSS;
        document.head.appendChild(style);
    };
    const removeStyle = () => {
        document.getElementById(STYLE_ID)?.remove();
    };
    const toggle = () => {
        if (handle.toggleSidebar !== null) {
            try {
                handle.toggleSidebar();
                return;
            }
            catch {
                // fall through to the DOM fallback
            }
        }
        // Fallback: click the official rail toggle when it is still mounted.
        ;
        document.querySelector('[class$="_collapsed"] [class$="_toggle"], [class$="_railFish"] button')?.click();
    };
    const ensureButton = () => {
        if (button !== null && button.isConnected)
            return button;
        const el = document.createElement('button');
        el.id = BUTTON_ID;
        el.type = 'button';
        el.setAttribute('aria-label', '打开侧栏');
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
        el.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggle();
        });
        document.body.appendChild(el);
        button = el;
        return el;
    };
    const apply = () => {
        const next = enabled && shouldActivate();
        if (next === active) {
            if (next) {
                ensureStyle();
                ensureButton();
            }
            return;
        }
        active = next;
        if (active) {
            document.body.classList.add(BODY_CLASS);
            ensureStyle();
            ensureButton();
        }
        else {
            document.body.classList.remove(BODY_CLASS);
            removeStyle();
            button?.remove();
            button = null;
        }
    };
    handle.setEnabled = (value) => {
        enabled = value;
        apply();
    };
    handle.dispose = () => {
        enabled = false;
        apply();
        window.removeEventListener('resize', apply);
        window.removeEventListener('orientationchange', apply);
    };
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    apply();
    return handle;
}
