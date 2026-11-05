window.__ModuleLoader__.load({
	id: "wj-dsh-mobile",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/rail.ts
		/**
		* Portrait rail replacement.
		*
		* On a portrait touch viewport the official collapsed sidebar renders as a
		* 56px icon rail on the left. This layer hides that rail and puts one floating
		* button at the same spot (left of the title) that opens the sidebar drawer.
		*/
		const STYLE_ID = "wj-mobile-rail-style";
		const BUTTON_ID = "wj-mobile-rail-button";
		const BODY_CLASS = "wj-mobile-rail";
		const CSS = `
body.${BODY_CLASS} [class$="_frame"]{grid-template-columns:0 minmax(0,1fr) 0!important}
body.${BODY_CLASS} [class*="_centerCol"]{grid-column:1/-1!important}
body.${BODY_CLASS} [class*="_sidebarCol"]{position:fixed!important;top:0!important;bottom:0!important;left:0!important;width:min(86vw,360px)!important;max-width:86vw!important;z-index:2147482500!important;box-shadow:0 0 24px rgba(0,0,0,.28)!important;transition:transform .24s cubic-bezier(.4,0,.2,1),opacity .18s ease!important;will-change:transform;transform:translateX(0)!important;opacity:1!important}
body.${BODY_CLASS} [class$="_frame"][data-sidebar-collapsed] [class*="_sidebarCol"]{transform:translateX(-100%)!important;opacity:0!important;pointer-events:none!important}
body.${BODY_CLASS} [class$="_frame"][data-rightbar-fullscreen] [class*="_rightbarCol"]{display:block!important;position:fixed!important;inset:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;z-index:2147482600!important;background:var(--dsw-alias-bg-base)!important;transform:none!important;opacity:1!important;pointer-events:auto!important;box-shadow:-8px 0 24px rgba(0,0,0,.18)!important}
body.${BODY_CLASS} [class$="_titleRow"]{display:flex;align-items:center}
#${BUTTON_ID}{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;margin:0 4px 0 0;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer}
#${BUTTON_ID}:hover{background:var(--dsw-alias-interactive-bg-hover)}
#${BUTTON_ID}:active{opacity:.72}
#${BUTTON_ID} svg{width:16px;height:16px;display:block}
#${BUTTON_ID}[data-fallback]{position:fixed;top:calc(6px + env(safe-area-inset-top));left:calc(8px + env(safe-area-inset-left));z-index:2147482999;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 1px 6px rgba(0,0,0,.22)}
`;
		/** Whether the current viewport is the phone portrait context this targets. */
		function shouldActivate() {
			if (typeof window === "undefined") return false;
			if (!window.matchMedia("(orientation: portrait)").matches) return false;
			if (!window.matchMedia("(pointer: coarse)").matches) return false;
			return window.innerWidth < 1100;
		}
		/** Install the rail replacement; returns the handle to wire/dispose. */
		function startMobileRail() {
			const handle = {
				toggleSidebar: null,
				setEnabled: () => {},
				dispose: () => {}
			};
			if (typeof window === "undefined" || typeof document === "undefined") return handle;
			let enabled = true;
			let button = null;
			let active = false;
			const ensureStyle = () => {
				if (document.getElementById(STYLE_ID) !== null) return;
				const style = document.createElement("style");
				style.id = STYLE_ID;
				style.dataset.plugin = "wj-dsh-mobile";
				style.textContent = CSS;
				document.head.appendChild(style);
			};
			const removeStyle = () => {
				document.getElementById(STYLE_ID)?.remove();
			};
			const toggle = () => {
				if (handle.toggleSidebar !== null) try {
					handle.toggleSidebar();
					return;
				} catch {}
				document.querySelector("[class$=\"_collapsed\"] [class$=\"_toggle\"], [class$=\"_railFish\"] button")?.click();
			};
			let attachTimer = null;
			/** Place the button as the first child of the official header, else fall back to fixed. */
			const attach = (el) => {
				const header = [
					...document.querySelectorAll("[class$=\"_headerLeading\"]"),
					...document.querySelectorAll("[data-slot=\"conversation.header.leading\"]"),
					...document.querySelectorAll("[class$=\"_titleRow\"]"),
					...document.querySelectorAll("header[class$=\"_header\"]"),
					...document.querySelectorAll("[class$=\"_header\"]")
				].find((el) => {
					const rect = el.getBoundingClientRect();
					return rect.width > 0 && rect.height > 0;
				}) ?? null;
				if (header !== null) {
					if (el.parentElement !== header) header.insertBefore(el, header.firstChild);
					el.removeAttribute("data-fallback");
					if (attachTimer !== null) {
						window.clearInterval(attachTimer);
						attachTimer = null;
					}
					return;
				}
				if (el.parentElement !== document.body) document.body.appendChild(el);
				el.setAttribute("data-fallback", "true");
			};
			const ensureButton = () => {
				if (button !== null && button.isConnected) return button;
				const el = document.createElement("button");
				el.id = BUTTON_ID;
				el.type = "button";
				el.setAttribute("aria-label", "打开侧栏");
				el.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2.5\"/><path d=\"M9 4v16\"/></svg>";
				el.setAttribute("aria-label", "展开或折叠侧栏");
				el.addEventListener("click", (event) => {
					event.preventDefault();
					event.stopPropagation();
					toggle();
				});
				attach(el);
				if (attachTimer === null) attachTimer = window.setInterval(() => {
					if (button !== null) attach(button);
				}, 800);
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
				} else {
					document.body.classList.remove(BODY_CLASS);
					removeStyle();
					button?.remove();
					button = null;
					if (attachTimer !== null) {
						window.clearInterval(attachTimer);
						attachTimer = null;
					}
				}
			};
			handle.setEnabled = (value) => {
				enabled = value;
				apply();
			};
			handle.dispose = () => {
				enabled = false;
				apply();
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