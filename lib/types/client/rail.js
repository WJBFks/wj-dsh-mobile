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
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed]{grid-template-columns:minmax(0,1fr)!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{display:none!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_centerCol"]{grid-column:1/-1!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_rightbarCol"]{display:none!important}
body.${BODY_CLASS} [class$="_titleRow"]{display:flex;align-items:center}
body.${BODY_CLASS} [data-rightbar-col="true"]{display:none!important}
#${BUTTON_ID}{display:inline-flex;align-items:center;justify-content:center;flex:none;width:32px;height:32px;margin:0 6px 0 2px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer}
#${BUTTON_ID}:hover{background:var(--dsw-alias-interactive-bg-hover)}
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
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M5.5 8h1M5.5 12h1"/></svg>';
        el.setAttribute('aria-label', '展开或折叠侧栏');
        el.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggle();
        });
        const header = document.querySelector('[class$="_titleRow"]') ?? document.querySelector('[class$="_header"]');
        if (header === null) {
            ;
            document.body.appendChild(el);
        }
        else {
            header.insertBefore(el, header.firstChild);
        }
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
