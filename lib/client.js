window.__ModuleLoader__.load({
	id: "wj-dsh-mobile",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/rail.ts
		/**
		* Minimal portrait rail: hide the left rail and keep one floating top icon.
		*
		* Every earlier behaviour lives in /archive. This module only does two things:
		* the collapsed rail is taken out of the layout, and the rail's topmost glyph
		* becomes a fixed floating button at the top-left that opens the sidebar.
		*/
		const STYLE_ID = "wj-mini-rail-style";
		const BUTTON_ID = "wj-mini-rail-toggle";
		const BODY_CLASS = "wj-mini-rail";
		const CSS = `
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed]{grid-template-columns:minmax(0,1fr)!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{display:none!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_centerCol"]{grid-column:1/-1!important}
body.${BODY_CLASS} [class$="_frame"][data-rightbar-fullscreen] [class*="_rightbarCol"]{display:block!important;position:fixed!important;inset:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;z-index:2147482600!important;background:var(--dsw-alias-bg-base)!important;transform:none!important;opacity:1!important;pointer-events:auto!important;box-shadow:-8px 0 24px rgba(0,0,0,.18)!important}
#${BUTTON_ID}{position:fixed;top:calc(8px + env(safe-area-inset-top));left:calc(10px + env(safe-area-inset-left));z-index:2147482999;display:flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);box-shadow:0 1px 6px rgba(0,0,0,.22);cursor:pointer}
#${BUTTON_ID}:active{opacity:.72}
#${BUTTON_ID} svg{width:22px;height:22px;display:block}
`;
		/** Portrait touch viewport check. */
		function shouldActivate() {
			if (typeof window === "undefined") return false;
			if (!window.matchMedia("(orientation: portrait)").matches) return false;
			if (!window.matchMedia("(pointer: coarse)").matches) return false;
			return window.innerWidth < 1100;
		}
		function startMobileRail() {
			const handle = {
				toggleSidebar: null,
				dispose: () => {}
			};
			if (typeof window === "undefined" || typeof document === "undefined") return handle;
			let active = false;
			let button = null;
			let iconTimer = null;
			const ensureStyle = () => {
				if (document.getElementById(STYLE_ID) !== null) return;
				const style = document.createElement("style");
				style.id = STYLE_ID;
				style.dataset.plugin = "wj-dsh-mobile";
				style.textContent = CSS;
				document.head.appendChild(style);
			};
			/** Copy the rail's topmost glyph (the brand mark) once it exists. */
			const syncIcon = () => {
				if (button === null) return;
				const official = document.querySelector("[class$=\"_railFish\"] button svg, [class$=\"_railFish\"] svg");
				if (official !== null && button.innerHTML !== official.outerHTML) {
					button.innerHTML = official.outerHTML;
					if (iconTimer !== null) {
						window.clearInterval(iconTimer);
						iconTimer = null;
					}
				}
			};
			const toggle = () => {
				try {
					handle.toggleSidebar?.();
				} catch {}
			};
			const ensureButton = () => {
				if (button !== null && button.isConnected) return;
				const el = document.createElement("button");
				el.id = BUTTON_ID;
				el.type = "button";
				el.setAttribute("aria-label", "打开侧栏");
				el.addEventListener("click", (event) => {
					event.preventDefault();
					event.stopPropagation();
					toggle();
				});
				document.body.appendChild(el);
				button = el;
				syncIcon();
			};
			const apply = () => {
				const next = shouldActivate();
				if (next === active) return;
				active = next;
				if (active) {
					document.body.classList.add(BODY_CLASS);
					ensureStyle();
					ensureButton();
					if (iconTimer === null) iconTimer = window.setInterval(syncIcon, 800);
				} else {
					document.body.classList.remove(BODY_CLASS);
					document.getElementById(STYLE_ID)?.remove();
					button?.remove();
					button = null;
					if (iconTimer !== null) {
						window.clearInterval(iconTimer);
						iconTimer = null;
					}
				}
			};
			handle.dispose = () => {
				if (active) apply();
				window.removeEventListener("resize", apply);
				window.removeEventListener("orientationchange", apply);
			};
			window.addEventListener("resize", apply);
			window.addEventListener("orientationchange", apply);
			apply();
			return handle;
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* wj-dsh-mobile — browser half.
		*
		* Currently active adaptation: the portrait rail replacement (hide the icon
		* rail, pin one sidebar button where it was). The full touch layer stays
		* archived under /archive and can be recalled piece by piece.
		*/
		const inject = ["layout"];
		function apply(ctx) {
			const rail = startMobileRail();
			const layout = ctx.get("layout");
			if (typeof layout?.toggleSidebar === "function") rail.toggleSidebar = () => {
				try {
					layout.toggleSidebar?.();
				} catch {}
			};
			ctx.effect?.(() => () => rail.dispose(), "wj-dsh-mobile: rail");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map